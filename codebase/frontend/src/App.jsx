import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, BookOpen, Bot, CheckCircle2, ChevronDown, Download,
  FileText, GraduationCap, Menu, MessageCircle, RotateCcw, Send,
  Sparkles, Trophy, XCircle
} from "lucide-react";
import { jsPDF } from "jspdf";
import { lessonData } from "./lessonData";
import { sendTutorMessage } from "./services/aiTutorApi";

const normalizeMessage = (value) =>
  value.trim().toLowerCase().replace(/[?.!,]/g, "").replace(/\s+/g, " ");

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="side-title"><BookOpen size={20}/><div><b>Học liệu môn học</b><small>Chương, slide và tài liệu đã upload</small></div></div>
      {["Day 1", "Day 2", "Day 3"].map((day, i) => (
        <div className={`day ${i === 1 ? "open" : ""}`} key={day}>
          <div><span>{day}</span><ChevronDown size={16}/></div>
          <small>{i === 1 ? "2 TÀI LIỆU · STUDYING" : "2 TÀI LIỆU · ACTIVE"}</small>
          {i === 1 && <button className="active-file"><FileText size={17}/><span>Day02 - Xác định bài toán...</span><CheckCircle2 size={16}/></button>}
        </div>
      ))}
      <div className="day"><div><span>Day 4</span><ChevronDown size={16}/></div><small>3 TÀI LIỆU · ACTIVE</small></div>
    </aside>
  );
}

function createSummaryPdf() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const plain = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    let y = 18;
    const addText = (text, size = 10, bold = false) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(plain(text), 174);
      if (y + lines.length * 5 > 282) { doc.addPage(); y = 18; }
      doc.text(lines, 18, y);
      y += lines.length * 5 + 3;
    };
    doc.setTextColor(7, 87, 165);
    addText(lessonData.title, 18, true);
    doc.setTextColor(24, 37, 58);
    addText(lessonData.summary.overview, 10);
    lessonData.summary.sections.forEach(([title, content], i) => {
      addText(`${i + 1}. ${title}`, 12, true);
      addText(content, 10);
    });
    addText("5 diem can nho", 12, true);
    lessonData.summary.keyTakeaways.forEach(x => addText(`• ${x}`, 10));
    return doc.output("blob");
}

function SummaryCard({ onQuiz }) {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(createSummaryPdf());
    setPdfUrl(url);
    return () => URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="summary-card">
      <div className="summary-head"><span><Sparkles size={17}/> Tóm tắt do VLearn Tutor tạo</span></div>
      <p>{lessonData.summary.greeting}</p>
      <p className="overview">{lessonData.summary.overview}</p>
      {lessonData.summary.sections.map(([title, content], i) => (
        <section key={title}><h4>{i + 1}. {title}</h4><p>{content}</p></section>
      ))}
      <div className="takeaways"><b>5 điểm cần nhớ</b>{lessonData.summary.keyTakeaways.map(x=><div key={x}><CheckCircle2 size={15}/>{x}</div>)}</div>
      <div className="generated-file">
        <div className="pdf-icon">PDF</div>
        <div>
          <b>Tóm tắt — Xác định bài toán kinh doanh cho AI.pdf</b>
          <small>Đã tạo từ nội dung bài giảng · PDF</small>
        </div>
        {pdfUrl
          ? <a href={pdfUrl} download="tom-tat-xac-dinh-bai-toan-kinh-doanh-cho-AI.pdf"><Download size={17}/> Tải xuống</a>
          : <span className="file-loading">Đang tạo file...</span>}
      </div>
      <button className="quiz-cta" onClick={onQuiz}>Hoàn thành bài giảng & bắt đầu Quiz <span>→</span></button>
    </div>
  );
}

