import json
from functools import lru_cache
from pathlib import Path

from pypdf import PdfReader


class LessonNotFoundError(LookupError):
    """Raised when a frontend lesson_id is not present in the data manifest."""


DATA_DIR = Path(__file__).resolve().parents[3] / "frontend" / "data"
MANIFEST_PATH = DATA_DIR / "lessons.json"


def _lesson_records() -> list[dict]:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))["lessons"]


def resolve_lesson(lesson_id: str) -> dict:
    """Resolve a frontend lesson ID to a safe PDF path from data/lessons.json."""
    requested = lesson_id.strip().lower()
    for record in _lesson_records():
        accepted = {record["id"].lower(), *(alias.lower() for alias in record.get("aliases", []))}
        if requested not in accepted:
            continue
        pdf_path = (DATA_DIR / record["file"]).resolve()
        if DATA_DIR.resolve() not in pdf_path.parents or not pdf_path.is_file():
            raise LessonNotFoundError(f"PDF is unavailable for lesson_id={lesson_id}")
        return {**record, "pdf_path": pdf_path}
    raise LessonNotFoundError(f"Unknown lesson_id={lesson_id}")


@lru_cache(maxsize=8)
def _extract_pdf(path_string: str) -> dict:
    reader = PdfReader(path_string)
    pages = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        if text:
            pages.append(f"[Trang {page_number}]\n{text}")
    return {"page_count": len(reader.pages), "content": "\n\n".join(pages)}


def get_lesson_content(lesson_id: str) -> dict:
    """Read the slide PDF mapped to lesson_id and return trusted lesson content.

    Args:
        lesson_id: The exact lesson identifier received from the frontend.
    """
    lesson = resolve_lesson(lesson_id)
    extracted = _extract_pdf(str(lesson["pdf_path"]))
    return {
        "lesson_id": lesson["id"],
        "title": lesson["title"],
        "source_file": lesson["file"],
        **extracted,
    }
