# Track 1 – Day 18: Multiple Prototypes & Human–AI Design

## 1. Thông tin cá nhân và nhóm

- **MHV:** 2A202601739
- **Họ và tên:** Chu Thị Yến Khanh
- **Tên nhóm:** Nhóm Case 2
- **Thành viên:** Chu Thị Yến Khanh; Trần Tuấn Trung; Nguyễn Trọng Đức
- **Case:** Case B – AI Notes: Personal Learning Notes

## 2. Hypothesis Problem

Khi học viên đánh dấu nội dung chưa hiểu trong quá trình học và quay lại ôn tập, họ khó nhận biết phần cần xem lại và khôi phục ngữ cảnh vì highlight/ghi chú ngắn không nêu rõ lý do được tạo ra và dễ bị bỏ quên. Điều này khiến điểm chưa hiểu không được xử lý, làm gián đoạn việc ôn tập và duy trì lỗ hổng kiến thức.

- **Observation nối tiếp từ Day 17:** Người tham gia 001 phải quay lại slide gốc và đọc lại từ đầu để tìm phần đã bỏ sót vì ghi chú bị mất ngữ cảnh. Người tham gia 002 không còn nhớ ghi chú thuộc nội dung nào hoặc dùng để làm gì. Người tham gia 003 thường không quay lại các highlight và phải đọc lại toàn bộ slide rồi dùng AI tạo ghi chú mới.
- **Điều chưa biết cần validation:** Chưa biết cách thể hiện ngữ cảnh nào giúp học viên nhận ra nhanh nhất lý do tạo ghi chú; mức chủ động phù hợp giữa học viên và AI; và liệu người dùng có tin, kiểm tra và sửa phần AI tổ chức hay không.

## 3. Three Solution Options

Xem [Three-option Design Sheet](three-option-design-sheet.md).

| Option | Mô tả ngắn | Repository và demo |
| --- | --- | --- |
| A – Context Capture | Lưu highlight cùng ngữ cảnh và yêu cầu người học xác nhận lý do. | [Thêm link](prototype-link.md#option-a-context-capture) |
| B – Question Inbox | Chuyển điểm chưa hiểu thành hàng đợi câu hỏi để người học chủ động xử lý. | [Thêm link](prototype-link.md#option-b-question-inbox) |
| C – Review Map | AI nhóm dấu vết học tập thành bản đồ ôn tập có liên kết về nguồn. | [Thêm link](prototype-link.md#option-c-review-map) |

## 4. Đóng góp của tôi trong nhóm

- **Option/phần việc phụ trách:** **Giả định cần nhóm xác nhận:** Chu Thị Yến Khanh phụ trách Option A – Context Capture, chuẩn bị shared test context và phối hợp rà soát độ khác biệt của A/B/C.
- **Shared context/content đã chuẩn bị:** Problem Hypothesis, ba observation từ Day 17, một task ôn tập chung và bộ input gồm slide, highlight, ghi chú ngắn và điểm chưa hiểu.
- **Quyết định Human–AI đã tham gia:** Giữ quyền xác nhận, chỉnh sửa, bỏ qua và quay về nguồn cho người học; AI chỉ hỗ trợ lấy ngữ cảnh, nhóm nội dung hoặc đề xuất bước tiếp theo.
- **Facilitation/observation/tổng hợp feedback:** **Giả định cần xác nhận:** Chu Thị Yến Khanh facilitate Tester 001, ghi nhận so sánh A/B/C và đóng góp pattern về traceability, quyền sửa nội dung AI và friction khi context card có quá nhiều trường. Observation prototype hiện vẫn được đánh dấu giả định trong Feedback Note.

## 5. Prototype Feedback

- **Feedback Note cá nhân – Tester 001:** [prototype-feedback-note.md](prototype-feedback-note.md)
- **Feedback Note – Tester 002:** [feedback/feedback-note-tester-002.md](feedback/feedback-note-tester-002.md)
- **Feedback Note – Tester 003:** [feedback/feedback-note-tester-003.md](feedback/feedback-note-tester-003.md)
- **Group Feedback Synthesis:** [group-feedback-synthesis.md](group-feedback-synthesis.md)
- **Tình trạng evidence:** Bối cảnh/pain của ba tester có evidence Day 17; observation sử dụng prototype hiện là giả định cần thay bằng ghi chép test thật.
- **Next Change tạm thời:** Giữ Context Capture làm luồng cơ sở, rút card còn đoạn nguồn, lý do và hành động tiếp theo; Question Inbox và Review Map trở thành bước tùy chọn.
- **Still Unproven:** Khả năng tự dùng A/B/C, mức giảm thời gian tìm lại, ảnh hưởng của bước xác nhận và mức độ user kiểm tra đầu ra AI.

## 6. AI Support Log

Xem [ai-support-log.md](ai-support-log.md).

## Tệp đính kèm

- [Three-option Design Sheet](three-option-design-sheet.md)
- [Prototype links A/B/C](prototype-link.md)
- [Prototype Feedback Note cá nhân](prototype-feedback-note.md)
- [Feedback Note – Tester 002](feedback/feedback-note-tester-002.md)
- [Feedback Note – Tester 003](feedback/feedback-note-tester-003.md)
- [Group Feedback Synthesis](group-feedback-synthesis.md)
- [AI Support Log](ai-support-log.md)
- [Interview notes từ Day 17](interview/notes.md)
- [Recording links từ Day 17](interview/recording-link.md)

## Checklist trước khi nộp

- [ ] README có đủ sáu phần và ghi rõ đóng góp cá nhân.
- [ ] Hypothesis Problem nối với ít nhất một observation Day 17 và nêu điều chưa biết.
- [ ] A/B/C giải cùng problem và task nhưng khác mechanism hoặc cách chia việc user–AI.
- [ ] Mỗi option nêu expectation, agency, evidence/uncertainty và recovery.
- [ ] Ba prototype dùng cùng user, situation, task, content và desired outcome.
- [ ] Một tester ngoài nhóm tự dùng được cả A/B/C mà không cần facilitator giải thích.
- [ ] Nhóm có ba Feedback Notes từ ba phiên test.
- [ ] Group Feedback Synthesis tách pattern, khác biệt, Next Change và Still Unproven.
- [ ] Tất cả link mở được với giảng viên/TA.
- [ ] AI Support Log phản ánh đúng phần AI hỗ trợ và phần người nộp tự kiểm soát.
