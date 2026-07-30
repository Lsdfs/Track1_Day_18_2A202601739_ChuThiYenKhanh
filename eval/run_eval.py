"""Run the VLearn Tutor golden set against the local FastAPI backend."""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path
from typing import Any


EVAL_DIR = Path(__file__).resolve().parent
DEFAULT_SET = EVAL_DIR / "golden-set-20.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run VLearn Tutor evaluation cases.")
    parser.add_argument("--base-url", default="http://127.0.0.1:8001/api")
    parser.add_argument("--set", dest="set_path", type=Path, default=DEFAULT_SET)
    parser.add_argument("--case", action="append", help="Run one or more case IDs, e.g. --case SUM-01.")
    parser.add_argument("--category", help="Run categories beginning with this value, e.g. summary or quiz.")
    parser.add_argument("--limit", type=int, help="Run only the first N cases after filtering.")
    parser.add_argument("--delay", type=float, default=1.5, help="Delay between cases in seconds.")
    parser.add_argument("--timeout", type=float, default=240, help="HTTP timeout per case.")
    parser.add_argument("--list", action="store_true", help="List matching cases without calling the API.")
    return parser.parse_args()


def select_cases(all_cases: list[dict], args: argparse.Namespace) -> list[dict]:
    selected = all_cases
    if args.case:
        requested = {case_id.upper() for case_id in args.case}
        selected = [case for case in selected if case["id"].upper() in requested]
    if args.category:
        prefix = args.category.lower()
        selected = [case for case in selected if case["category"].lower().startswith(prefix)]
    if args.limit is not None:
        selected = selected[: max(args.limit, 0)]
    return selected


def request_chat(base_url: str, case: dict, timeout: float) -> tuple[int, dict, float]:
    payload = {
        "lesson_id": case["lesson_id"],
        "conversation_id": f"eval-{case['id'].lower()}",
        "message": case["message"],
        "history": case.get("history", []),
    }
    request = urllib.request.Request(
        f"{base_url.rstrip('/')}/chat",
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    started = time.perf_counter()
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            body = json.loads(response.read().decode("utf-8"))
            return response.status, body, round(time.perf_counter() - started, 3)
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8", errors="replace")
        try:
            body = json.loads(raw)
        except json.JSONDecodeError:
            body = {"detail": raw}
        return error.code, body, round(time.perf_counter() - started, 3)


def dotted_get(payload: dict, path: str) -> Any:
    value: Any = payload
    for part in path.split("."):
        if not isinstance(value, dict) or part not in value:
            return None
        value = value[part]
    return value


def evaluate(case: dict, status: int, body: dict) -> tuple[bool, list[str]]:
    failures: list[str] = []
    if status != case["expected_status"]:
        failures.append(f"status expected {case['expected_status']}, got {status}")

    expected_type = case.get("expected_type")
    if expected_type and body.get("type") != expected_type:
        failures.append(f"type expected {expected_type!r}, got {body.get('type')!r}")

    for field in case.get("required_fields", []):
        if dotted_get(body, field) in (None, "", []):
            failures.append(f"missing required field {field}")

    text = json.dumps(body, ensure_ascii=False).lower()
    include_any = [str(item).lower() for item in case.get("must_include_any", [])]
    if include_any and not any(item in text for item in include_any):
        failures.append(f"none of must_include_any found: {case['must_include_any']}")

    for forbidden in case.get("must_not_include", []):
        if str(forbidden).lower() in text:
            failures.append(f"forbidden content found: {forbidden}")

    expected_error = case.get("expected_error_contains")
    if expected_error and expected_error.lower() not in text:
        failures.append(f"error does not contain {expected_error!r}")

    quiz = body.get("quiz") or {}
    questions = quiz.get("questions") or []
    if "expected_question_count" in case and len(questions) != case["expected_question_count"]:
        failures.append(f"question count expected {case['expected_question_count']}, got {len(questions)}")

    option_count = case.get("expected_options_per_question")
    if option_count is not None:
        invalid = [index + 1 for index, question in enumerate(questions) if len(question.get("options", [])) != option_count]
        if invalid:
            failures.append(f"wrong options count at questions {invalid}")

    required_question_fields = case.get("required_question_fields", [])
    for index, question in enumerate(questions, start=1):
        missing = [field for field in required_question_fields if question.get(field) is None]
        if missing:
            failures.append(f"question {index} missing fields {missing}")

    return not failures, failures


def main() -> int:
    args = parse_args()
    golden_set = json.loads(args.set_path.read_text(encoding="utf-8"))
    cases = select_cases(golden_set["cases"], args)
    if not cases:
        print("No matching test cases.", file=sys.stderr)
        return 2

    if args.list:
        for case in cases:
            print(f"{case['id']:8} {case['category']:24} {case['lesson_id']}")
        print(f"\nTotal: {len(cases)}")
        return 0

    results = []
    print(f"Running {len(cases)} case(s) against {args.base_url}\n")
    for index, case in enumerate(cases, start=1):
        try:
            status, body, latency = request_chat(args.base_url, case, args.timeout)
            passed, failures = evaluate(case, status, body)
            result = {
                "id": case["id"],
                "category": case["category"],
                "passed": passed,
                "status": status,
                "latency_seconds": latency,
                "failures": failures,
                "response": body,
            }
        except Exception as error:  # Keep the remaining evaluation running.
            result = {
                "id": case["id"],
                "category": case["category"],
                "passed": False,
                "status": None,
                "latency_seconds": None,
                "failures": [f"{type(error).__name__}: {error}"],
                "response": None,
            }
        results.append(result)
        marker = "PASS" if result["passed"] else "FAIL"
        print(f"[{index:02}/{len(cases):02}] {marker} {case['id']} ({result['latency_seconds']}s)")
        for failure in result["failures"]:
            print(f"       - {failure}")
        if index < len(cases) and args.delay:
            time.sleep(args.delay)

    passed_count = sum(result["passed"] for result in results)
    report = {
        "golden_set": golden_set["name"],
        "version": golden_set["version"],
        "created_at": datetime.now().astimezone().isoformat(timespec="seconds"),
        "base_url": args.base_url,
        "total": len(results),
        "passed": passed_count,
        "failed": len(results) - passed_count,
        "pass_rate": round(passed_count / len(results), 4),
        "quality_bar": golden_set["quality_bar"],
        "results": results,
    }
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    output_path = EVAL_DIR / f"results-{timestamp}.json"
    output_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nResult: {passed_count}/{len(results)} passed ({report['pass_rate']:.0%})")
    print(f"Saved: {output_path}")
    return 0 if passed_count == len(results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
