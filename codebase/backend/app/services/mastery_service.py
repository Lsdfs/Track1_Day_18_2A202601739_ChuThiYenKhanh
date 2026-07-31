import json
import re
from collections import defaultdict
from pathlib import Path

from app.schemas.chat import QuizResult, QuizSubmission
from app.services.quiz_store import get_quiz


MASTERY_DIR = Path(__file__).resolve().parents[3] / "frontend" / "data" / "generated" / "mastery"


def _safe_id(value: str) -> str:
    return re.sub(r"[^a-zA-Z0-9_-]", "-", value).strip("-")[:120]


def _level(score: int) -> str:
    if score >= 95:
        return "Thành thạo tối đa"
    if score >= 80:
        return "Thành thạo"
    if score >= 60:
        return "Khá thành thạo"
    if score >= 40:
        return "Đang hình thành"
    return "Chưa nắm vững"


def _load_mastery(conversation_id: str, lesson_id: str) -> dict:
    path = MASTERY_DIR / f"{_safe_id(conversation_id)}--{_safe_id(lesson_id)}.json"
    if not path.is_file():
        return {"concepts": {}, "attempts": 0}
    return json.loads(path.read_text(encoding="utf-8"))


def _save_mastery(conversation_id: str, lesson_id: str, data: dict) -> None:
    MASTERY_DIR.mkdir(parents=True, exist_ok=True)
    path = MASTERY_DIR / f"{_safe_id(conversation_id)}--{_safe_id(lesson_id)}.json"
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def grade_quiz(quiz_id: str, submission: QuizSubmission) -> QuizResult:
    quiz = get_quiz(quiz_id)
    answers = {str(item.question_id): item.selected_answer for item in submission.answers}
    if len(answers) != len(quiz.questions):
        raise ValueError("Bạn phải trả lời đầy đủ tất cả câu hỏi trước khi nộp bài")

    previous = _load_mastery(submission.conversation_id, quiz.lesson_id or "unknown")
    by_concept: dict[str, list[bool]] = defaultdict(list)
    results = []
    correct_count = 0

    for question in quiz.questions:
        key = str(question.id)
        if key not in answers:
            raise ValueError(f"Thiếu đáp án cho câu {key}")
        is_correct = answers[key] == question.correct_answer
        correct_count += int(is_correct)
        by_concept[question.concept].append(is_correct)
        results.append({
            "question_id": question.id,
            "selected_answer": answers[key],
            "correct_answer": question.correct_answer,
            "correct": is_correct,
            "explanation": question.explanation,
            "concept": question.concept,
            "section_title": question.section_title,
        })

    tested_concepts = []
    updated_concepts = dict(previous.get("concepts", {}))
    for concept, marks in by_concept.items():
        latest = round(sum(marks) / len(marks) * 100)
        old_entry = previous.get("concepts", {}).get(concept)
        old_score = old_entry.get("mastery") if old_entry else None
        new_score = latest if old_score is None else round(old_score * 0.4 + latest * 0.6)
        old_evidence = old_entry.get("evidence_count", 0) if old_entry else 0
        evidence = old_evidence + len(marks)
        confidence = "high" if evidence >= 6 else "medium" if evidence >= 3 else "low"
        updated_concepts[concept] = {"mastery": new_score, "evidence_count": evidence}
        tested_concepts.append({
            "concept": concept,
            "previous_mastery": old_score,
            "latest_test_score": latest,
            "new_mastery": new_score,
            "level": _level(new_score),
            "evidence_count": evidence,
            "confidence": confidence,
            "updated_this_attempt": True,
        })

    tested_names = {item["concept"] for item in tested_concepts}
    untouched_concepts = [
        {
            "concept": concept,
            "previous_mastery": item["mastery"],
            "latest_test_score": None,
            "new_mastery": item["mastery"],
            "level": _level(item["mastery"]),
            "evidence_count": item.get("evidence_count", 0),
            "confidence": (
                "high" if item.get("evidence_count", 0) >= 6
                else "medium" if item.get("evidence_count", 0) >= 3
                else "low"
            ),
            "updated_this_attempt": False,
        }
        for concept, item in previous.get("concepts", {}).items()
        if concept not in tested_names
    ]
    concepts = tested_concepts + untouched_concepts

    lesson_mastery = round(
        sum(item["new_mastery"] * item["evidence_count"] for item in concepts)
        / max(1, sum(item["evidence_count"] for item in concepts))
    )
    strengths = [
        {"concept": item["concept"], "mastery": item["new_mastery"]}
        for item in sorted(concepts, key=lambda x: x["new_mastery"], reverse=True)
        if item["new_mastery"] >= 80
    ][:3]
    weak_areas = [
        {
            "concept": item["concept"],
            "mastery": item["new_mastery"],
            "diagnosis": f"Cần củng cố các câu hỏi thuộc khái niệm {item['concept']}.",
            "recommended_action": "review",
        }
        for item in sorted(concepts, key=lambda x: x["new_mastery"])
        if item["new_mastery"] < 80
    ][:3]
    important_mastered = all(item["new_mastery"] >= 90 for item in concepts)
    enough_evidence = all(item["evidence_count"] >= 3 for item in concepts)
    achieved = lesson_mastery >= 95 and important_mastered and enough_evidence

    state = {
        "conversation_id": submission.conversation_id,
        "lesson_id": quiz.lesson_id,
        "attempts": previous.get("attempts", 0) + 1,
        "lesson_mastery": lesson_mastery,
        "concepts": updated_concepts,
    }
    _save_mastery(submission.conversation_id, quiz.lesson_id or "unknown", state)

    percentage = round(correct_count / len(quiz.questions) * 100)
    return QuizResult(
        response_type="mastery_achieved" if achieved else "quiz_result",
        quiz_id=quiz_id,
        lesson_id=quiz.lesson_id or "unknown",
        score={"correct": correct_count, "total": len(quiz.questions), "percentage": percentage},
        mastery={
            "lesson_mastery": lesson_mastery,
            "lesson_level": _level(lesson_mastery),
            "concepts": concepts,
        },
        strengths=strengths,
        weak_areas=weak_areas,
        question_results=results,
        next_actions=[
            {"action": "review_weak_areas", "label": "Ôn và luyện các phần chưa tốt"},
            {"action": "retest", "label": "Làm một bài kiểm tra mới"},
        ],
        congratulation={
            "title": "Chúc mừng!",
            "message": "Bạn đã đạt mức thành thạo tối đa cho bài học này.",
            "next_suggestion": "Chuyển sang bài tiếp theo hoặc làm bài thử thách nâng cao.",
        } if achieved else None,
    )


def get_mastery(conversation_id: str, lesson_id: str) -> dict:
    data = _load_mastery(conversation_id, lesson_id)
    concepts = [
        {
            "concept": name,
            "mastery": item["mastery"],
            "level": _level(item["mastery"]),
            "evidence_count": item["evidence_count"],
        }
        for name, item in data.get("concepts", {}).items()
    ]
    return {
        "lesson_id": lesson_id,
        "lesson_mastery": data.get("lesson_mastery"),
        "lesson_level": _level(data["lesson_mastery"]) if data.get("lesson_mastery") is not None else "Chưa có dữ liệu",
        "attempts": data.get("attempts", 0),
        "concepts": concepts,
    }
