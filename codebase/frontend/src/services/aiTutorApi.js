import { sendMockTutorMessage } from "./mockAgentApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === "true";
export const API_DISPLAY_URL = API_BASE_URL.replace(/\/api\/?$/, "");

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

export async function getQuizById(quizId) {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(quizId)}`);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message ?? `Quiz API returned ${response.status}`);
  return validateQuiz(data?.quiz ?? data);
}

export async function submitQuiz({ quizId, conversationId, answers }) {
  const response = await fetch(`${API_BASE_URL}/quizzes/${encodeURIComponent(quizId)}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      conversation_id: conversationId,
      answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        question_id: questionId,
        selected_answer: selectedAnswer
      }))
    })
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.detail ?? `Submit API returned ${response.status}`);
  return data;
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
  if (data.type === "quiz-ready") data.quiz = validateQuiz(data.quiz);
  if (data.download_url?.startsWith("/")) {
    data.download_url = new URL(data.download_url, API_BASE_URL).href;
  }
  return data;
}

function validateQuiz(quiz) {
  if (!quiz?.id || !quiz?.title || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    throw new Error("Backend returned an invalid quiz");
  }
  quiz.questions.forEach((question, index) => {
    const validAnswer = Number.isInteger(question.correct_answer)
      && question.correct_answer >= 0
      && question.correct_answer <= 3;
    if (
      question.id === undefined ||
      !question.question ||
      !Array.isArray(question.options) ||
      question.options.length !== 4 ||
      question.options.some(option => !String(option).trim()) ||
      !validAnswer ||
      !question.explanation
    ) {
      throw new Error(`Backend returned an invalid quiz question at index ${index}`);
    }
  });
  return quiz;
}
