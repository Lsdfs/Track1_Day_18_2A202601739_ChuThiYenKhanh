from fastapi import APIRouter, HTTPException
from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.ai_service import ai_service
from app.tools import TOOL_REGISTRY, build_hardcoded_summary, is_summary_request

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return {"status": "ok", "ai_enabled": settings.ai_enabled, "provider": "gemini", "model": settings.gemini_model}


@router.get("/tools")
def tools() -> dict:
    return {"tools": list(TOOL_REGISTRY)}


@router.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest) -> ChatResponse:
    wants_summary = is_summary_request(payload.message)
    if not settings.ai_enabled:
        if wants_summary:
            return ChatResponse(type="lesson-summary", summary=build_hardcoded_summary(), source="hardcoded", downloadable_pdf=True)
        return ChatResponse(type="text", message="Prototype chưa có API key. Hãy yêu cầu tóm tắt để dùng luồng hardcoded.", source="hardcoded")
    try:
        if wants_summary:
            if not payload.lesson_context:
                return ChatResponse(type="lesson-summary", summary=build_hardcoded_summary(), source="hardcoded", downloadable_pdf=True)
            return ChatResponse(type="lesson-summary", summary=ai_service.summarize(payload.lesson_context), source="gemini", downloadable_pdf=True)
        return ChatResponse(type="text", message=ai_service.answer(payload.message, payload.lesson_context or ""), source="gemini")
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"AI provider error: {exc}") from exc
