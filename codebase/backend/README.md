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
