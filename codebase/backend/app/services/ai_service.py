import json
from google import genai

from app.core.config import settings
from app.prompts import load_prompt
from app.schemas.chat import SummaryPayload


class AIService:
    def __init__(self) -> None:
        self.system_prompt = load_prompt("system_prompt.md")
        self.client = genai.Client(api_key=settings.gemini_api_key) if settings.ai_enabled else None

    def summarize(self, context: str) -> SummaryPayload:
        if not self.client:
            raise RuntimeError("AI provider is not configured")
        schema = '{"greeting":"string","overview":"string","sections":[{"title":"string","content":"string"}],"key_takeaways":["string"]}'
        response = self.client.models.generate_content(
            model=settings.gemini_model,
            contents=f"{self.system_prompt}\nTrả JSON theo schema {schema}\nBÀI GIẢNG:\n{context}",
            config={"response_mime_type": "application/json"},
        )
        return SummaryPayload.model_validate(json.loads(response.text))

    def answer(self, message: str, context: str = "") -> str:
        if not self.client:
            raise RuntimeError("AI provider is not configured")
        response = self.client.models.generate_content(
            model=settings.gemini_model,
            contents=f"{self.system_prompt}\nNGỮ CẢNH:\n{context}\nCÂU HỎI:\n{message}",
        )
        return response.text


ai_service = AIService()
