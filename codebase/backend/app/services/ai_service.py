import time

from google import genai
from google.genai import types

from app.core.config import settings
from app.prompts import load_prompt
from app.schemas.chat import ChatRequest, ChatResponse, GeminiTutorOutput
from app.services.quiz_store import save_quiz
from app.services.summary_pdf_service import create_summary_pdf
from app.tools.lesson_summary_tool import get_lesson_content


class AIService:
    def __init__(self) -> None:
        self.system_prompt = load_prompt("system_prompt.md")
        self.client = genai.Client(api_key=settings.gemini_api_key) if settings.ai_enabled else None

    def run(self, payload: ChatRequest) -> ChatResponse:
        if not self.client:
            return ChatResponse(
                type="error",
                message="Backend chưa được cấu hình GEMINI_API_KEY.",
                source="hardcoded",
            )

        tool_state: dict = {}

        def get_current_lesson_content() -> dict:
            """Read the trusted PDF for the current lesson selected in the frontend."""
            lesson = get_lesson_content(payload.lesson_id)
            tool_state["lesson"] = lesson
            return lesson

        history_text = "\n".join(f"{item.role}: {item.content}" for item in payload.history[-8:])
        contents = (
            f"LESSON_ID HIỆN TẠI: {payload.lesson_id}\n"
            f"LỊCH SỬ GẦN NHẤT:\n{history_text or '(trống)'}\n\n"
            f"YÊU CẦU NGƯỜI DÙNG:\n{payload.message}"
        )
        config = types.GenerateContentConfig(
            system_instruction=self.system_prompt,
            tools=[get_current_lesson_content],
            automatic_function_calling=types.AutomaticFunctionCallingConfig(maximum_remote_calls=3),
            response_mime_type="application/json",
            response_schema=GeminiTutorOutput,
            temperature=0.2,
        )
        response = None
        last_error = None
        models = list(dict.fromkeys([settings.gemini_model, settings.gemini_fallback_model]))
        for model in models:
            for attempt in range(2):
                try:
                    response = self.client.models.generate_content(model=model, contents=contents, config=config)
                    break
                except Exception as exc:
                    last_error = exc
                    retryable = any(code in str(exc) for code in ("429", "503", "RESOURCE_EXHAUSTED", "UNAVAILABLE"))
                    if not retryable:
                        break
                    time.sleep(1.5 * (attempt + 1))
            if response is not None:
                break
        if response is None:
            raise RuntimeError(f"All configured Gemini models failed: {last_error}") from last_error

        output = response.parsed
        if not isinstance(output, GeminiTutorOutput):
            if not response.text:
                raise ValueError("Gemini returned neither structured output nor a saved quiz artifact")
            output = GeminiTutorOutput.model_validate_json(response.text)

        if output.type == "lesson-summary":
            if output.summary is None:
                raise ValueError("Gemini returned lesson-summary without summary data")
            lesson = tool_state.get("lesson")
            if not lesson:
                raise ValueError("Gemini did not call get_current_lesson_content")
            artifact = create_summary_pdf(
                lesson_id=lesson["lesson_id"],
                lesson_title=lesson["title"],
                summary=output.summary,
            )
            return ChatResponse(
                type="lesson-summary",
                message=output.message or "Mình đã đọc slide và tạo bản tóm tắt.",
                summary=output.summary,
                download_url=artifact["download_url"],
                source="gemini",
            )

        if output.type == "quiz-ready":
            if output.quiz is None:
                raise ValueError("Gemini returned quiz-ready without quiz data")
            lesson = tool_state.get("lesson")
            if not lesson:
                raise ValueError("Gemini did not call get_current_lesson_content before creating quiz")
            artifact = save_quiz(
                lesson_id=lesson["lesson_id"],
                title=output.quiz.title,
                description=output.quiz.description,
                questions=[question.model_dump() for question in output.quiz.questions],
            )
            return ChatResponse(
                type="quiz-ready",
                message=output.message or "Mình đã tạo quiz từ nội dung bài giảng.",
                quiz=artifact["quiz"],
                quiz_url=artifact["quiz_url"],
                source="gemini",
            )

        return ChatResponse(type="text", message=output.message, source="gemini")


ai_service = AIService()
