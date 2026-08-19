import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import "pdfjs-dist/web/pdf_viewer.css";
import {
  ArrowLeft, BookOpen, Bot, CheckCircle2, ChevronDown, ChevronRight, Download,
  FileText, GraduationCap, Highlighter, Layers3, Menu, Merge, MessageCircle,
  NotebookPen, Plus, RotateCcw, Send, Sparkles, Split, Trash2, Trophy, XCircle
} from "lucide-react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { lessonData } from "./lessonData";
import { API_DISPLAY_URL, createReviewProposals, getQuizById, sendTutorMessage, submitQuiz } from "./services/aiTutorApi";
import lessonManifest from "../data/lessons.json";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

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

const SAMPLE_REVIEW_TRACES = [
  { id: "trace-1", type: "highlight", page: 3, topic: "problem", text: "Một thử nghiệm tốt bắt đầu bằng giả thuyết có thể kiểm chứng, không bắt đầu bằng giải pháp.", context: "Phân biệt giả thuyết vấn đề và giả thuyết giải pháp." },
  { id: "trace-2", type: "note", page: 5, topic: "problem", text: "Cần viết rõ tín hiệu nào sẽ khiến nhóm đổi hướng.", context: "Ghi chú cá nhân sau phần thiết kế tiêu chí thành công." },
  { id: "trace-3", type: "highlight", page: 9, topic: "interview", text: "Không hỏi người dùng họ có thích ý tưởng hay không; hãy quan sát hành vi và ví dụ gần nhất.", context: "Nguyên tắc phỏng vấn tránh câu hỏi dẫn dắt." },
  { id: "trace-4", type: "note", page: 12, topic: "interview", text: "Nhắc người tham gia think aloud, nhưng không giải thích thay cho prototype.", context: "Checklist điều phối buổi user test." },
  { id: "trace-5", type: "highlight", page: 16, topic: "evidence", text: "Evidence cần được ghi lại theo quan sát, trích dẫn và mức độ tin cậy.", context: "Cách tổng hợp dữ liệu sau phỏng vấn." },
  { id: "trace-6", type: "note", page: 19, topic: "evidence", text: "Một phản hồi đơn lẻ chưa đủ để kết luận; cần tìm pattern giữa nhiều phiên.", context: "Ghi chú cá nhân về tránh overfit insight." }
];

const REVIEW_GROUP_TEMPLATES = {
  problem: {
    title: "Giả thuyết và tiêu chí thử nghiệm",
    confidence: 92,
    rationale: "Hai dấu vết cùng nói về cách đặt giả thuyết và tín hiệu đổi hướng.",
    reviewDraft: "• Bắt đầu thử nghiệm bằng một giả thuyết có thể kiểm chứng, không bắt đầu bằng giải pháp.\n• Viết trước tín hiệu thành công, thất bại hoặc điều kiện khiến nhóm đổi hướng.\n• Tự kiểm tra: Tiêu chí nào sẽ khiến mình dừng thử nghiệm?",
    contextSuggestion: "Ví dụ context: Nếu dưới 3/5 người dùng hoàn thành tác vụ chính mà không được hướng dẫn, nhóm cần xem lại giả thuyết giải pháp."
  },
  interview: {
    title: "Phỏng vấn và think-aloud",
    confidence: 64,
    uncertain: true,
    rationale: "AI thấy cả hai dấu vết đều liên quan phỏng vấn, nhưng chưa chắc nguyên tắc tránh câu hỏi dẫn dắt và kỹ thuật think-aloud nên nằm chung một nhóm.",
    reviewDraft: "• Khi phỏng vấn, ưu tiên hành vi và ví dụ gần nhất thay vì hỏi người dùng có thích ý tưởng không.\n• Trong think-aloud, nhắc người dùng nói ra suy nghĩ nhưng không giải thích hoặc thao tác thay họ.\n• Tự kiểm tra: Facilitator nên làm gì khi người dùng im lặng quá lâu?",
    contextSuggestion: "Context AI tìm lại: Facilitator nên dùng lời nhắc trung tính như “Bạn đang nghĩ gì lúc này?” và tránh gợi ý bước tiếp theo."
  },
  evidence: {
    title: "Tổng hợp evidence",
    confidence: 78,
    rationale: "Dấu vết mô tả cách ghi evidence sau phiên test; AI đề xuất giữ thành một nhóm riêng.",
    reviewDraft: "• Ghi evidence theo ba lớp: điều quan sát được, trích dẫn liên quan và mức độ tin cậy.\n• Không biến một phản hồi đơn lẻ thành kết luận; tìm pattern giữa nhiều phiên.\n• Tự kiểm tra: Insight này dựa trên observation nào?",
    contextSuggestion: "Context AI tìm lại: Tách observation khỏi interpretation giúp nhóm kiểm tra lại kết luận khi có evidence mới."
  },
  other: {
    title: "Các ý cần làm rõ thêm",
    confidence: 46,
    uncertain: true,
    rationale: "AI chưa tìm thấy đủ tín hiệu để gắn các dấu vết này vào một chủ đề chắc chắn.",
    reviewDraft: "• Ôn lại các dấu vết nguồn bên dưới và viết một câu giải thích mối liên hệ giữa chúng.\n• Tự kiểm tra: Những ý này đang trả lời cùng một câu hỏi học tập hay cần được tách ra?",
    contextSuggestion: "AI cần thêm tiêu đề slide hoặc ghi chú của bạn để tìm context chính xác hơn."
  }
};

