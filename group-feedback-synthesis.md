# Group Feedback Synthesis

> **Cảnh báo evidence:** Ba tester và pain nền có trong interview records. Repository chưa có ghi chép hoặc recording xác nhận họ đã dùng các prototype A/B/C. Vì vậy toàn bộ prototype observation và synthesis dưới đây là **GIẢ ĐỊNH CẦN KIỂM CHỨNG**, không phải kết quả validation.

## Nguồn evidence

| Phiên | Facilitator | Tester | Đã test A/B/C | Feedback Note | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| 1 | Chu Thị Yến Khanh | 001 | Giả định Có | [Tester 001](prototype-feedback-note.md) | Cần thay bằng observation thật |
| 2 | Trần Tuấn Trung | 002 | Giả định Có | [Tester 002](feedback/feedback-note-tester-002.md) | Cần thay bằng observation thật |
| 3 | Nguyễn Trọng Đức | 003 | Giả định Có | [Tester 003](feedback/feedback-note-tester-003.md) | Cần thay bằng observation thật |

## Quy trình test chung giả định

- Mỗi tester thực hiện cùng một task trên cả A/B/C với cùng slide, highlight, ghi chú và desired outcome.
- Thứ tự được xoay vòng: Tester 001 dùng A→B→C; Tester 002 dùng B→C→A; Tester 003 dùng C→A→B.
- Facilitator chỉ đọc task, không giải thích cơ chế; ghi lại hành vi, chỗ dừng, lần mở nguồn, phần user sửa/bỏ và lựa chọn sau test.
- Không hỏi “Bạn có thích không?” trước khi tester hoàn thành; ưu tiên câu hỏi “Bạn đang cố làm gì?” và “Điều gì khiến bạn chọn bước đó?”.

## Pattern dự kiến qua ba phiên

| Pattern giả định | Cơ sở để hình thành giả định | Tester liên quan | Cần xác nhận bằng |
| --- | --- | --- | --- |
| Traceability về slide nguồn giúp khôi phục ngữ cảnh | Cả ba interview đều cho thấy phải tìm/đọc lại nội dung; Option A/C gắn trực tiếp với nguồn | 001, 002, 003 | Số lần tester mở nguồn và khả năng tìm đúng đoạn |
| User cần sửa hoặc từ chối nội dung AI | Câu hỏi, lý do và nhóm chủ đề đều có thể lệch ý định | 001, 002, 003 | Hành vi edit/reject/undo thực tế |
| Không có một mức AI chủ động phù hợp cho mọi user | 001 cần tìm nhanh, 002 cần làm rõ mục đích, 003 quen dùng AI tổng hợp | 001, 002, 003 | Lý do lựa chọn và hành vi trên từng option |
| Giao diện càng tổng hợp càng có nguy cơ che mất dữ liệu gốc | B/C tạo lớp diễn giải trên highlight/ghi chú | 002, 003 | Tester có đối chiếu nguồn hay tin ngay đầu ra AI |

## Khác biệt dự kiến giữa tester

| Tester | Option có khả năng phù hợp | Lý do dựa trên evidence Day 17 | Giả định cần kiểm chứng |
| --- | --- | --- | --- |
| 001 | A – Context Capture | Pain chính là mất ngữ cảnh và phải đọc slide từ đầu | Context card giúp tìm đúng đoạn với ít thao tác hơn |
| 002 | B – Question Inbox | Không nhớ ghi chú thuộc nội dung nào/dùng làm gì | Câu hỏi và trạng thái làm rõ mục đích của ghi chú |
| 003 | C – Review Map | Đang dùng AI tổng hợp theo chủ đề và tạo câu hỏi | Map có nguồn giúp giữ lợi ích tổng hợp nhưng tăng kiểm soát |

## So sánh A/B/C – giả định

| Option | Điều có khả năng hoạt động tốt | Friction/rủi ro cần test | Evidence còn thiếu |
| --- | --- | --- | --- |
| A – Context Capture | Khôi phục ngữ cảnh trực tiếp, dễ đối chiếu nguồn | Nhiều thao tác lúc capture; card dài/lặp | Thời gian tìm lại, tỷ lệ xác nhận/sửa/bỏ card |
| B – Question Inbox | Biến ghi chú mơ hồ thành mục cần xử lý | Tạo thêm backlog; AI có thể diễn đạt sai câu hỏi | User có duy trì trạng thái và quay lại inbox không |
| C – Review Map | Tạo tổng quan và giảm nhu cầu đọc lại toàn bộ slide | Quá tải, nhóm sai, overtrust | User có hiểu uncertainty và kiểm tra liên kết nguồn không |

## Group Next Change – đề xuất tạm thời

- **Thay đổi:** Dùng Context Capture làm luồng cơ sở nhưng chỉ hiển thị ba thành phần mặc định: đoạn nguồn, lý do và hành động tiếp theo. Thêm hai hành động tùy chọn “Đưa vào Question Inbox” và “Xem trong Review Map”.
- **Lý do:** Đây là thay đổi ít rủi ro nhất vì giữ traceability và quyền xác nhận của user, đồng thời không buộc mọi người dùng workflow B/C.
- **Cách test lại:** Đo thời gian hoàn thành task, số lần cần facilitator giải thích, số lần sửa/bỏ nội dung AI và khả năng tìm lại đúng slide sau một khoảng nghỉ.
- **Điều kiện để chấp nhận:** Tester tự hoàn thành task, hiểu phần nào do AI tạo, mở được nguồn và sửa/hoàn tác mà không cần facilitator.

## Still Unproven

- Ba tester có thực sự dùng được cả A/B/C mà không cần giải thích hay không.
- Context Capture có giảm thời gian tìm lại nội dung so với cách đọc slide hiện tại hay không.
- Việc yêu cầu xác nhận có làm gián đoạn ghi chú trong lớp hay không.
- User có duy trì Question Inbox và Review Map qua nhiều buổi học hay không.
- AI phân nhóm/đặt câu hỏi chính xác đến mức nào trên dữ liệu học thật.
- Lựa chọn dự kiến A/B/C của từng tester có đúng sau khi test thực tế hay không.

## Việc phải làm trước khi nộp như evidence thật

- [ ] Xác nhận ba tester đều ngoài nhóm và đã consent.
- [ ] Thay ngày/giờ, thứ tự test và observation giả định bằng ghi chép thực tế.
- [ ] Đính kèm recording/link nếu có quyền chia sẻ.
- [ ] Chỉ giữ pattern được ít nhất một observation thực tế hỗ trợ.
- [ ] Cập nhật Group Next Change từ kết quả thật, không từ mức độ “thích” option.
