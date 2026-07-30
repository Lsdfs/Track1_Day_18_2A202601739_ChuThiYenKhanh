from app.tools.summary_tool import build_hardcoded_summary, is_summary_request


def test_summary_intent() -> None:
    assert is_summary_request("Tóm tắt cho tôi bài giảng hiện tại")


def test_summary_content() -> None:
    assert len(build_hardcoded_summary().sections) >= 5