const traceStorageKey = lessonId => `vlearn:review-traces:${lessonId}`;
const inferTraceTopic = text => {
  const normalized = text.toLowerCase();
  if (/phỏng vấn|interview|think.?aloud|facilitator|người dùng/.test(normalized)) return "interview";
  if (/evidence|quan sát|observation|insight|pattern|tin cậy/.test(normalized)) return "evidence";
  if (/giả thuyết|thử nghiệm|experiment|tiêu chí|đổi hướng/.test(normalized)) return "problem";
  return "other";
};
const loadReviewTraces = lessonId => {
  try {
    const stored = JSON.parse(localStorage.getItem(traceStorageKey(lessonId)) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};
const persistReviewTraces = (lessonId, traces) => localStorage.setItem(traceStorageKey(lessonId), JSON.stringify(traces));

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

function SelectablePdfPage({ pdfDocument, pageNumber, marks, availableWidth }) {
  const canvasRef = useRef(null);
  const textLayerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let active = true;
    let renderTask;
    const renderPage = async () => {
      const page = await pdfDocument.getPage(pageNumber);
      if (!active) return;
      const baseViewport = page.getViewport({ scale: 1 });
      const fitScale = Math.max(0.45, Math.min((availableWidth - 40) / baseViewport.width, 1.5));
      const viewport = page.getViewport({ scale: fitScale });
      const canvas = canvasRef.current;
      const textLayerContainer = textLayerRef.current;
      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      setSize({ width: viewport.width, height: viewport.height });
      const context = canvas.getContext("2d");
      renderTask = page.render({ canvasContext: context, viewport, transform: outputScale === 1 ? null : [outputScale, 0, 0, outputScale, 0, 0] });
      await renderTask.promise;
      if (!active) return;
      textLayerContainer.replaceChildren();
      const textContent = await page.getTextContent();
      const textLayer = new pdfjsLib.TextLayer({ textContentSource: textContent, container: textLayerContainer, viewport });
      await textLayer.render();
    };
    renderPage().catch(error => {
      if (error?.name !== "RenderingCancelledException") console.error("Không thể render trang PDF", error);
    });
    return () => {
      active = false;
      renderTask?.cancel();
    };
  }, [availableWidth, pdfDocument, pageNumber]);

  return <div className="selectable-pdf-page" data-page-number={pageNumber} style={{ width: size.width || undefined, height: size.height || undefined }}>
    <canvas ref={canvasRef}/>
    <div ref={textLayerRef} className="textLayer"/>
    <div className="pdf-mark-layer">{marks.flatMap(trace => (trace.rects || []).map((rect, index) => <i className={trace.type} key={`${trace.id}-${index}`} style={rect.leftRatio == null
      ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
      : { left: `${rect.leftRatio * 100}%`, top: `${rect.topRatio * 100}%`, width: `${rect.widthRatio * 100}%`, height: `${rect.heightRatio * 100}%` }}/>) )}</div>
    <span className="pdf-page-number">{pageNumber}</span>
  </div>;
}

