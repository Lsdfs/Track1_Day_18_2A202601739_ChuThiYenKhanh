from pathlib import Path
import re
import uuid

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

from app.schemas.chat import SummaryPayload


GENERATED_DIR = Path(__file__).resolve().parents[2] / "data" / "generated" / "summaries"


def _font_name() -> str:
    candidates = [Path("C:/Windows/Fonts/arial.ttf"), Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")]
    for path in candidates:
        if path.is_file():
            if "VLearnUnicode" not in pdfmetrics.getRegisteredFontNames():
                pdfmetrics.registerFont(TTFont("VLearnUnicode", str(path)))
            return "VLearnUnicode"
    return "Helvetica"


def create_summary_pdf(lesson_id: str, lesson_title: str, summary: SummaryPayload) -> dict:
    GENERATED_DIR.mkdir(parents=True, exist_ok=True)
    safe_id = re.sub(r"[^a-zA-Z0-9_-]", "-", lesson_id).strip("-")[:80]
    artifact_id = f"summary-{safe_id}-{uuid.uuid4().hex[:8]}"
    pdf_path = GENERATED_DIR / f"{artifact_id}.pdf"

    font = _font_name()
    defaults = getSampleStyleSheet()
    title_style = ParagraphStyle("VTitle", parent=defaults["Title"], fontName=font)
    heading_style = ParagraphStyle("VHeading", parent=defaults["Heading2"], fontName=font)
    body_style = ParagraphStyle("VBody", parent=defaults["BodyText"], fontName=font, leading=16)
    story = [Paragraph(lesson_title, title_style), Spacer(1, 12), Paragraph(summary.overview, body_style), Spacer(1, 12)]
    for section in summary.sections:
        story.extend([Paragraph(section.title, heading_style), Paragraph(section.content, body_style), Spacer(1, 8)])
    story.append(Paragraph("Điểm cần nhớ", heading_style))
    story.extend(Paragraph(f"• {item}", body_style) for item in summary.key_takeaways)
    SimpleDocTemplate(str(pdf_path), pagesize=A4, title=lesson_title).build(story)
    return {"path": pdf_path, "download_url": f"/api/files/{pdf_path.name}"}
