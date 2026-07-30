const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const lessons = require('./data/lessons.json');

app.get('/api/lessons', (req, res) => {
  res.json(lessons);
});

app.get('/api/lessons/:id', (req, res) => {
  const lesson = lessons.find(l => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
});

app.get('/api/lessons/:id/quiz', (req, res) => {
  const lesson = lessons.find(l => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json({ quiz: lesson.quiz });
});

app.post('/api/quiz/submit', (req, res) => {
  const { answers, lessonId } = req.body;
  const lesson = lessons.find(l => l.id === lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

  let score = 0;
  const results = lesson.quiz.questions.map((q, idx) => {
    const isCorrect = answers[idx] === q.correctAnswer;
    if (isCorrect) score++;
    return {
      question: q.question,
      userAnswer: answers[idx],
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation
    };
  });

  const percentage = Math.round((score / lesson.quiz.questions.length) * 100);

  res.json({
    score,
    total: lesson.quiz.questions.length,
    percentage,
    results,
    passed: percentage >= lesson.quiz.passingScore
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
