import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, BookOpen, Bot, CheckCircle2, ChevronDown, Download,
  FileText, GraduationCap, Menu, MessageCircle, RotateCcw, Send,
  Sparkles, Trophy, XCircle
} from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { lessonData } from "./lessonData";
import { getQuizById, sendTutorMessage } from "./services/aiTutorApi";

const LESSON_ID = lessonData.id;
const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="side-title"><BookOpen size={20}/><div><b>Học liệu môn học</b><small>Chương, slide và tài liệu đã upload</small></div></div>
      {["Day 1", "Day 2", "Day 3"].map((day, index) => (
        <div className={`day ${index === 1 ? "open" : ""}`} key={day}>
          <div><span>{day}</span><ChevronDown size={16}/></div>
          <small>{index === 1 ? "2 TÀI LIỆU · STUDYING" : "2 TÀI LIỆU · ACTIVE"}</small>
          {index === 1 && <button className="active-file"><FileText size={17}/><span>Day02 - Xác định bài toán...</span><CheckCircle2 size={16}/></button>}
        </div>
      ))}
      <div className="day"><div><span>Day 4</span><ChevronDown size={16}/></div><small>3 TÀI LIỆU · ACTIVE</small></div>
    </aside>
  );
}

function SummaryCard({ response, onCreateQuiz }) {
  const summary = response.summary;
  return (
    <div className="summary-card">
      <div className="summary-head"><span><Sparkles size={17}/> Tóm tắt do VLearn Tutor tạo</span></div>
      {response.message && <p>{response.message}</p>}
      {summary.greeting && <p>{summary.greeting}</p>}
      <p className="overview">{summary.overview}</p>
      {summary.sections.map((section, index) => (
        <section key={`${section.title}-${index}`}><h4>{index + 1}. {section.title}</h4><p>{section.content}</p></section>
      ))}
      <div className="takeaways">
        <b>Điểm cần nhớ</b>
        {summary.key_takeaways.map(item => <div key={item}><CheckCircle2 size={15}/>{item}</div>)}
      </div>
      {response.download_url && (
        <div className="generated-file">
          <div className="pdf-icon">PDF</div>
          <div><b>Bản tóm tắt bài giảng.pdf</b><small>Được tạo bởi tool backend</small></div>
          <a href={response.download_url} download><Download size={17}/> Tải xuống</a>
        </div>
      )}
      <button className="quiz-cta" onClick={onCreateQuiz}>Tạo quiz từ bài giảng <span>→</span></button>
    </div>
  );
}

function QuizReadyCard({ response, onOpen }) {
  return (
    <div className="summary-card quiz-ready-card">
      <div className="summary-head"><span><GraduationCap size={17}/> Quiz đã sẵn sàng</span></div>
      <p>{response.message ?? "Agent đã tạo quiz từ nội dung slide."}</p>
      <div className="takeaways">
        <b>{response.quiz.title}</b>
        <div><CheckCircle2 size={15}/>{response.quiz.questions.length} câu hỏi</div>
        <div><CheckCircle2 size={15}/>Có đáp án và giải thích</div>
      </div>
      <button className="quiz-cta" onClick={onOpen}>Mở trang Quiz <span>→</span></button>
    </div>
  );
}

