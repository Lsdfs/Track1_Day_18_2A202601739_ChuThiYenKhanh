const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

export async function sendTutorMessage(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message, lesson_id: "day02-business-problem-for-ai"})
  });
  if (!response.ok) throw new Error(`Tutor API returned ${response.status}`);
  return response.json();
}
