from app.tools.lesson_summary_tool import get_lesson_content, resolve_lesson


def test_lesson_alias_resolves_to_manifest_file() -> None:
    lesson = resolve_lesson("d2")
    assert lesson["id"] == "day02-business-problem-for-ai"
    assert lesson["pdf_path"].name == "d2-slide-hackathon.pdf"


def test_pdf_tool_extracts_content() -> None:
    lesson = get_lesson_content("day02-business-problem-for-ai")
    assert lesson["page_count"] > 0
    assert "Problem Statement" in lesson["content"]