function ChatPanel({ onQuiz }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const send = async (suggestedText = "") => {
    const text = typeof suggestedText === "string" && suggestedText
      ? suggestedText.trim()
      : input.trim();
    if (!text || loading) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const [response] = await Promise.all([
        sendTutorMessage(text),
        new Promise(resolve => setTimeout(resolve, 700))
      ]);
      setMessages(m => [...m, response.type === "lesson-summary"
        ? { role: "summary" }
        : { role: "bot", text: response.message }]);
    } catch {
      const normalized = normalizeMessage(text);
      const wantsSummary = normalized.includes("tóm tắt") || normalized.includes("tom tat") || normalized.includes("summary");
      setMessages(m => [...m, wantsSummary
        ? { role: "summary" }
        : { role: "bot", text: "Mình đang ở chế độ prototype với dữ liệu hardcoded. Bạn có thể yêu cầu mình tóm tắt bài giảng hiện tại để tạo bản tóm tắt và file PDF tải xuống." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="chat">
      <div className="chat-head"><div className="bot-logo"><Bot size={21}/></div><div><b>VLearn Tutor</b><small><i/>Trợ lý học theo ngữ cảnh</small></div></div>
      <div className="quota"><span>Quota Tutor trong ngày</span><b>6 / 15 câu</b><div><i/></div></div>
      <div className="chat-body">
        <div className="hello"><Sparkles size={18}/><p>Xin chào! Mình đã sẵn sàng hỗ trợ bạn với bài giảng này. Hãy yêu cầu mình tóm tắt tài liệu nhé.</p></div>
        {messages.map((m, i) => m.role === "summary"
          ? <SummaryCard key={i} onQuiz={onQuiz}/>
          : <div key={i} className={`bubble ${m.role}`}>{m.text}</div>)}
        {loading && <div className="thinking"><span/><span/><span/>{lessonData.loadingMessage}</div>}
      </div>
      <button className="suggestion" onClick={()=>send(lessonData.triggerMessage)}>✦ Tóm tắt bài giảng hiện tại</button>
      <div className="composer">
        <textarea
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
          placeholder="Nhập câu hỏi hoặc yêu cầu tóm tắt..."
          aria-label="Nhập tin nhắn cho VLearn Tutor"
        />
        <button disabled={!input.trim() || loading} onClick={()=>send()} aria-label="Gửi tin nhắn"><Send size={19}/></button>
      </div>
    </aside>
  );
}

function Reader({ onQuiz }) {
  return (
    <main className="reader">
      <div className="reader-toolbar"><button className="selected"><BookOpen size={17}/> Đọc</button><span>Day 2 · Bài giảng</span><a href={lessonData.pdfUrl} download={lessonData.fileName}><Download size={17}/> Tải PDF</a></div>
      <div className="pdf-wrap">
        <iframe title={lessonData.title} src={`${lessonData.pdfUrl}#toolbar=0&navpanes=0&view=FitH`}/>
        <div className="end-card">
          <div className="complete-icon"><CheckCircle2 size={28}/></div>
          <div><b>Bạn đã xem hết bài giảng</b><p>Sẵn sàng kiểm tra kiến thức vừa học?</p></div>
          <button onClick={onQuiz}>Bắt đầu làm Quiz →</button>
        </div>
      </div>
    </main>
  );
}

function Quiz({ onBack }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = useMemo(() => lessonData.questions.filter(q => answers[q.id] === q.correct).length, [answers]);
  const done = Object.keys(answers).length;
  const submit = () => { if (done === lessonData.questions.length) { setSubmitted(true); window.scrollTo({top:0, behavior:"smooth"}); } };

  if (submitted) {
    const percent = Math.round(score / lessonData.questions.length * 100);
    return <div className="quiz-page">
      <div className="quiz-top"><button onClick={onBack}><ArrowLeft size={18}/> Quay lại bài giảng</button><div className="brand"><span>V</span> VLearn</div></div>
      <div className="result-hero"><Trophy size={36}/><p>HOÀN THÀNH BÀI KIỂM TRA</p><h1>{score}/{lessonData.questions.length}</h1><b>{percent}% · {score >= 7 ? "Xuất sắc!" : score >= 5 ? "Làm tốt lắm!" : "Hãy ôn lại nhé!"}</b><small>{score >= 7 ? "Bạn đã nắm rất tốt nội dung bài học." : "Xem lại phần giải thích bên dưới để củng cố kiến thức."}</small></div>
      <div className="review-list">
        {lessonData.questions.map((q, i) => {
          const correct = answers[q.id] === q.correct;
          return <article className={correct ? "correct" : "wrong"} key={q.id}>
            <div className="review-title">{correct ? <CheckCircle2/> : <XCircle/>}<b>Câu {i+1}: {q.question}</b></div>
            <p>Bạn chọn: <strong>{String.fromCharCode(65 + answers[q.id])}. {q.options[answers[q.id]]}</strong></p>
            {!correct && <p>Đáp án đúng: <strong>{String.fromCharCode(65 + q.correct)}. {q.options[q.correct]}</strong></p>}
            <div className="explain"><Sparkles size={15}/><span>{q.explanation}</span></div>
          </article>;
        })}
        <button className="retry" onClick={()=>{setAnswers({});setSubmitted(false);window.scrollTo(0,0)}}><RotateCcw size={17}/> Làm lại bài Quiz</button>
      </div>
    </div>;
  }

  return <div className="quiz-page">
    <div className="quiz-top"><button onClick={onBack}><ArrowLeft size={18}/> Quay lại bài giảng</button><div className="brand"><span>V</span> VLearn</div></div>
    <header className="quiz-header"><div><span className="eyebrow"><GraduationCap size={16}/> QUIZ CUỐI BÀI</span><h1>{lessonData.title}</h1><p>8 câu hỏi · Chọn một đáp án đúng nhất cho mỗi câu.</p></div><div className="progress-ring">{done}<small>/8</small></div></header>
    <div className="progress"><i style={{width:`${done/8*100}%`}}/></div>
    <div className="questions">
      {lessonData.questions.map((q, i) => <article className="question" key={q.id}>
        <span className="q-number">Câu {i+1}</span><h3>{q.question}</h3>
        <div className="options">{q.options.map((opt, oi) => <label className={answers[q.id]===oi ? "chosen" : ""} key={opt}><input type="radio" name={`q${q.id}`} onChange={()=>setAnswers(a=>({...a,[q.id]:oi}))}/><span>{String.fromCharCode(65+oi)}</span>{opt}</label>)}</div>
      </article>)}
      <div className="submit-row"><span>{done === 8 ? "Bạn đã trả lời tất cả câu hỏi." : `Còn ${8-done} câu chưa trả lời`}</span><button disabled={done<8} onClick={submit}>Nộp bài & xem kết quả</button></div>
    </div>
  </div>;
}

export default function App() {
  const [view, setView] = useState("lesson");
  if (view === "quiz") return <Quiz onBack={()=>setView("lesson")}/>;
  return <div className="app">
    <header className="topbar"><button className="mobile-menu"><Menu/></button><div className="brand"><span>V</span> VLearn</div><div className="doc-title"><FileText size={19}/><div><b>{lessonData.fileName}</b><small>COMP2010 · Lecture material</small></div></div><div className="profile">VI <span>Sinh viên ẩn danh</span></div></header>
    <div className="workspace"><Sidebar/><Reader onQuiz={()=>setView("quiz")}/><ChatPanel onQuiz={()=>setView("quiz")}/></div>
    <button className="floating"><MessageCircle/></button>
  </div>;
}
