import json
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, StreamingResponse

from app.core.config import settings
from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    QuizResult,
    QuizSubmission,
    ReviewProposalRequest,
    ReviewProposalResponse,
)
from app.services.ai_service import ai_service
from app.services.mastery_service import get_mastery, grade_quiz
from app.services.quiz_store import get_quiz
from app.services.summary_pdf_service import GENERATED_DIR
from app.tools import TOOL_REGISTRY
from app.tools.lesson_summary_tool import LessonNotFoundError, resolve_lesson

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "ai_enabled": settings.ai_enabled,
        "service": "ViAI",
        "model_status": "configured" if settings.ai_enabled else "not_configured",
    }


@router.get("/tools")
def tools() -> dict:
    return {"tools": list(TOOL_REGISTRY)}


@router.get("/lessons/{lesson_id}")
def get_lesson(lesson_id: str) -> dict:
    try:
        lesson = resolve_lesson(lesson_id)
        return {"id": lesson["id"], "title": lesson["title"], "file": lesson["file"]}
    except LessonNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/quizzes/{quiz_id}")
def read_quiz(quiz_id: str) -> dict:
    try:
        return {"quiz": get_quiz(quiz_id).model_dump()}
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Quiz not found") from exc


@router.post("/quizzes/{quiz_id}/submit", response_model=QuizResult)
def submit_quiz(quiz_id: str, payload: QuizSubmission) -> QuizResult:
    try:
        return grade_quiz(quiz_id, payload)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Quiz not found") from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@router.get("/mastery/{conversation_id}/{lesson_id}")
def read_mastery(conversation_id: str, lesson_id: str) -> dict:
    try:
        resolve_lesson(lesson_id)
        return {"mastery": get_mastery(conversation_id, lesson_id)}
    except LessonNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    try:
        return ai_service.run(payload)
    except LessonNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="ViAI tạm thời chưa xử lý được yêu cầu. Vui lòng thử lại sau.",
        ) from exc


@router.post("/review-proposals", response_model=ReviewProposalResponse)
def create_review_proposals(payload: ReviewProposalRequest) -> ReviewProposalResponse:
    if not settings.ai_enabled:
        raise HTTPException(
            status_code=503,
            detail="ViAI chưa được cấu hình. Hãy thêm GEMINI_API_KEY vào backend/.env rồi khởi động lại backend.",
        )
    try:
        return ai_service.create_review_proposals(payload)
    except LessonNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="ViAI tạm thời chưa tạo được bản ôn tập. Vui lòng thử lại.",
        ) from exc


@router.post("/review-proposals/stream")
def stream_review_proposals(payload: ReviewProposalRequest) -> StreamingResponse:
    if not settings.ai_enabled:
        raise HTTPException(
            status_code=503,
            detail="ViAI chưa được cấu hình. Hãy thêm GEMINI_API_KEY vào backend/.env rồi khởi động lại backend.",
        )
    try:
        resolve_lesson(payload.lesson_id)
    except LessonNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    def event_stream():
        yield json.dumps({"type": "progress", "stage": "reading", "message": "Đang đọc các dấu vết đã chọn…"}, ensure_ascii=False) + "\n"
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(ai_service.create_review_proposals, payload)
            elapsed = 0
            while not future.done():
                time.sleep(1)
                elapsed += 1
                if elapsed < 4:
                    stage, message = "context", "Đang tìm context ở các trang liên quan…"
                elif elapsed < 10:
                    stage, message = "grouping", "Đang phân nhóm note và highlight…"
                else:
                    stage, message = "writing", "Đang viết nội dung ôn tập và câu tự kiểm tra…"
                yield json.dumps({
                    "type": "progress",
                    "stage": stage,
                    "message": message,
                    "elapsed": elapsed,
                }, ensure_ascii=False) + "\n"
            try:
                result = future.result()
                yield json.dumps({"type": "result", "data": result.model_dump(mode="json")}, ensure_ascii=False) + "\n"
            except Exception:
                yield json.dumps({
                    "type": "error",
                    "message": "ViAI tạm thời chưa tạo được bản ôn tập. Vui lòng thử lại.",
                }, ensure_ascii=False) + "\n"

    return StreamingResponse(
        event_stream(),
        media_type="application/x-ndjson",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/files/{filename}")
def download_summary(filename: str) -> FileResponse:
    safe_name = Path(filename).name
    if safe_name != filename or not safe_name.endswith(".pdf"):
        raise HTTPException(status_code=404, detail="File not found")
    path = (GENERATED_DIR / safe_name).resolve()
    if GENERATED_DIR.resolve() not in path.parents or not path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path, media_type="application/pdf", filename=safe_name)
