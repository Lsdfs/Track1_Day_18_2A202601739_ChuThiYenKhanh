import { sendMockTutorMessage } from "./mockAgentApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";

export async function sendTutorMessage({ lessonId, conversationId, message, history = [] }) {
  const payload = {
    lesson_id: lessonId,
    conversation_id: conversationId,
    message,
    history: history.map(item => ({
      role: item.role === "assistant" ? "assistant" : "user",
      content: item.text ?? item.message ?? ""
    })).filter(item => item.content)
  };

  if (USE_MOCK_API) return sendMockTutorMessage(payload);

  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.detail ?? data?.message ?? `Tutor API returned ${response.status}`);
  }
  return validateTutorResponse(data);
}

function validateTutorResponse(data) {
  const acceptedTypes = ["text", "lesson-summary", "quiz-ready", "error"];
  if (!data || !acceptedTypes.includes(data.type)) {
    throw new Error("Backend returned an unsupported response type");
  }
  if (data.type === "lesson-summary" && !data.summary) {
    throw new Error("Summary response is missing summary data");
  }
  if (data.type === "quiz-ready" && !data.quiz) {
    throw new Error("Quiz response is missing quiz data");
  }
  if (data.download_url?.startsWith("/")) {
    data.download_url = new URL(data.download_url, API_BASE_URL).href;
  }
  return data;
}
