import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft, BookOpen, Bot, CheckCircle2, ChevronDown, Download,
  FileText, GraduationCap, Menu, MessageCircle, RotateCcw, Send,
  Sparkles, Trophy, XCircle
} from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { lessonData } from "./lessonData";
import { API_DISPLAY_URL, getQuizById, sendTutorMessage, submitQuiz } from "./services/aiTutorApi";
import lessonManifest from "../data/lessons.json";

const LESSONS = lessonManifest.lessons.map((lesson, index) => ({
  ...lesson,
  day: `Day ${index + 1}`,
  pdfUrl: `/${lesson.file}`
}));
const DEFAULT_LESSON_ID = "day02-business-problem-for-ai";
const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
const getMasteryConversationId = () => {
  const existing = localStorage.getItem("vlearn:mastery:conversation");
  if (existing) return existing;
  const created = createId();
  localStorage.setItem("vlearn:mastery:conversation", created);
  return created;
};
const MASTERY_LEVELS = [
  { min: 0, max: 39, label: "Chưa nắm vững", tone: "novice" },
  { min: 40, max: 59, label: "Đang hình thành", tone: "forming" },
  { min: 60, max: 79, label: "Khá thành thạo", tone: "proficient" },
  { min: 80, max: 94, label: "Thành thạo", tone: "mastered" },
  { min: 95, max: 100, label: "Tối đa", tone: "maximum" }
];

function MasteryScale({ value, compact = false }) {
  const score = Math.max(0, Math.min(100, Number(value) || 0));
  const activeIndex = MASTERY_LEVELS.findIndex(level => score >= level.min && score <= level.max);
  return (
    <div className={`mastery-scale ${compact ? "compact" : ""}`}>
      <div className="mastery-track">
        <i style={{ width: `${score}%` }}/>
        <span className="mastery-marker" style={{ left: `${score}%` }}>{score}%</span>
      </div>
      {!compact && <div className="mastery-levels">
        {MASTERY_LEVELS.map((level, index) => (
          <div className={index === activeIndex ? `active ${level.tone}` : ""} key={level.label}>
            <b>{level.label}</b>
            <small>{level.min}–{level.max}</small>
          </div>
        ))}
      </div>}
    </div>
  );
}

function Sidebar({ activeLesson }) {
  const navigate = useNavigate();
  const [openDays, setOpenDays] = useState(() => new Set(LESSONS.map(lesson => lesson.id)));
  const toggleDay = lessonId => {
    setOpenDays(current => {
      const next = new Set(current);
      next.has(lessonId) ? next.delete(lessonId) : next.add(lessonId);
      return next;
    });
  };

  return (
    <aside className="sidebar">
      <div className="side-title"><BookOpen size={20}/><div><b>Học liệu môn học</b><small>Chương, slide và tài liệu đã upload</small></div></div>
      {LESSONS.map(lesson => (
        <div className={`day ${openDays.has(lesson.id) ? "open" : ""}`} key={lesson.id}>
          <button className="day-toggle" onClick={() => toggleDay(lesson.id)}>
            <span>{lesson.day}</span>
            <ChevronDown className={openDays.has(lesson.id) ? "rotated" : ""} size={16}/>
          </button>
          <small>1 TÀI LIỆU · {activeLesson.id === lesson.id ? "STUDYING" : "ACTIVE"}</small>
          {openDays.has(lesson.id) && (
            <button
              className={`active-file ${activeLesson.id === lesson.id ? "selected-material" : ""}`}
              onClick={() => navigate(`/lesson/${lesson.id}`)}
              title={lesson.title}
            >
              <FileText size={17}/>
              <span>{lesson.file}</span>
              {activeLesson.id === lesson.id && <CheckCircle2 size={16}/>}
            </button>
          )}
        </div>
      ))}
    </aside>
  );
}