function SelectablePdfViewer({ url, traces, onSaveSelection }) {
  const viewerRef = useRef(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [availableWidth, setAvailableWidth] = useState(760);
  const [loadingError, setLoadingError] = useState("");
  const [selectionTool, setSelectionTool] = useState(null);

  useEffect(() => {
    let active = true;
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(document => {
      if (active) setPdfDocument(document);
    }).catch(error => {
      if (active) setLoadingError(error.message || "Không thể mở PDF.");
    });
    return () => {
      active = false;
      loadingTask.destroy();
    };
  }, [url]);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return undefined;
    const updateWidth = () => setAvailableWidth(viewer.clientWidth);
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewer);
    return () => observer.disconnect();
  }, []);

  const readSelection = event => {
    if (event?.target?.closest?.(".selection-popover")) return;
    window.setTimeout(() => {
      const selection = window.getSelection();
      const viewer = viewerRef.current;
      if (!viewer || !selection || selection.isCollapsed || !selection.toString().trim()) {
        setSelectionTool(null);
        return;
      }
      const range = selection.getRangeAt(0);
      const origin = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentElement : range.startContainer;
      const pageElement = origin?.closest?.(".selectable-pdf-page");
      if (!pageElement || !viewer.contains(pageElement)) return;
      const pageBounds = pageElement.getBoundingClientRect();
      const viewerBounds = viewer.getBoundingClientRect();
      const selectedSpans = [...pageElement.querySelectorAll(".textLayer span")].filter(span => {
        try {
          return range.intersectsNode(span) && span.textContent.trim();
        } catch {
          return false;
        }
      });
      const selectedText = selectedSpans.map(span => span.textContent.trim()).filter(Boolean).join(" ").replace(/\s+/g, " ").trim() || selection.toString().replace(/\s+/g, " ").trim();
      const clientRects = [...range.getClientRects()].filter(rect => rect.width > 1 && rect.height > 1 && rect.top >= pageBounds.top - 1 && rect.bottom <= pageBounds.bottom + 1);
      if (!clientRects.length) return;
      const rects = clientRects.map(rect => ({
        leftRatio: (rect.left - pageBounds.left) / pageBounds.width,
        topRatio: (rect.top - pageBounds.top) / pageBounds.height,
        widthRatio: rect.width / pageBounds.width,
        heightRatio: rect.height / pageBounds.height
      }));
      const anchor = clientRects[clientRects.length - 1];
      setSelectionTool({
        text: selectedText,
        note: "",
        noteMode: false,
        page: Number(pageElement.dataset.pageNumber),
        rects,
        left: Math.min(anchor.left - viewerBounds.left + viewer.scrollLeft, viewer.scrollLeft + viewer.clientWidth - 210),
        top: anchor.bottom - viewerBounds.top + viewer.scrollTop + 9
      });
    }, 0);
  };

  const saveSelection = type => {
    if (!selectionTool) return;
    if (type === "note" && !selectionTool.note.trim()) return;
    onSaveSelection({ ...selectionTool, type });
    window.getSelection()?.removeAllRanges();
    setSelectionTool(null);
  };

  return <div className="selectable-pdf-viewer" ref={viewerRef} onMouseUp={readSelection} onKeyUp={readSelection}>
    {!pdfDocument && !loadingError && <div className="pdf-loading"><Sparkles size={22}/> Đang dựng text layer để bạn có thể highlight...</div>}
    {loadingError && <div className="pdf-loading error">{loadingError}</div>}
    {pdfDocument && Array.from({ length: pdfDocument.numPages }, (_, index) => {
      const pageNumber = index + 1;
      return <SelectablePdfPage key={pageNumber} pdfDocument={pdfDocument} pageNumber={pageNumber} availableWidth={availableWidth} marks={traces.filter(trace => Number(trace.page) === pageNumber)}/>;
    })}
    {selectionTool && <div className={`selection-popover ${selectionTool.noteMode ? "note-mode" : ""}`} style={{ left: selectionTool.left, top: selectionTool.top }} onMouseUp={event => event.stopPropagation()}>
      {!selectionTool.noteMode ? <>
        <button onClick={() => saveSelection("highlight")}><Highlighter size={15}/> Highlight</button>
        <button onClick={() => setSelectionTool(current => ({ ...current, noteMode: true }))}><NotebookPen size={15}/> Note</button>
      </> : <div className="inline-note-composer">
        <div className="note-composer-title"><span><NotebookPen size={17}/></span><div><b>Thêm note</b><small>Note sẽ được gắn với đoạn chữ đã chọn.</small></div><button onClick={() => setSelectionTool(null)} aria-label="Đóng ô nhập note"><XCircle size={18}/></button></div>
        <small>ĐOẠN ĐÃ CHỌN</small><p>{selectionTool.text}</p>
        <textarea autoFocus value={selectionTool.note} onChange={event => setSelectionTool(current => ({ ...current, note: event.target.value }))} placeholder="Viết note của bạn..." onKeyUp={event => event.stopPropagation()} onKeyDown={event => { event.stopPropagation(); if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) saveSelection("note"); }}/>
        <em>Nhấn Ctrl + Enter để lưu nhanh</em><div><button onClick={() => setSelectionTool(null)}>Hủy</button><button disabled={!selectionTool.note.trim()} onClick={() => saveSelection("note")}><NotebookPen size={14}/> Lưu note</button></div>
      </div>}
    </div>}
  </div>;
}

