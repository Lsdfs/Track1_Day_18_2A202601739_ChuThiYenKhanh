from app.tools.lesson_summary_tool import get_lesson_content, resolve_lesson
from app.services.quiz_store import save_quiz

TOOL_REGISTRY = {
    "get_current_lesson_content": get_lesson_content,
    "save_current_lesson_quiz": save_quiz,
}

__all__ = ["TOOL_REGISTRY", "get_lesson_content", "resolve_lesson", "save_quiz"]
