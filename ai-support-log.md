# AI Support Log

| Thời điểm/công việc | AI đã hỗ trợ gì | Điểm sai, hời hợt hoặc cần kiểm soát | Tôi đã tự kiểm tra/sửa/quyết định gì | Evidence/đầu ra liên quan |
| --- | --- | --- | --- | --- |
| Tạo khung repository Day 18 | Đối chiếu cấu trúc nộp bài và tạo template sáu tệp | AI chưa có evidence từ các phiên prototype test nên không được tự điền observation, quote hoặc kết luận | Giữ các nội dung chưa có dữ liệu ở dạng TODO và sẽ tự điền từ hoạt động thực tế của nhóm | Các tệp trong repository |
| Chuyển evidence Day 17 thành shared test context | AI tổng hợp Problem Hypothesis và ba interview records thành target user, situation, task và desired outcome dùng chung | AI có thể trộn lời người tham gia với phần diễn giải hoặc khái quát quá mức từ ba cuộc phỏng vấn | Giữ observation gắn với mã người tham gia; đánh dấu các câu hỏi chưa biết là nội dung cần validation | `README.md`, `interview/notes.md`, `three-option-design-sheet.md` |
| Phác thảo ba solution options | AI gợi ý Context Capture, Question Inbox và Review Map với ba mechanism/role split khác nhau | Đây mới là phương án thiết kế, chưa phải lựa chọn đã được tester hoặc nhóm xác nhận | Nhóm cần rà soát, chỉnh prototype và tự quyết định option/phân công; không dùng AI chọn thay tester hoặc nhóm | `three-option-design-sheet.md` |
| Chuẩn bị vị trí link prototype | AI tạo trường repository, live demo, commit và hướng dẫn chạy cho A/B/C | Link và commit thực tế chưa tồn tại nên AI không thể tự điền | Chủ repository sẽ dán link thật và kiểm tra quyền truy cập trước khi nộp | `prototype-link.md` |

## Nguyên tắc sử dụng AI

- Không dùng AI để tạo facts, observation, exact quote hoặc tester feedback.
- Có thể dùng AI để gợi ý mechanism, tạo content fixture, viết component prototype và rà soát độ khác biệt A/B/C; mọi đầu ra phải được người học kiểm tra.
- Kiểm tra lại mọi nội dung AI đề xuất với Design Sheet, prototype và ghi chép test thực tế.
- Ghi rõ quyết định cuối cùng do người học/nhóm thực hiện, đặc biệt với Human–AI design và Next Change.
