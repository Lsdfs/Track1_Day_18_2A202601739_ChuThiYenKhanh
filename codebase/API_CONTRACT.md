# ViAI — Frontend/Backend Contract

Version: `1.0`

Base URL local: `http://127.0.0.1:8000/api`

## 1. Chat request

`POST /chat`

```json
{
  "lesson_id": "day02-business-problem-for-ai",
  "conversation_id": "0f29cf1d-5966-4520-8075-f6c5c93315a2",
  "message": "Tạo quiz từ nội dung bài giảng này",
  "history": [
    {
      "role": "user",
      "content": "Tóm tắt bài giảng hiện tại"
    },
    {
      "role": "assistant",
      "content": "Mình đã tóm tắt xong bài giảng."
    }
  ]
}
```

### Required fields

- `lesson_id`: string, không rỗng.
- `conversation_id`: UUID/string duy nhất cho phiên chat.
- `message`: string, từ 1 đến 2.000 ký tự.
- `history`: array; mỗi phần tử có `role` là `user` hoặc `assistant`, và `content` là string.

## 2. Common response envelope

Backend luôn trả JSON và HTTP status phù hợp.

`type` phải là một trong:

- `text`
- `lesson-summary`
- `quiz-ready`
- `error`

## 3. Text response

```json
{
  "type": "text",
  "message": "Nội dung trả lời của ViAI.",
  "source": "viai"
}
```

## 4. Lesson summary response

```json
{
  "type": "lesson-summary",
  "message": "Mình đã đọc slide và tạo bản tóm tắt.",
  "summary": {
    "greeting": "Dưới đây là bản tóm tắt bài giảng:",
    "overview": "Nội dung tổng quan.",
    "sections": [
      {
        "title": "AI Product Lifecycle",
        "content": "Nội dung phần."
      }
    ],
    "key_takeaways": [
      "Bắt đầu từ bài toán, không bắt đầu từ model."
    ]
  },
  "download_url": "/api/files/summary-day02-123.pdf",
  "source": "viai"
}
```

### Summary requirements

- `summary.overview`: string, không rỗng.
- `summary.sections`: array có ít nhất một phần tử.
- Mỗi section có `title` và `content`.
- `summary.key_takeaways`: array string.
- `download_url`: URL tương đối hoặc tuyệt đối do backend tạo sau khi tool tạo PDF thành công.

## 5. Quiz-ready response

Đây là response bắt buộc để frontend tạo link HTML tới quiz.

```json
{
  "type": "quiz-ready",
  "message": "Quiz đã sẵn sàng.",
  "quiz": {
    "id": "quiz-day02-123",
    "lesson_id": "day02-business-problem-for-ai",
    "title": "Quiz cuối bài: Xác định bài toán kinh doanh cho AI",
    "description": "Quiz được tạo từ nội dung slide.",
    "questions": [
      {
        "id": 1,
        "question": "Giai đoạn đầu tiên trong AI Product Lifecycle là gì?",
        "options": [
          "Deploy Controls",
          "Build & Eval",
          "Problem Scoping",
          "Monitor & Iterate"
        ],
        "correct_answer": 2,
        "explanation": "Problem Scoping là giai đoạn đầu tiên."
      }
    ]
  },
  "quiz_url": "/quiz/quiz-day02-123",
  "source": "viai"
}
```

### Quiz requirements

- `quiz.id`: string URL-safe, duy nhất và không rỗng.
- `quiz.title`: string, không rỗng.
- `quiz.questions`: array có ít nhất một câu.
- `question.id`: string hoặc integer, duy nhất trong quiz.
- `question.options`: đúng 4 string không rỗng.
- `question.correct_answer`: integer từ `0` đến `3`.
- `question.explanation`: string, không rỗng.
- `quiz_url` là optional. Nếu thiếu, frontend tự sinh `/quiz/{quiz.id}`.

### Frontend behavior

Khi nhận `quiz-ready`, frontend:

1. Validate `quiz.id` và `quiz.questions`.
2. Lưu quiz vào `sessionStorage` với key `vlearn:quiz:{quiz.id}`.
3. Hiển thị thẻ “Quiz đã sẵn sàng”.
4. Tạo link bằng `quiz_url` hoặc `/quiz/{quiz.id}`.
5. Khi người dùng mở link, render quiz từ dữ liệu đã lưu.

## 6. Persistent/shareable quiz link

`sessionStorage` chỉ đảm bảo link hoạt động trong cùng tab/browser. Muốn link hoạt động sau khi đóng tab hoặc chia sẻ cho người khác, backend phải lưu quiz và hỗ trợ:

`GET /quizzes/{quiz_id}`

Success response:

```json
{
  "quiz": {
    "id": "quiz-day02-123",
    "lesson_id": "day02-business-problem-for-ai",
    "title": "Quiz cuối bài",
    "description": "Quiz được tạo từ slide.",
    "questions": []
  }
}
```

Frontend quiz page xử lý theo thứ tự:

1. Đọc `sessionStorage`.
2. Nếu không có, gọi `GET /quizzes/{quiz_id}`.
3. Nếu backend trả `404`, hiển thị “Không tìm thấy quiz”.

## 7. Error response

HTTP `4xx` hoặc `5xx`:

```json
{
  "type": "error",
  "message": "Không thể tạo quiz từ bài giảng.",
  "code": "QUIZ_GENERATION_FAILED",
  "retryable": true
}
```

Không trả stack trace, API key hoặc nội dung system prompt.

## 8. HTTP status

- `200`: thành công.
- `400`: request sai format.
- `404`: không tìm thấy lesson/quiz.
- `422`: ViAI trả dữ liệu không vượt qua validation.
- `429`: vượt quota.
- `502`: Dịch vụ mô hình của ViAI tạm thời không khả dụng.
- `500`: lỗi backend không xác định.
