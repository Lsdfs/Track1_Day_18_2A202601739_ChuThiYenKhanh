import json
import re
import uuid
from pathlib import Path

from app.schemas.chat import QuizPayload


QUIZ_DIR = Path(__file__).resolve().parents[3] / "frontend" / "data" / "generated" / "quizzes"


def _safe_id(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_-]", "-", value).strip("-")[:100]


def save_quiz(lesson_id: str, title: str, description: str, questions: list[dict]) -> dict:
    """Validate and persist an AI-generated quiz as JSON in frontend/data."""
    quiz_id = f"quiz-{_safe_id(lesson_id)}-{uuid.uuid4().hex[:8]}"
    quiz = QuizPayload.model_validate({
        "id": quiz_id,
        "lesson_id": lesson_id,
        "title": title,
        "description": description,
        "questions": questions,
    })
    question_ids = [str(question.id) for question in quiz.questions]
    if len(question_ids) != len(set(question_ids)):
        raise ValueError("Quiz question IDs must be unique")
    QUIZ_DIR.mkdir(parents=True, exist_ok=True)
    (QUIZ_DIR / f"{quiz_id}.json").write_text(quiz.model_dump_json(indent=2), encoding="utf-8")
    return {
        "quiz_id": quiz_id,
        "quiz_url": f"/quiz/{quiz_id}",
        "quiz": quiz.model_dump(),
    }


def get_quiz(quiz_id: str) -> QuizPayload:
    safe_id = _safe_id(quiz_id)
    if safe_id != quiz_id:
        raise FileNotFoundError(quiz_id)
    path = QUIZ_DIR / f"{safe_id}.json"
    if not path.is_file():
        raise FileNotFoundError(quiz_id)
    return QuizPayload.model_validate(json.loads(path.read_text(encoding="utf-8")))