function ChatPanel() {
  const navigate = useNavigate();
  const conversationId = useRef(createId());
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const storeAndOpenQuiz = (quiz, quizUrl) => {
    sessionStorage.setItem(`vlearn:quiz:${quiz.id}`, JSON.stringify(quiz));
    navigate(quizUrl || `/quiz/${quiz.id}`);
  };

  const send = async (suggestedText = "") => {
    const text = (suggestedText || input).trim();
    if (!text || loading) return;
    const userMessage = { id: createId(), role: "user", type: "text", text };
    const history = [...messages, userMessage];
    setMessages(history);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await sendTutorMessage({
        lessonId: LESSON_ID,
        conversationId: conversationId.current,
        message: text,
        history: messages
      });
      const assistantMessage = { id: createId(), role: "assistant", ...response };
      if (response.type === "quiz-ready") {
        sessionStorage.setItem(`vlearn:quiz:${response.quiz.id}`, JSON.stringify(response.quiz));
      }
      setMessages(current => [...current, assistantMessage]);
    } catch (requestError) {
      setError(requestError.message || "Không thể kết nối VLearn Tutor.");
      setMessages(current => [...current, {
        id: createId(),
        role: "assistant",
        type: "error",
        message: requestError.message || "Backend AI chưa phản hồi."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const renderAssistantMessage = message => {
    if (message.type === "lesson-summary") {
      return <SummaryCard response={message} onCreateQuiz={() => send("Tạo quiz từ nội dung bài giảng này")} />;
    }
    if (message.type === "quiz-ready") {
      return <QuizReadyCard response={message} onOpen={() => storeAndOpenQuiz(message.quiz, message.quiz_url)} />;
    }
    return <div className={`bubble bot ${message.type === "error" ? "error-bubble" : ""}`}>{message.message}</div>;
  };

  return (
    <aside className="chat">
      <div className="chat-head"><div className="bot-logo"><Bot size={21}/></div><div><b>VLearn Tutor</b><small><i/>Agent học tập theo ngữ cảnh</small></div></div>
      <div className="quota"><span>Phiên hội thoại</span><b>Gemini + Tools</b><div><i/></div></div>
      <div className="chat-body">
        <div className="hello"><Sparkles size={18}/><p>Xin chào! Bạn có thể hỏi về slide, yêu cầu tóm tắt hoặc tạo quiz từ bài giảng đang mở.</p></div>
        {messages.map(message => message.role === "user"
          ? <div key={message.id} className="bubble user">{message.text}</div>
          : <React.Fragment key={message.id}>{renderAssistantMessage(message)}</React.Fragment>)}
        {loading && <div className="thinking"><span/><span/><span/>Gemini đang chọn và gọi tool phù hợp...</div>}
        {error && <div className="api-status">Không kết nối được backend · <code>127.0.0.1:8000</code></div>}
      </div>
      <div className="suggestion-row">
        <button className="suggestion" onClick={() => send("Tóm tắt bài giảng hiện tại")}>✦ Tóm tắt bài giảng</button>
        <button className="suggestion" onClick={() => send("Tạo quiz từ nội dung bài giảng này")}>✦ Tạo quiz</button>
      </div>
      <div className="composer">
        <textarea
          value={input}
          onChange={event => setInput(event.target.value)}
          onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }}
          placeholder="Nhập câu hỏi về bài giảng..."
          aria-label="Nhập tin nhắn cho VLearn Tutor"
        />
        <button disabled={!input.trim() || loading} onClick={() => send()} aria-label="Gửi tin nhắn"><Send size={19}/></button>
      </div>
    </aside>
  );
}

function Reader() {
  const navigate = useNavigate();
  return (
    <main className="reader">
      <div className="reader-toolbar"><button className="selected"><BookOpen size={17}/> Đọc</button><span>Day 2 · Bài giảng</span><a href={lessonData.pdfUrl} download={lessonData.fileName}><Download size={17}/> Tải PDF</a></div>
      <div className="pdf-wrap">
        <iframe title={lessonData.title} src={`${lessonData.pdfUrl}#toolbar=0&navpanes=0&view=FitH`}/>
        <div className="end-card">
          <div className="complete-icon"><CheckCircle2 size={28}/></div>
          <div><b>Bạn đã xem hết bài giảng</b><p>Hãy yêu cầu Tutor tạo quiz hoặc mở quiz gần nhất.</p></div>
          <button onClick={() => navigate("/lesson/day02")}>Mở VLearn Tutor →</button>
        </div>
      </div>
    </main>
  );
}

function LessonPage() {
  return <div className="app">
    <header className="topbar"><button className="mobile-menu"><Menu/></button><div className="brand"><span>V</span> VLearn</div><div className="doc-title"><FileText size={19}/><div><b>{lessonData.fileName}</b><small>COMP2010 · Lecture material</small></div></div><div className="profile">VI <span>Sinh viên ẩn danh</span></div></header>
    <div className="workspace"><Sidebar/><Reader/><ChatPanel/></div>
    <button className="floating"><MessageCircle/></button>
  </div>;
}

function QuizPage() {
  const navigate = useNavigate();
  const { quizId } = useParams();
  const storedQuiz = sessionStorage.getItem(`vlearn:quiz:${quizId}`);
  const [quiz, setQuiz] = useState(() => storedQuiz ? JSON.parse(storedQuiz) : null);
  const [quizLoading, setQuizLoading] = useState(!storedQuiz);
  const [quizError, setQuizError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (quiz) return;
    getQuizById(quizId)
      .then(fetchedQuiz => {
        sessionStorage.setItem(`vlearn:quiz:${fetchedQuiz.id}`, JSON.stringify(fetchedQuiz));
        setQuiz(fetchedQuiz);
      })
      .catch(error => setQuizError(error.message))
      .finally(() => setQuizLoading(false));
  }, [quiz, quizId]);

  if (quizLoading) {
    return <div className="quiz-page empty-state"><div><Sparkles size={42}/><h2>Đang tải quiz...</h2><p>VLearn đang lấy dữ liệu quiz từ backend.</p></div></div>;
  }

  if (!quiz || quizError) {
    return <div className="quiz-page empty-state"><div><GraduationCap size={42}/><h2>Không tìm thấy quiz</h2><p>Hãy quay lại bài giảng và yêu cầu VLearn Tutor tạo quiz.</p><button className="retry" onClick={() => navigate(`/lesson/${LESSON_ID}`)}>Quay lại bài giảng</button></div></div>;
  }

  const questions = quiz.questions;
  const done = Object.keys(answers).length;
  const score = questions.filter(question => answers[question.id] === question.correct_answer).length;

  if (submitted) {
    const percent = Math.round(score / questions.length * 100);
    return <div className="quiz-page">
      <div className="quiz-top"><button onClick={() => navigate(`/lesson/${LESSON_ID}`)}><ArrowLeft size={18}/> Quay lại bài giảng</button><div className="brand"><span>V</span> VLearn</div></div>
      <div className="result-hero"><Trophy size={36}/><p>HOÀN THÀNH BÀI KIỂM TRA</p><h1>{score}/{questions.length}</h1><b>{percent}% · {percent >= 80 ? "Xuất sắc!" : percent >= 60 ? "Làm tốt lắm!" : "Hãy ôn lại nhé!"}</b><small>Kết quả được chấm theo đáp án và giải thích do tool backend tạo.</small></div>
      <div className="review-list">
        {questions.map((question, index) => {
          const correct = answers[question.id] === question.correct_answer;
          return <article className={correct ? "correct" : "wrong"} key={question.id}>
            <div className="review-title">{correct ? <CheckCircle2/> : <XCircle/>}<b>Câu {index + 1}: {question.question}</b></div>
            <p>Bạn chọn: <strong>{question.options[answers[question.id]] ?? "Chưa trả lời"}</strong></p>
            {!correct && <p>Đáp án đúng: <strong>{question.options[question.correct_answer]}</strong></p>}
            <div className="explain"><Sparkles size={15}/><span>{question.explanation}</span></div>
          </article>;
        })}
        <button className="retry" onClick={() => { setAnswers({}); setSubmitted(false); window.scrollTo(0, 0); }}><RotateCcw size={17}/> Làm lại Quiz</button>
      </div>
    </div>;
  }

  return <div className="quiz-page">
    <div className="quiz-top"><button onClick={() => navigate(`/lesson/${LESSON_ID}`)}><ArrowLeft size={18}/> Quay lại bài giảng</button><div className="brand"><span>V</span> VLearn</div></div>
    <header className="quiz-header"><div><span className="eyebrow"><GraduationCap size={16}/> QUIZ DO AI TẠO</span><h1>{quiz.title}</h1><p>{quiz.description ?? "Chọn một đáp án đúng nhất cho mỗi câu."}</p></div><div className="progress-ring">{done}<small>/{questions.length}</small></div></header>
    <div className="progress"><i style={{ width: `${done / questions.length * 100}%` }}/></div>
    <div className="questions">
      {questions.map((question, index) => <article className="question" key={question.id}>
        <span className="q-number">Câu {index + 1}</span><h3>{question.question}</h3>
        <div className="options">{question.options.map((option, optionIndex) => <label className={answers[question.id] === optionIndex ? "chosen" : ""} key={`${option}-${optionIndex}`}><input type="radio" name={`q${question.id}`} onChange={() => setAnswers(current => ({ ...current, [question.id]: optionIndex }))}/><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</label>)}</div>
      </article>)}
      <div className="submit-row"><span>{done === questions.length ? "Bạn đã trả lời tất cả câu hỏi." : `Còn ${questions.length - done} câu chưa trả lời`}</span><button disabled={done < questions.length} onClick={() => { setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Nộp bài & xem kết quả</button></div>
    </div>
  </div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/lesson/${LESSON_ID}`} replace/>}/>
        <Route path="/lesson/:lessonId" element={<LessonPage/>}/>
        <Route path="/quiz/:quizId" element={<QuizPage/>}/>
        <Route path="*" element={<Navigate to={`/lesson/${LESSON_ID}`} replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