function SummaryCard({ response, onCreateQuiz }) {
  const summary = response.summary;
  return (
    <div className="summary-card">
      <div className="summary-head"><span><Sparkles size={17}/> Tóm tắt do ViAI tạo</span></div>
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

function ContextAnswerCard({ message }) {
  const normalized = String(message.message || "")
    .replace(/\s+(?=\d{1,2}\.\s+\S)/g, "\n")
    .replace(/\s+(?=[•*-]\s+\S)/g, "\n");
  const lines = normalized.split(/\n+/).map(line => line.trim()).filter(Boolean);

  return (
    <div className="context-answer">
      <div className="context-answer-head">
        <Sparkles size={16}/>
        <b>ViAI trả lời</b>
      </div>
      <div className="context-answer-body">
        {lines.map((line, index) => {
          const numbered = line.match(/^(\d{1,2})\.\s*(.+)$/);
          const bullet = line.match(/^[•*-]\s*(.+)$/);
          if (numbered) {
            return (
              <div className="answer-list-item" key={`${index}-${line}`}>
                <span>{numbered[1]}</span>
                <p>{numbered[2]}</p>
              </div>
            );
          }
          if (bullet) {
            return (
              <div className="answer-list-item bullet-item" key={`${index}-${line}`}>
                <span>•</span>
                <p>{bullet[1]}</p>
              </div>
            );
          }
          return <p className="answer-paragraph" key={`${index}-${line}`}>{line}</p>;
        })}
      </div>
      <div className="answer-source-row">
        {message.grounded_in_lesson && (
          <small className="answer-source">Dựa trên bài giảng đang mở</small>
        )}
        {message.used_general_knowledge && (
          <small className="answer-source general">Có bổ sung kiến thức chung ngoài slide</small>
        )}
      </div>
    </div>
  );
}

function ChatPanel({ lessonId }) {
  const navigate = useNavigate();
  const conversationId = useRef(getMasteryConversationId());
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
        lessonId,
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
      setError(requestError.message || "Không thể kết nối ViAI.");
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

  useEffect(() => {
    const pendingKey = `vlearn:pending-action:${lessonId}`;
    const pendingMessage = sessionStorage.getItem(pendingKey);
    if (!pendingMessage) return;
    sessionStorage.removeItem(pendingKey);
    send(pendingMessage);
  }, [lessonId]);

  const renderAssistantMessage = message => {
    if (message.type === "lesson-summary") {
      return <SummaryCard response={message} onCreateQuiz={() => send("Tạo quiz từ nội dung bài giảng này")} />;
    }
    if (message.type === "quiz-ready") {
      return <QuizReadyCard response={message} onOpen={() => storeAndOpenQuiz(message.quiz, message.quiz_url)} />;
    }
    if (message.type === "text" && message.role === "assistant") {
      return <ContextAnswerCard message={message}/>;
    }
    return <div className={`bubble bot ${message.type === "error" ? "error-bubble" : ""}`}>
      {message.message}
    </div>;
  };

  return (
    <aside className="chat">
      <div className="chat-head"><div className="bot-logo"><Bot size={21}/></div><div><b>ViAI</b><small><i/>Trợ lý học tập thích ứng</small></div></div>
      <div className="quota"><span>Phiên hội thoại</span><b>ViAI đang hoạt động</b><div><i/></div></div>
      <div className="chat-body">
        <div className="hello"><Sparkles size={18}/><p>Xin chào! Bạn có thể hỏi về slide, yêu cầu tóm tắt hoặc tạo quiz từ bài giảng đang mở.</p></div>
        {messages.map(message => message.role === "user"
          ? <div key={message.id} className="bubble user">{message.text}</div>
          : <React.Fragment key={message.id}>{renderAssistantMessage(message)}</React.Fragment>)}
        {loading && <div className="thinking"><span/><span/><span/>ViAI đang xử lý nội dung bài học...</div>}
        {error && <div className="api-status">Backend chưa xử lý được yêu cầu · <code>{API_DISPLAY_URL}</code></div>}
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
          aria-label="Nhập tin nhắn cho ViAI"
        />
        <button disabled={!input.trim() || loading} onClick={() => send()} aria-label="Gửi tin nhắn"><Send size={19}/></button>
      </div>
    </aside>
  );
}

function Reader({ lesson }) {
  return (
    <main className="reader">
      <div className="reader-toolbar"><button className="selected"><BookOpen size={17}/> Đọc</button><span>{lesson.day} · Bài giảng</span><a href={lesson.pdfUrl} download={lesson.file}><Download size={17}/> Tải PDF</a></div>
      <div className="pdf-wrap">
        <iframe key={lesson.id} title={lesson.title} src={`${lesson.pdfUrl}#toolbar=0&navpanes=0&view=FitH`}/>
        <div className="end-card">
          <div className="complete-icon"><CheckCircle2 size={28}/></div>
          <div><b>Bạn đã xem hết bài giảng</b><p>Hãy yêu cầu Tutor tạo quiz hoặc mở quiz gần nhất.</p></div>
          <button>Hoàn thành bài giảng</button>
        </div>
      </div>
    </main>
  );
}

function LessonPage() {
  const { lessonId } = useParams();
  const activeLesson = LESSONS.find(lesson => lesson.id === lessonId) ?? LESSONS.find(lesson => lesson.id === DEFAULT_LESSON_ID);

  return <div className="app">
    <header className="topbar"><button className="mobile-menu"><Menu/></button><div className="brand"><span>V</span> VLearn</div><div className="doc-title"><FileText size={19}/><div><b>{activeLesson.file}</b><small>COMP2010 · {activeLesson.title}</small></div></div><div className="profile">VI <span>Sinh viên ẩn danh</span></div></header>
    <div className="workspace"><Sidebar activeLesson={activeLesson}/><Reader lesson={activeLesson}/><ChatPanel key={activeLesson.id} lessonId={activeLesson.id}/></div>
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
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [adaptiveLoading, setAdaptiveLoading] = useState("");
  const masteryConversationId = useRef(
    getMasteryConversationId()
  );

  useEffect(() => {
    localStorage.setItem("vlearn:mastery:conversation", masteryConversationId.current);
  }, []);

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
    return <div className="quiz-page empty-state"><div><GraduationCap size={42}/><h2>Không tìm thấy quiz</h2><p>Hãy quay lại bài giảng và yêu cầu ViAI tạo quiz.</p><button className="retry" onClick={() => navigate(`/lesson/${DEFAULT_LESSON_ID}`)}>Quay lại bài giảng</button></div></div>;
  }

  const questions = quiz.questions;
  const done = Object.keys(answers).length;
  const score = result?.score?.correct ?? questions.filter(question => answers[question.id] === question.correct_answer).length;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const graded = await submitQuiz({
        quizId,
        conversationId: masteryConversationId.current,
        answers
      });
      setResult(graded);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error.message || "Không thể chấm bài.");
    } finally {
      setSubmitting(false);
    }
  };

  const continueLearning = async action => {
    const message = action === "review_weak_areas"
      ? "Ôn và tạo 10 câu hỏi luyện tập mới chỉ cho các phần mastery dưới 80"
      : "Tạo một bài test mới, tập trung 60% vào phần yếu và vẫn bao phủ toàn bài";
    setAdaptiveLoading(action);
    setSubmitError("");
    try {
      const response = await sendTutorMessage({
        lessonId: quiz.lesson_id || DEFAULT_LESSON_ID,
        conversationId: masteryConversationId.current,
        message,
        history: []
      });
      if (response.type !== "quiz-ready" || !response.quiz) {
        throw new Error(response.message || "Backend không tạo được quiz tiếp theo.");
      }
      sessionStorage.setItem(`vlearn:quiz:${response.quiz.id}`, JSON.stringify(response.quiz));
      setQuiz(response.quiz);
      setAnswers({});
      setResult(null);
      setSubmitted(false);
      navigate(response.quiz_url || `/quiz/${response.quiz.id}`, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmitError(error.message || "Không thể tạo bài luyện tiếp theo.");
    } finally {
      setAdaptiveLoading("");
    }
  };

  if (submitted) {
    const percent = result?.score?.percentage ?? Math.round(score / questions.length * 100);
    return <div className="quiz-page">
      <div className="quiz-top"><button onClick={() => navigate(`/lesson/${quiz.lesson_id || DEFAULT_LESSON_ID}`)}><ArrowLeft size={18}/> Quay lại bài giảng</button><div className="brand"><span>V</span> VLearn</div></div>
      <div className="result-hero">
        <Trophy size={36}/>
        <p>HOÀN THÀNH BÀI KIỂM TRA</p>
        <h1>{score}/{questions.length}</h1>
        <b>{percent}% · {result?.mastery?.lesson_level ?? "Đang đánh giá"}</b>
        <div className="lesson-mastery">
          <span>Độ thành thạo toàn bài</span>
          <MasteryScale value={result?.mastery?.lesson_mastery ?? percent}/>
        </div>
      </div>
      {result && <div className="review-list">
        <article className="question">
          <span className="q-number">MASTERY THEO KHÁI NIỆM</span>
          <div className="concept-mastery-list">
            <h4 className="mastery-group-title updated-title">Được cập nhật trong lượt này</h4>
            {result.mastery.concepts.filter(item => item.updated_this_attempt !== false).map(item => (
              <div className="concept-mastery" key={item.concept}>
                <div>
                  <b>{item.concept}</b>
                  <span>
                    {item.level} · {item.evidence_count} câu · độ tin cậy {item.confidence}
                    {item.updated_this_attempt === false ? " · Giữ nguyên (không kiểm tra lượt này)" : " · Đã cập nhật"}
                  </span>
                </div>
                <MasteryScale value={item.new_mastery} compact/>
              </div>
            ))}
            {result.mastery.concepts.some(item => item.updated_this_attempt === false) && <>
              <h4 className="mastery-group-title unchanged-title">
                Giữ nguyên — không xuất hiện trong bài luyện này
              </h4>
              <p className="mastery-note">
                Mỗi lượt luyện tối đa 10 câu nên hệ thống ưu tiên tối đa 5 concept yếu nhất.
                Các concept dưới đây không bị giảm điểm và sẽ được ưu tiên trong lượt luyện tiếp theo.
              </p>
              {result.mastery.concepts.filter(item => item.updated_this_attempt === false).map(item => (
                <div className="concept-mastery unchanged" key={item.concept}>
                  <div>
                    <b>{item.concept}</b>
                    <span>{item.level} · {item.evidence_count} câu · mastery không đổi</span>
                  </div>
                  <MasteryScale value={item.new_mastery} compact/>
                </div>
              ))}
            </>}
          </div>
        </article>
        {result.weak_areas.length > 0 && <article className="wrong">
          <div className="review-title"><XCircle/><b>Phần cần cải thiện</b></div>
          {result.weak_areas.map(item => <p key={item.concept}><strong>{item.concept} · {item.mastery}%</strong><br/>{item.diagnosis}</p>)}
        </article>}
        {result.congratulation && <article className="correct"><div className="review-title"><Trophy/><b>{result.congratulation.title}</b></div><p>{result.congratulation.message}</p></article>}
        <div className="submit-row">
          {result.next_actions.map(action => (
            <button
              disabled={Boolean(adaptiveLoading)}
              key={action.action}
              onClick={() => continueLearning(action.action)}
            >
              {adaptiveLoading === action.action
                ? "ViAI đang tạo câu hỏi..."
                : action.label}
            </button>
          ))}
        </div>
        {submitError && <div className="api-status">{submitError}</div>}
      </div>}
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
        <button className="retry" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><RotateCcw size={17}/> Xem lại tổng quan kết quả</button>
      </div>
    </div>;
  }

  return <div className="quiz-page">
    <div className="quiz-top"><button onClick={() => navigate(`/lesson/${quiz.lesson_id || DEFAULT_LESSON_ID}`)}><ArrowLeft size={18}/> Quay lại bài giảng</button><div className="brand"><span>V</span> VLearn</div></div>
    <header className="quiz-header"><div><span className="eyebrow"><GraduationCap size={16}/> QUIZ DO AI TẠO</span><h1>{quiz.title}</h1><p>{quiz.description ?? "Chọn một đáp án đúng nhất cho mỗi câu."}</p></div><div className="progress-ring">{done}<small>/{questions.length}</small></div></header>
    <div className="progress"><i style={{ width: `${done / questions.length * 100}%` }}/></div>
    <div className="questions">
      {questions.map((question, index) => <article className="question" key={question.id}>
        <span className="q-number">Câu {index + 1}</span><h3>{question.question}</h3>
        <div className="options">{question.options.map((option, optionIndex) => <label className={answers[question.id] === optionIndex ? "chosen" : ""} key={`${option}-${optionIndex}`}><input type="radio" name={`q${question.id}`} onChange={() => setAnswers(current => ({ ...current, [question.id]: optionIndex }))}/><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</label>)}</div>
      </article>)}
      {submitError && <div className="api-status">{submitError}</div>}
      <div className="submit-row"><span>{done === questions.length ? "Bạn đã trả lời tất cả câu hỏi." : `Còn ${questions.length - done} câu chưa trả lời`}</span><button disabled={done < questions.length || submitting} onClick={handleSubmit}>{submitting ? "Đang chấm bài..." : "Nộp bài & xem mastery"}</button></div>
    </div>
  </div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/lesson/${DEFAULT_LESSON_ID}`} replace/>}/>
        <Route path="/lesson/:lessonId" element={<LessonPage/>}/>
        <Route path="/quiz/:quizId" element={<QuizPage/>}/>
        <Route path="*" element={<Navigate to={`/lesson/${DEFAULT_LESSON_ID}`} replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
