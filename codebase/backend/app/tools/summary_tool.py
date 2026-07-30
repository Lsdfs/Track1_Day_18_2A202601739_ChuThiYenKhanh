import unicodedata
from app.schemas.chat import SummaryPayload, SummarySection


def _normalize(text: str) -> str:
    text = unicodedata.normalize("NFD", text.lower())
    return "".join(c for c in text if unicodedata.category(c) != "Mn")


def is_summary_request(message: str) -> bool:
    normalized = _normalize(message)
    return "tom tat" in normalized or "summary" in normalized


def build_hardcoded_summary() -> SummaryPayload:
    sections = [
        ("Chọn bài toán trước khi chọn công nghệ", "Xác định actor, workflow, bottleneck và tác động đo lường được trước khi chọn model."),
        ("Không phải tác vụ nào cũng cần Agent", "Dùng rule cho logic ổn định, LLM cho ngôn ngữ và Agent cho workflow động nhiều bước."),
        ("Ưu tiên giải pháp đơn giản nhất", "Chỉ tăng độ phức tạp khi giá trị bổ sung lớn hơn chi phí và rủi ro."),
        ("AI Product Lifecycle", "Problem Scoping, Data Readiness, Baseline, Build & Eval, Deploy Controls, Monitor & Iterate."),
        ("Metric, baseline và eval", "Metric đo giá trị, baseline tạo mốc so sánh và eval xác minh chất lượng."),
        ("Cấu tạo AI System", "Model, Context, Planning và Tools được điều phối bởi system logic."),
        ("Problem Statement", "Cần actor, workflow, bottleneck, impact, success metric và operational boundary."),
        ("Readiness và Feasibility", "Kiểm tra data, latency, chi phí, logging, rollback và owner of failure."),
    ]
    return SummaryPayload(
        greeting="Dưới đây là bản tóm tắt bài giảng “Xác định bài toán kinh doanh cho AI”:",
        overview="Bài học hướng dẫn chọn đúng bài toán, mức tự động hóa và các gate kỹ thuật.",
        sections=[SummarySection(title=t, content=c) for t, c in sections],
        key_takeaways=[
            "Đúng kiến trúc quan trọng hơn model mạnh.",
            "Bắt đầu từ rule hoặc workflow.",
            "AI Product Lifecycle là một chuỗi gate.",
            "Problem Statement phải dẫn tới metric và eval.",
            "Feasibility gồm kỹ thuật, vận hành và kinh doanh.",
        ],
    )
