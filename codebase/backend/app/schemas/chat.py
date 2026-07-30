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
    key_takeaways: list[str] = Field(min_length=1, max_length=8)


class QuizQuestion(BaseModel):
    id: int | str
    question: str = Field(min_length=1)
    options: list[str] = Field(min_length=4, max_length=4)
    correct_answer: int = Field(ge=0, le=3)
    explanation: str = Field(min_length=1)


class QuizPayload(BaseModel):
    id: str | None = None
    lesson_id: str | None = None
    title: str = Field(min_length=1)
    description: str = ""
    questions: list[QuizQuestion] = Field(min_length=1, max_length=20)


class GeminiTutorOutput(BaseModel):
    type: Literal["text", "lesson-summary", "quiz-ready"]
    message: str = ""
    summary: SummaryPayload | None = None
    quiz: QuizPayload | None = None


class ChatResponse(BaseModel):
    type: Literal["text", "lesson-summary", "quiz-ready", "error"]
    message: str | None = None
    summary: SummaryPayload | None = None
    download_url: str | None = None
    quiz: QuizPayload | None = None
    quiz_url: str | None = None
    source: Literal["gemini", "hardcoded"]
