from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import ai_service
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
        "provider": "gemini",
        "model": settings.gemini_model,
        "fallback_model": settings.gemini_fallback_model,
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


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    try:
        return ai_service.run(payload)
    except LessonNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Gemini/tool error: {exc}") from exc


@router.get("/files/{filename}")
def download_summary(filename: str) -> FileResponse:
    safe_name = Path(filename).name
    if safe_name != filename or not safe_name.endswith(".pdf"):
        raise HTTPException(status_code=404, detail="File not found")
    path = (GENERATED_DIR / safe_name).resolve()
    if GENERATED_DIR.resolve() not in path.parents or not path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(path, media_type="application/pdf", filename=safe_name)
