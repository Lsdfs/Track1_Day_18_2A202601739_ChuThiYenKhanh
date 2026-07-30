let currentLesson = null;
let currentSlideIndex = 0;
let quizAnswers = [];
let quizResults = null;

const SESSION_KEY = 'vlearn_quiz_results';

async function loadLessons() {
  try {
    const response = await fetch('/api/lessons');
    const lessons = await response.json();
    renderLessonList(lessons);
  } catch (error) {
    console.error('Error loading lessons:', error);
  }
}

function renderLessonList(lessons) {
  const container = document.getElementById('lesson-list');
  if (!container) return;

  container.innerHTML = lessons.map(lesson => `
    <div class="lesson-card" onclick="openLesson('${lesson.id}')">
      <h3>${lesson.title}</h3>
      <p>${lesson.subtitle}</p>
      <div class="duration">
        <span>⏱</span>
        <span>${lesson.duration}</span>
      </div>
      <div style="margin-top: 12px; font-size: 13px; color: #999;">
        Giảng viên: ${lesson.instructor}
      </div>
    </div>
  `).join('');
}

async function openLesson(lessonId) {
  try {
    const response = await fetch(`/api/lessons/${lessonId}`);
    const lesson = await response.json();
    currentLesson = lesson;
    currentSlideIndex = 0;
    quizAnswers = [];
    quizResults = null;
    window.location.href = `lesson.html?id=${lessonId}`;
  } catch (error) {
    console.error('Error opening lesson:', error);
  }
}

async function loadLessonFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const lessonId = params.get('id');
  if (!lessonId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(`/api/lessons/${lessonId}`);
    currentLesson = await response.json();
    renderLessonHeader();
    renderSlides();
  } catch (error) {
    console.error('Error loading lesson:', error);
  }
}

function renderLessonHeader() {
  const container = document.getElementById('lesson-header');
  if (!container) return;

  container.innerHTML = `
    <div class="lesson-header">
      <a href="index.html" class="back-btn">←</a>
      <div class="lesson-title">${currentLesson.title}</div>
      <div class="lesson-meta">
        <span>${currentLesson.duration}</span>
        <span>${currentLesson.instructor}</span>
      </div>
    </div>
  `;
}

