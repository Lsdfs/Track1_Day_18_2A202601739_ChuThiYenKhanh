from typing import Literal

from pydantic import BaseModel, Field


class HistoryItem(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=5000)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    lesson_id: str = Field(min_length=1, max_length=120)
    conversation_id: str | None = Field(default=None, max_length=120)
    history: list[HistoryItem] = Field(default_factory=list, max_length=20)


class SummarySection(BaseModel):
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)


class SummaryPayload(BaseModel):
    greeting: str = ""
    overview: str = Field(min_length=1)
    sections: list[SummarySection] = Field(min_length=1, max_length=10)
    key_concepts: list[str] = Field(default_factory=list, max_length=20)
    key_takeaways: list[str] = Field(min_length=1, max_length=8)
    scope: str = "whole_lesson"


class QuizQuestion(BaseModel):
    id: int | str
    question: str = Field(min_length=1)
    options: list[str] = Field(min_length=4, max_length=4)
    correct_answer: int = Field(ge=0, le=3)
    explanation: str = Field(min_length=1)
    section_id: str = "general"
    section_title: str = "Nội dung bài giảng"
    concept: str = "Kiến thức tổng hợp"
    difficulty: Literal["easy", "medium", "hard"] = "medium"
    source_pages: list[int] = Field(default_factory=list)
    misconception_target: str = ""


class QuizScope(BaseModel):
    type: Literal["whole_lesson", "selected_range"] = "whole_lesson"
    value: str = "all"


class QuizPayload(BaseModel):
    id: str | None = None
    lesson_id: str | None = None
    title: str = Field(min_length=1)
    description: str = ""
    questions: list[QuizQuestion] = Field(min_length=1, max_length=20)
    scope: QuizScope = Field(default_factory=QuizScope)


class GeminiQuizQuestion(BaseModel):
    id: int | str
    question: str = Field(min_length=1)
    options: list[str] = Field(min_length=4, max_length=4)
    correct_answer: int = Field(ge=0, le=3)
    explanation: str = Field(min_length=1)


class AdaptiveQuizQuestion(GeminiQuizQuestion):
    section_id: str = Field(min_length=1)
    section_title: str = Field(min_length=1)
    concept: str = Field(min_length=1)
    difficulty: Literal["easy", "medium", "hard"]
    source_pages: list[int] = Field(min_length=1)
    misconception_target: str = Field(min_length=1)


class GeminiQuizPayload(BaseModel):
    title: str = Field(min_length=1)
    description: str = ""
    questions: list[GeminiQuizQuestion] = Field(min_length=1, max_length=20)


class AdaptiveQuizPayload(BaseModel):
    title: str = Field(min_length=1)
    description: str
    questions: list[AdaptiveQuizQuestion] = Field(min_length=1, max_length=20)


class GeminiQuizOutput(BaseModel):
    type: Literal["quiz-ready"]
    message: str
    quiz: GeminiQuizPayload


class QuizQuestionMetadata(BaseModel):
    question_id: str
    section_id: str
    section_title: str
    concept: str
    difficulty: Literal["easy", "medium", "hard"]
    source_page: int
    misconception_target: str


class QuizMetadataOutput(BaseModel):
    items: list[QuizQuestionMetadata] = Field(min_length=1, max_length=20)


class GeminiSummaryOutput(BaseModel):
    type: Literal["lesson-summary"]
    message: str
    summary: SummaryPayload


class GeminiContextAnswer(BaseModel):
    type: Literal["text"]
    message: str = Field(min_length=1)
    grounded_in_lesson: bool
    used_general_knowledge: bool


class GeminiTutorOutput(BaseModel):
    type: Literal["text", "lesson-summary", "quiz-ready"]
    message: str = ""
    summary: SummaryPayload | None = None
    quiz: GeminiQuizPayload | None = None


class ChatResponse(BaseModel):
    type: Literal["text", "lesson-summary", "quiz-ready", "error"]
    message: str | None = None
    summary: SummaryPayload | None = None
    download_url: str | None = None
    quiz: QuizPayload | None = None
    quiz_url: str | None = None
    grounded_in_lesson: bool | None = None
    used_general_knowledge: bool | None = None
    source: Literal["viai", "hardcoded"]


class SubmittedAnswer(BaseModel):
    question_id: str | int
    selected_answer: int = Field(ge=0, le=3)


class QuizSubmission(BaseModel):
    conversation_id: str = Field(min_length=1, max_length=120)
    answers: list[SubmittedAnswer] = Field(min_length=1, max_length=20)


class ConceptMastery(BaseModel):
    concept: str
    previous_mastery: int | None = None
    latest_test_score: int
    new_mastery: int
    level: str
    evidence_count: int
    confidence: Literal["low", "medium", "high"]


class QuizResult(BaseModel):
    response_type: Literal["quiz_result", "mastery_achieved"]
    quiz_id: str
    lesson_id: str
    score: dict
    mastery: dict
    strengths: list[dict]
    weak_areas: list[dict]
    question_results: list[dict]
    next_actions: list[dict]
    congratulation: dict | None = None