function Reader({ lesson }) {
  const navigate = useNavigate();
  const [tracePanelOpen, setTracePanelOpen] = useState(false);
  const [savedTraces, setSavedTraces] = useState(() => loadReviewTraces(lesson.id));

  useEffect(() => {
    setSavedTraces(loadReviewTraces(lesson.id));
  }, [lesson.id]);

  const saveSelectionTrace = selection => {
    const isNote = selection.type === "note";
    const next = [...savedTraces, {
      id: `trace-user-${createId()}`,
      type: selection.type,
      page: selection.page,
      topic: inferTraceTopic(`${selection.text} ${selection.note || ""}`),
      text: isNote ? selection.note.trim() : selection.text,
      sourceText: selection.text,
      context: isNote ? `Từ đoạn đã chọn: “${selection.text}”` : "Đoạn được highlight trực tiếp trên slide.",
      rects: selection.rects
    }];
    setSavedTraces(next);
    persistReviewTraces(lesson.id, next);
    setTracePanelOpen(true);
  };

  const removeTrace = traceId => {
    const next = savedTraces.filter(trace => trace.id !== traceId);
    setSavedTraces(next);
    persistReviewTraces(lesson.id, next);
  };

  return (
    <main className="reader">
      <div className="reader-toolbar"><button className="selected"><BookOpen size={17}/> Đọc</button><span>{lesson.day} · Bài giảng</span><button className={`trace-launch ${tracePanelOpen ? "active" : ""}`} aria-label="Ghi dấu vết" onClick={() => setTracePanelOpen(current => !current)}><Highlighter size={17}/> Ghi dấu vết <i>{savedTraces.length}</i></button><button className="review-launch" onClick={() => navigate(`/review/${lesson.id}`)}><Layers3 size={17}/> Tạo nội dung ôn tập</button><a href={lesson.pdfUrl} download={lesson.file}><Download size={17}/> Tải PDF</a></div>
      <div className={`pdf-wrap ${tracePanelOpen ? "with-trace-panel" : ""}`}>
        <SelectablePdfViewer key={lesson.id} url={lesson.pdfUrl} traces={savedTraces} onSaveSelection={saveSelectionTrace}/>
        {tracePanelOpen && <aside className="trace-panel">
          <div className="trace-panel-head"><div><b>Note & highlight</b><small>Các dấu vết này sẽ được dùng khi tạo nội dung ôn tập.</small></div><button onClick={() => setTracePanelOpen(false)} aria-label="Đóng ghi dấu vết"><XCircle size={19}/></button></div>
          <div className="selection-guide"><span><Highlighter size={17}/></span><div><b>Bôi đen chữ ngay trên slide</b><p>Hai nút Highlight và Note sẽ xuất hiện cạnh vùng chọn. Bấm một nút để tự động lưu.</p></div></div>
          <div className="saved-traces-head"><b>Dấu vết đã lưu</b><span>{savedTraces.length}</span></div>
          <div className="saved-traces">{savedTraces.length ? savedTraces.map(trace => <div key={trace.id}><span className={trace.type}><span>{trace.type === "highlight" ? <Highlighter size={14}/> : <NotebookPen size={14}/>}</span><small>{trace.type === "highlight" ? "HIGHLIGHT" : "NOTE"} · TRANG {trace.page}</small></span><p>{trace.text}</p>{trace.type === "note" && trace.sourceText && <em>Đoạn nguồn: “{trace.sourceText}”</em>}<button onClick={() => removeTrace(trace.id)} title="Xóa dấu vết"><Trash2 size={14}/></button></div>) : <p className="no-traces">Chưa có dấu vết. Bôi đen chữ trên slide rồi chọn Highlight hoặc Note.</p>}</div>
          <button className="open-review-from-traces" disabled={!savedTraces.length} onClick={() => navigate(`/review/${lesson.id}`)}>Tạo nội dung ôn tập từ {savedTraces.length} dấu vết <ChevronRight size={16}/></button>
        </aside>}
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

function ReviewTrace({ trace, selected, onToggle, compact = false, onEdit, onRemove, onSplit }) {
  const TypeIcon = trace.type === "highlight" ? Highlighter : NotebookPen;
  return <div className={`review-trace ${selected ? "selected" : ""} ${compact ? "compact" : ""}`}>
    {!compact && <input type="checkbox" checked={selected} onChange={() => onToggle(trace.id)} aria-label={`Chọn dấu vết trang ${trace.page}`}/>} 
    <div className={`trace-icon ${trace.type}`}><TypeIcon size={17}/></div>
    <div className="trace-copy">
      <small>{trace.type === "highlight" ? "HIGHLIGHT" : "GHI CHÚ"} · TRANG {trace.page}</small>
      {compact
        ? <textarea className="trace-edit" value={trace.text} onChange={event => onEdit(event.target.value)} aria-label={`Sửa nội dung trang ${trace.page}`}/>
        : <p>{trace.text}</p>}
      {!compact && <span>{trace.context}</span>}
    </div>
    {compact && <div className="trace-actions">
      <button onClick={onSplit} title="Tách thành nhóm riêng"><Split size={15}/></button>
      <button onClick={onRemove} title="Bỏ khỏi bản ôn tập"><Trash2 size={15}/></button>
    </div>}
  </div>;
}

function ReviewBuilder() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const lesson = LESSONS.find(item => item.id === lessonId) ?? LESSONS.find(item => item.id === DEFAULT_LESSON_ID);
  const [availableTraces, setAvailableTraces] = useState(() => loadReviewTraces(lesson.id));
  const [step, setStep] = useState("select");
  const [selectedIds, setSelectedIds] = useState(() => new Set(loadReviewTraces(lesson.id).map(item => item.id)));
  const [groups, setGroups] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [proposalError, setProposalError] = useState("");
  const [analysisProgress, setAnalysisProgress] = useState("");
  const [mergeIds, setMergeIds] = useState(() => new Set());
  const [drafts, setDrafts] = useState({});

  const selectedTraces = availableTraces.filter(trace => selectedIds.has(trace.id));
  const confirmedGroups = groups.filter(group => group.status === "confirmed");
  const confirmedCount = confirmedGroups.length;
  const rejectedCount = groups.filter(group => group.status === "rejected").length;
  const pendingCount = groups.filter(group => group.status === "pending").length;

  const toggleTrace = id => setSelectedIds(current => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const loadDemoTraces = () => {
    const samples = SAMPLE_REVIEW_TRACES.map(trace => ({ ...trace, id: `${trace.id}-${createId()}` }));
    setAvailableTraces(samples);
    setSelectedIds(new Set(samples.map(trace => trace.id)));
    persistReviewTraces(lesson.id, samples);
  };

  const proposeGroups = async () => {
    setAnalyzing(true);
    setProposalError("");
    setAnalysisProgress("Đang kết nối ViAI…");
    try {
      const result = await createReviewProposals({
        lessonId: lesson.id,
        traces: selectedTraces,
        onProgress: event => setAnalysisProgress(
          `${event.message}${event.elapsed ? ` ${event.elapsed}s` : ""}`
        )
      });
      const traceById = new Map(selectedTraces.map(trace => [String(trace.id), trace]));
      const proposedGroups = result.proposals.map((proposal, index) => {
        const items = proposal.source_ids.map(id => traceById.get(String(id))).filter(Boolean);
        if (!items.length) throw new Error(`Nhóm AI số ${index + 1} không có dấu vết nguồn hợp lệ.`);
        return {
          id: `group-ai-${createId()}`,
          title: proposal.title,
          confidence: proposal.confidence,
          uncertain: proposal.uncertain,
          rationale: proposal.rationale,
          reviewDraft: proposal.review_draft,
          contextSuggestion: proposal.context_suggestion,
          includeContext: false,
          status: "pending",
          items
        };
      });
      setGroups(proposedGroups);
      setMergeIds(new Set());
      setStep("organize");
    } catch (error) {
      setProposalError(error.message || "Không thể tạo đề xuất ôn tập lúc này.");
    } finally {
      setAnalyzing(false);
      setAnalysisProgress("");
    }
  };

  const updateGroup = (groupId, changes) => setGroups(current => current.map(group =>
    group.id === groupId ? { ...group, ...changes, status: changes.status ?? "pending" } : group
  ));

  const removeItem = (groupId, itemId) => setGroups(current => current
    .map(group => group.id === groupId ? { ...group, status: "pending", items: group.items.filter(item => item.id !== itemId) } : group)
    .filter(group => group.items.length > 0));

  const updateItem = (groupId, itemId, text) => setGroups(current => current.map(group => group.id === groupId
    ? { ...group, status: "pending", items: group.items.map(item => item.id === itemId ? { ...item, text } : item) }
    : group));

  const splitItem = (groupId, item) => setGroups(current => {
    const source = current.find(group => group.id === groupId);
    const remaining = current.map(group => group.id === groupId
      ? { ...group, status: "pending", items: group.items.filter(entry => entry.id !== item.id) }
      : group).filter(group => group.items.length > 0);
    return [...remaining, {
      id: `group-split-${createId()}`,
      title: `Nhóm mới từ trang ${item.page}`,
      confidence: 50,
      uncertain: true,
      rationale: "Nhóm này được tách thủ công; AI chưa đánh giá lại quan hệ với các nhóm còn lại.",
      reviewDraft: `• ${item.text}\n• Tự kiểm tra: Ý này liên hệ thế nào với mục tiêu bài học?`,
      contextSuggestion: source?.contextSuggestion ?? "Hãy bổ sung context nếu dấu vết này chưa đủ rõ khi đứng riêng.",
      includeContext: false,
      status: "pending",
      items: [item]
    }];
  });

  const addItem = groupId => {
    const text = (drafts[groupId] || "").trim();
    if (!text) return;
    const group = groups.find(entry => entry.id === groupId);
    updateGroup(groupId, { items: [...group.items, {
      id: `custom-${createId()}`, type: "note", page: "Tự thêm", topic: "custom", text, context: "Nội dung do người học bổ sung."
    }] });
    setDrafts(current => ({ ...current, [groupId]: "" }));
  };

  const toggleMerge = groupId => setMergeIds(current => {
    const next = new Set(current);
    next.has(groupId) ? next.delete(groupId) : next.add(groupId);
    return next;
  });

  const mergeSelected = () => {
    const chosen = groups.filter(group => mergeIds.has(group.id));
    if (chosen.length < 2) return;
    const combined = {
      ...chosen[0],
      id: `group-merged-${createId()}`,
      title: chosen.map(group => group.title).join(" + "),
      confidence: Math.min(...chosen.map(group => group.confidence ?? 50)),
      uncertain: true,
      rationale: "Nhóm được người học gộp thủ công. Hãy kiểm tra lại mạch nội dung trước khi xác nhận.",
      reviewDraft: chosen.map(group => group.reviewDraft).filter(Boolean).join("\n"),
      contextSuggestion: chosen.map(group => group.contextSuggestion).filter(Boolean).join(" "),
      includeContext: chosen.some(group => group.includeContext),
      status: "pending",
      items: chosen.flatMap(group => group.items)
    };
    setGroups(current => [...current.filter(group => !mergeIds.has(group.id)), combined]);
    setMergeIds(new Set());
  };

  return <div className="review-page">
    <header className="review-topbar">
      <button onClick={() => step === "select" ? navigate(`/lesson/${lesson.id}`) : setStep(step === "final" ? "organize" : "select")}><ArrowLeft size={18}/> Quay lại</button>
      <div><b>Tạo nội dung ôn tập</b><small>{lesson.day} · {lesson.title}</small></div>
      <div className="review-top-actions"><span className="agency-badge"><Sparkles size={14}/> AI đề xuất · Bạn quyết định</span><button onClick={() => navigate(`/lesson/${lesson.id}`)}><XCircle size={15}/> Dừng tạo</button></div>
    </header>

    <div className="review-progress">
      {["Chọn dấu vết", "Sắp xếp & xác nhận", "Bản ôn tập"].map((label, index) => {
        const activeIndex = step === "select" ? 0 : step === "organize" ? 1 : 2;
        return <div className={index <= activeIndex ? "active" : ""} key={label}><span>{index < activeIndex ? "✓" : index + 1}</span>{label}</div>;
      })}
    </div>

    {step === "select" && <main className="review-shell selection-step">
      <div className="review-intro">
        <div><span className="eyebrow"><Layers3 size={15}/> BƯỚC 1 · NGUỒN ÔN TẬP</span><h1>Chọn những dấu vết bạn muốn ôn</h1><p>AI sẽ đọc các note/highlight đã chọn, đề xuất nhóm, context và một bản nháp ôn tập để bạn duyệt.</p></div>
        <div className="selection-count"><b>{selectedIds.size}</b><span>đã chọn</span></div>
      </div>
      <div className="selection-tools">{!availableTraces.length && <button onClick={loadDemoTraces}>Nạp dấu vết demo</button>}<button disabled={!availableTraces.length} onClick={() => setSelectedIds(new Set(availableTraces.map(item => item.id)))}>Chọn tất cả</button><button disabled={!availableTraces.length} onClick={() => setSelectedIds(new Set())}>Bỏ chọn</button></div>
      <div className="trace-list">{availableTraces.length ? availableTraces.map(trace => <ReviewTrace key={trace.id} trace={trace} selected={selectedIds.has(trace.id)} onToggle={toggleTrace}/>) : <div className="empty-traces"><Highlighter size={28}/><h3>Chưa có note hoặc highlight</h3><p>Quay lại bài học, mở <b>Ghi dấu vết</b> để lưu đoạn bạn muốn ôn; hoặc nạp dữ liệu demo để thử nhanh.</p><button onClick={() => navigate(`/lesson/${lesson.id}`)}><ArrowLeft size={15}/> Về bài học để tạo dấu vết</button></div>}</div>
      {proposalError && <div className="review-api-error" role="alert"><XCircle size={18}/><div><b>Chưa tạo được bản ôn tập bằng AI</b><span>{proposalError}</span></div></div>}
      <div className="review-sticky-bar"><span><b>{selectedIds.size} dấu vết</b> sẽ được gửi cho ViAI cùng nội dung slide. Không proposal nào được lưu nếu bạn chưa xác nhận.</span><button disabled={!selectedIds.size || analyzing} onClick={proposeGroups}>{analyzing ? <><span className="streaming-dot"/>{analysisProgress}</> : <>Gọi ViAI tạo bản ôn tập <ChevronRight size={18}/></>}</button></div>
    </main>}

    {step === "organize" && <main className="review-shell organize-step">
      <div className="review-intro compact-heading"><div><span className="eyebrow"><Sparkles size={15}/> BƯỚC 2 · AI ASK/RECOMMEND</span><h1>Duyệt nội dung AI đề xuất</h1><p>Mỗi proposal có nội dung ôn tập, dấu vết nguồn và mức chắc chắn. Bạn chấp nhận, sửa hoặc reject.</p></div><div className="selection-count"><b>{confirmedCount}/{groups.length}</b><span>đã chấp nhận</span></div></div>
      <div className="merge-toolbar"><span>Chọn ít nhất 2 nhóm để gộp</span><button disabled={mergeIds.size < 2} onClick={mergeSelected}><Merge size={16}/> Gộp {mergeIds.size || ""} nhóm</button></div>
      <div className="review-groups">{groups.map((group, groupIndex) => group.status === "rejected" ? <article className="review-group rejected" key={group.id}>
        <div className="rejected-proposal"><XCircle size={20}/><div><span>ĐÃ REJECT PROPOSAL {groupIndex + 1}</span><b>{group.title}</b><small>{group.items.length} dấu vết sẽ không xuất hiện trong bản ôn tập.</small></div><button onClick={() => updateGroup(group.id, { status: "pending" })}><RotateCcw size={15}/> Khôi phục</button></div>
      </article> : <article className={`review-group ${group.status === "confirmed" ? "confirmed" : ""} ${group.uncertain ? "uncertain" : ""}`} key={group.id}>
        <div className="group-heading">
          <label className="merge-check"><input type="checkbox" checked={mergeIds.has(group.id)} onChange={() => toggleMerge(group.id)}/> Chọn để gộp</label>
          <span>AI PROPOSAL {groupIndex + 1}</span>
          <input className="group-title-input" value={group.title} onChange={event => updateGroup(group.id, { title: event.target.value })}/>
          {group.status === "confirmed" && <span className="confirmed-mark"><CheckCircle2 size={15}/> Đã chấp nhận</span>}
        </div>
        <div className={`proposal-confidence ${group.uncertain ? "needs-review" : ""}`}>
          <span>{group.confidence}% chắc chắn</span><p>{group.rationale}</p>{group.uncertain && <b>Đề xuất cần bạn xác nhận</b>}
        </div>
        <div className="proposal-draft"><label><Sparkles size={16}/> Nội dung ôn tập AI đề xuất</label><textarea value={group.reviewDraft} onChange={event => updateGroup(group.id, { reviewDraft: event.target.value })}/><small>Bạn có thể sửa trực tiếp. Đây là bản nháp, chưa phải bản cuối.</small></div>
        <div className="source-heading"><span>NOTE / HIGHLIGHT ĐƯỢC AI SỬ DỤNG</span><b>{group.items.length} nguồn</b></div>
        <div className="group-items">{group.items.map(item => <ReviewTrace key={item.id} trace={item} compact onEdit={text => updateItem(group.id, item.id, text)} onRemove={() => removeItem(group.id, item.id)} onSplit={() => splitItem(group.id, item)}/>)}</div>
        <div className="add-review-item"><input value={drafts[group.id] || ""} onChange={event => setDrafts(current => ({ ...current, [group.id]: event.target.value }))} onKeyDown={event => { if (event.key === "Enter") addItem(group.id); }} placeholder="Thêm note/highlight nguồn vào proposal này..."/><button disabled={!(drafts[group.id] || "").trim()} onClick={() => addItem(group.id)}><Plus size={15}/> Thêm nguồn</button></div>
        <div className="context-suggestion"><Sparkles size={17}/><div><b>Context AI gợi ý còn thiếu</b><textarea value={group.contextSuggestion} onChange={event => updateGroup(group.id, { contextSuggestion: event.target.value })}/><label><input type="checkbox" checked={group.includeContext} onChange={event => updateGroup(group.id, { includeContext: event.target.checked })}/> Đưa context này vào bản ôn tập</label></div></div>
        <div className="proposal-actions"><button className="reject-group" onClick={() => { updateGroup(group.id, { status: "rejected" }); setMergeIds(current => { const next = new Set(current); next.delete(group.id); return next; }); }}><XCircle size={16}/> Reject đề xuất</button><button className={`confirm-group ${group.status === "confirmed" ? "is-confirmed" : ""}`} onClick={() => updateGroup(group.id, { status: group.status === "confirmed" ? "pending" : "confirmed" })}>{group.status === "confirmed" ? <><RotateCcw size={16}/> Mở lại để chỉnh sửa</> : <><CheckCircle2 size={16}/> Chấp nhận proposal</>}</button></div>
      </article>)}</div>
      <div className="review-sticky-bar"><span><b>{confirmedCount} chấp nhận · {rejectedCount} reject · {pendingCount} chờ duyệt.</b> Chỉ proposal đã chấp nhận mới vào bản cuối.</span><button disabled={!confirmedCount || pendingCount > 0} onClick={() => setStep("final")}>Tạo bản ôn tập đã duyệt <ChevronRight size={18}/></button></div>
    </main>}

    {step === "final" && <main className="review-shell final-step">
      <div className="final-hero"><div className="complete-icon"><CheckCircle2 size={28}/></div><div><span className="eyebrow">BƯỚC 3 · DO BẠN XÁC NHẬN</span><h1>Bản ôn tập đã sẵn sàng</h1><p>AI hỗ trợ sắp xếp và tìm context; nội dung dưới đây chỉ được tạo sau khi bạn xác nhận từng nhóm.</p></div></div>
      <div className="review-document">{confirmedGroups.map((group, index) => <section key={group.id}><span>0{index + 1}</span><div><h2>{group.title}</h2>{group.reviewDraft.split(/\n+/).filter(Boolean).map((line, lineIndex) => <p key={`${group.id}-${lineIndex}`}>{line.replace(/^[•*-]\s*/, "")}</p>)}{group.includeContext && <aside><Sparkles size={15}/><b>Context bổ sung:</b> {group.contextSuggestion}</aside>}<details><summary>Xem {group.items.length} note/highlight nguồn</summary>{group.items.map(item => <small key={item.id}>{item.type === "highlight" ? "Highlight" : "Ghi chú"} trang {item.page}: {item.text}</small>)}</details></div></section>)}</div>
      <div className="final-actions"><button onClick={() => setStep("organize")}><ArrowLeft size={16}/> Tiếp tục chỉnh sửa</button><button onClick={() => window.print()}><Download size={16}/> Lưu / In bản ôn tập</button></div>
    </main>}
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
        <Route path="/review/:lessonId" element={<ReviewBuilder/>}/>
        <Route path="/quiz/:quizId" element={<QuizPage/>}/>
        <Route path="*" element={<Navigate to={`/lesson/${DEFAULT_LESSON_ID}`} replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
