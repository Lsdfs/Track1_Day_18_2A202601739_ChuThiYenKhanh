from typing import Literal
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    lesson_id: str = "day02-business-problem-for-ai"
    lesson_context: str | None = Field(default=None, max_length=50000)


class SummarySection(BaseModel):
    title: str
    content: str


class SummaryPayload(BaseModel):
    greeting: str
    overview: str
    sections: list[SummarySection]
    key_takeaways: list[str]


class ChatResponse(BaseModel):
    type: Literal["text", "lesson-summary"]
    message: str | None = None
    summary: SummaryPayload | None = None
    source: Literal["gemini", "hardcoded"]
    downloadable_pdf: bool = False