function renderSlides() {
  const container = document.getElementById('slides-container');
  if (!container || !currentLesson || !currentLesson.slides) return;

  container.innerHTML = currentLesson.slides.map((slide, index) => `
    <div class="slide-summary" id="slide-${index}" style="margin-bottom: 24px;">
      <div class="slide-header">
        <div class="slide-number">${slide.slideNo}</div>
        <div class="slide-title">${slide.title}</div>
        <button class="btn btn-outline btn-sm" style="margin-left: auto; font-size: 11px; padding: 4px 8px;" onclick="askAiAboutSlide(${index})">🤖 Hỏi AI</button>
      </div>
      <div class="slide-content">${slide.content}</div>
      ${slide.keyPoints && slide.keyPoints.length > 0 ? `
        <ul class="key-points">
          ${slide.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('');
}

function askAiAboutSlide(index) {
  if (!currentLesson || !currentLesson.slides[index]) return;
  const slide = currentLesson.slides[index];
  addChatMessage(`🤖 [Hỏi đáp Slide ${slide.slideNo}]: ${slide.title}\n• Nội dung: ${slide.content}\n• Điểm cốt lõi:\n${slide.keyPoints ? slide.keyPoints.map(kp => '  - ' + kp).join('\n') : ''}`, 'bot');
}

function askAiToSummarizeAll() {
  if (!currentLesson) return;
  addChatMessage(`🤖 [Tóm tắt tổng quan bài học "${currentLesson.title}"]: Bài học gồm ${currentLesson.slides.length} slide giúp bạn nắm vững các anti-patterns, AI Product Lifecycle, 6 gate criteria và cách chọn đúng mức kiến trúc (Rule, Workflow, LLM Feature, Agent).`, 'bot');
}

function sendQuickPrompt(promptText) {
  addChatMessage(promptText, 'user');
  setTimeout(() => {
    let reply = "Dạ, tôi đã ghi nhận câu hỏi của bạn. Trong bài học này, điểm mấu chốt là xác định đúng bài toán, đánh giá baseline và kiểm soát rủi ro trước khi xây dựng AI.";
    if (promptText.includes('Tóm tắt')) {
      const slide = currentLesson.slides[currentSlideIndex];
      reply = `Tóm tắt Slide ${slide.slideNo} (${slide.title}): ${slide.content}`;
    } else if (promptText.includes('Ví dụ')) {
      reply = "Ví dụ thực tế: Thay vì vội vàng build AI Agent cho CS, ta cần kiểm tra xem Rule/Workflow có đủ xử lý không để tránh đốt tiền và tăng rủi ro lỗi.";
    } else if (promptText.includes('Feature vs Agent')) {
      reply = "LLM Feature phù hợp với tác vụ text transform, tóm tắt có review; trong khi Agent tự động gọi tool nhiều bước, có vòng lặp và cần guardrails chặt chẽ hơn.";
    }
    addChatMessage(reply, 'bot');
  }, 500);
}

function sendUserMessage() {
  const input = document.getElementById('chat-input');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  
  addChatMessage(text, 'user');
  input.value = '';

  setTimeout(() => {
    let reply = "Cảm ơn câu hỏi của bạn về 'Xác Định Bài Toán Kinh Doanh Cho AI'. Ở bước Problem Scoping, việc xác định rõ Actor, Bottleneck và Metric là chìa khóa thành công.";
    if (text.toLowerCase().includes('quiz')) {
      reply = "Bạn có thể bấm nút 'Làm Quiz Cuối Buổi' ở phía dưới để kiểm tra kiến thức ngay nhé!";
    } else if (text.toLowerCase().includes('gate')) {
      reply = "Mỗi giai đoạn trong AI Product Lifecycle đều có một Gate Go/No-Go dựa trên metric, baseline, eval và deploy controls.";
    }
    addChatMessage(reply, 'bot');
  }, 600);
}

function handleChatKeypress(event) {
  if (event.key === 'Enter') {
    sendUserMessage();
  }
}

function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById('chat-messages');
  if (!messagesContainer) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  messagesContainer.appendChild(bubble);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function startQuiz() {
  window.location.href = `quiz.html?id=${currentLesson.id}`;
}

async function loadQuiz() {
  const params = new URLSearchParams(window.location.search);
  const lessonId = params.get('id');
  if (!lessonId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const lessonResponse = await fetch(`/api/lessons/${lessonId}`);
    const lesson = await lessonResponse.json();
    currentLesson = lesson;

    const response = await fetch(`/api/lessons/${lessonId}/quiz`);
    const quizData = await response.json();
    renderQuiz(quizData.quiz);
  } catch (error) {
    console.error('Error loading quiz:', error);
  }
}

function renderQuiz(quiz) {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  quizAnswers = new Array(quiz.questions.length).fill(null);

  container.innerHTML = `
    <div class="quiz-header">
      <h2>${quiz.title}</h2>
      <p>${quiz.questions.length} câu hỏi · Điểm đạt: ${quiz.passingScore}%</p>
    </div>
    <div id="questions-container"></div>
    <div class="quiz-nav">
      <button class="btn btn-outline" id="prev-btn" onclick="prevQuestion()">← Trước</button>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
      </div>
      <button class="btn btn-primary" id="next-btn" onclick="nextQuestion()">
        ${quiz.questions.length > 1 ? 'Tiếp' : 'Nộp bài'}
      </button>
    </div>
  `;

  renderQuestion(0, quiz);
  updateNav(0, quiz);
  updateProgress(0, quiz.questions.length);
}

function renderQuestion(index, quiz) {
  const container = document.getElementById('questions-container');
  if (!container) return;

  const q = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

  container.innerHTML = `
    <div class="question active" id="question-${index}">
      <div class="question-number">Câu ${index + 1} / ${quiz.questions.length}</div>
      <div class="question-text">${q.question}</div>
      <div class="options">
        ${q.options.map((opt, optIdx) => `
          <label class="option" onclick="selectOption(${index}, ${optIdx})">
            <input type="radio" name="q${index}" ${quizAnswers[index] === optIdx ? 'checked' : ''} value="${optIdx}">
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;

  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.textContent = isLast ? 'Nộp bài' : 'Tiếp';
  }
}

function selectOption(questionIndex, optionIndex) {
  quizAnswers[questionIndex] = optionIndex;

  const options = document.querySelectorAll(`#question-${questionIndex} .option`);
  options.forEach((opt, idx) => {
    opt.classList.toggle('selected', idx === optionIndex);
  });
}

function prevQuestion() {
  if (!currentLesson) return;
  const quiz = currentLesson.quiz;
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    renderQuestion(currentSlideIndex, quiz);
    updateProgress(currentSlideIndex, quiz.questions.length);
    updateNav(currentSlideIndex, quiz);
  }
}

