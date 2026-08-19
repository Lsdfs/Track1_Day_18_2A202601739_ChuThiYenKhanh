import { lessonData } from "../lessonData";

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export async function sendMockTutorMessage(payload) {
  await wait(900);
  const message = normalize(payload.message);

  if (message.includes("quiz") || message.includes("cau hoi")) {
    const quiz = {
      id: `quiz-${payload.lesson_id}`,
      title: `Quiz cuối bài: ${lessonData.title}`,
      description: "Câu hỏi được tạo từ nội dung bài giảng.",
      questions: lessonData.questions.map(question => ({
        id: question.id,
        question: question.question,
        options: question.options,
        correct_answer: question.correct,
        explanation: question.explanation
      }))
    };
    return {
      type: "quiz-ready",
      message: "Mình đã tạo xong quiz từ nội dung bài giảng.",
      quiz,
      quiz_url: `/quiz/${quiz.id}`,
      source: "mock"
    };
  }

  if (message.includes("tom tat") || message.includes("summary")) {
    return {
      type: "lesson-summary",
      message: "Mình đã đọc slide và tạo bản tóm tắt.",
      summary: {
        greeting: lessonData.summary.greeting,
        overview: lessonData.summary.overview,
        sections: lessonData.summary.sections.map(([title, content]) => ({ title, content })),
        key_takeaways: lessonData.summary.keyTakeaways
      },
      download_url: lessonData.pdfUrl,
      source: "mock"
    };
  }

  return {
    type: "text",
    message: "Bạn có thể hỏi về nội dung bài giảng, yêu cầu tóm tắt hoặc yêu cầu tạo quiz.",
    source: "mock"
  };
}
