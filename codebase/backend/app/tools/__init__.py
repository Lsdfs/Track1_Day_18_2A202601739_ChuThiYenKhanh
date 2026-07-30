from app.tools.quiz_tool import generate_quiz
from app.tools.summary_tool import build_hardcoded_summary, is_summary_request

TOOL_REGISTRY = {"summarize_lesson": build_hardcoded_summary, "generate_quiz": generate_quiz}
__all__ = ["TOOL_REGISTRY", "build_hardcoded_summary", "generate_quiz", "is_summary_request"]
