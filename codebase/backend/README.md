# Python backend

```powershell
cd codebase\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -m uvicorn app.main:app --reload --port 8000
```

API docs: `http://127.0.0.1:8000/docs`.

Không có `GEMINI_API_KEY`, API vẫn chạy bằng dữ liệu hardcoded. Không commit `.env`.

## Luồng tóm tắt

1. Frontend gửi `lesson_id` và `message` tới `POST /api/chat`.
2. Gemini đọc system prompt và gọi tool `get_current_lesson_content`.
3. Tool tra `data/lessons.json`, tìm đúng PDF trong `data/` và trích text.
4. Gemini tạo summary có cấu trúc dựa trên kết quả tool.
5. Backend tạo PDF trong `data/generated/summaries/`.
6. API trả `lesson-summary` cùng `download_url`.

Đăng ký slide mới bằng cách chép PDF vào `data/` và thêm một record trong `data/lessons.json`.