function nextQuestion() {
  if (!currentLesson) return;

  const quiz = currentLesson.quiz;
  const answered = quizAnswers[currentSlideIndex] !== null;

  if (!answered) {
    alert('Vui lòng chọn một đáp án trước khi tiếp tục.');
    return;
  }

  if (currentSlideIndex < quiz.questions.length - 1) {
    currentSlideIndex++;
    renderQuestion(currentSlideIndex, quiz);
    updateProgress(currentSlideIndex, quiz.questions.length);
    updateNav(currentSlideIndex, quiz);
  } else {
    submitQuiz();
  }
}

function updateNav(index, quiz) {
  const prevBtn = document.getElementById('prev-btn');
  if (prevBtn) {
    prevBtn.disabled = index === 0;
  }
}

function updateProgress(index, total) {
  const progressFill = document.getElementById('progress-fill');
  if (progressFill) {
    const percent = ((index + 1) / total) * 100;
    progressFill.style.width = `${percent}%`;
  }
}

async function submitQuiz() {
  try {
    const response = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: currentLesson.id,
        answers: quizAnswers
      })
    });
    const results = await response.json();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      lessonId: currentLesson.id,
      results: results
    }));
    window.location.href = `results.html?id=${currentLesson.id}`;
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
}

async function loadResults() {
  const params = new URLSearchParams(window.location.search);
  const lessonId = params.get('id');

  if (!lessonId) {
    window.location.href = 'index.html';
    return;
  }

  try {
    const lessonResponse = await fetch(`/api/lessons/${lessonId}`);
    const lesson = await lessonResponse.json();
    currentLesson = lesson;

    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.lessonId === lessonId) {
        renderResults(parsed.results, lesson);
        sessionStorage.removeItem(SESSION_KEY);
        return;
      }
    }

    const response = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: lessonId,
        answers: quizAnswers
      })
    });
    const results = await response.json();
    renderResults(results, lesson);
  } catch (error) {
    console.error('Error loading results:', error);
  }
}

function renderResults(results, lesson) {
  const container = document.getElementById('results-container');
  if (!container) return;

  const scoreClass = results.passed ? 'pass' : 'fail';
  const statusText = results.passed ? 'ĐẠT' : 'CHƯA ĐẠT';

  container.innerHTML = `
    <div class="score-circle ${scoreClass}">
      <div>${results.percentage}%</div>
    </div>
    <h2 class="results-title">${statusText}</h2>
    <p class="results-subtitle">
      ${results.score}/${results.total} câu đúng
    </p>
    <div class="results-summary">
      <div class="stat">
        <div class="stat-value">${results.score}</div>
        <div class="stat-label">Đúng</div>
      </div>
      <div class="stat">
        <div class="stat-value">${results.total - results.score}</div>
        <div class="stat-label">Sai</div>
      </div>
      <div class="stat">
        <div class="stat-value">${results.percentage}%</div>
        <div class="stat-label">Tỷ lệ</div>
      </div>
    </div>
    <div class="results-detail">
      ${results.results.map((r, idx) => `
        <div class="result-item ${r.isCorrect ? 'correct' : 'incorrect'}">
          <div class="result-question">
            ${idx + 1}. ${r.question}
          </div>
          <div style="font-size: 13px; color: #666;">
            ${r.isCorrect ? '✓ Đúng' : `✗ Sai (Đáp án: ${r.correctAnswer})`}
          </div>
          ${r.explanation ? `<div class="result-explanation">${r.explanation}</div>` : ''}
        </div>
      `).join('')}
    </div>
    <a href="index.html" class="back-btn">← Về trang chủ</a>
  `;
}

function initPage() {
  const page = document.body.dataset.page;
  if (page === 'home') {
    loadLessons();
  } else if (page === 'lesson') {
    loadLessonFromUrl();
  } else if (page === 'quiz') {
    currentSlideIndex = 0;
    loadQuiz();
  } else if (page === 'results') {
    loadResults();
  }
}

document.addEventListener('DOMContentLoaded', initPage);
