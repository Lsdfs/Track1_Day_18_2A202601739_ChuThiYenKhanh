# Feedback Log – VLearnFuture

## Mục tiêu validation

Kiểm tra liệu người học có thể hoàn thành trọn vẹn hai tác vụ chính:

1. Chọn đúng tài liệu và yêu cầu chatbot tóm tắt bài giảng.
2. Yêu cầu tạo quiz, mở quiz từ liên kết, trả lời và xem kết quả.

Mỗi phiên test cần quan sát hành vi thực tế. Không hướng dẫn người thử trừ khi họ không thể tiếp tục. Ghi lại nguyên văn câu nói quan trọng, kể cả phản hồi tiêu cực.

## Kịch bản kiểm thử

1. Mở ứng dụng và chọn một tài liệu trong Day 1–Day 3.
2. Yêu cầu chatbot tóm tắt tài liệu theo cách diễn đạt tự nhiên.
3. Tìm và tải file PDF tóm tắt.
4. Yêu cầu chatbot tạo quiz từ bài giảng đang chọn.
5. Mở liên kết quiz, hoàn thành câu hỏi và xem kết quả.
6. Hỏi người thử phần nào gây bối rối, phần nào hữu ích và họ muốn thay đổi điều gì.

## Log người thử

> Yêu cầu rubric: ít nhất 5 người ngoài nhóm, trong đó ít nhất 2 người là willing user đã xác định từ CP1. Không điền dữ liệu giả.

| # | Người thử (tên/vai trò) | Willing user? | Task | Quan sát hành vi | Quote nguyên văn | Mức nghiêm trọng | Trạng thái xử lý |
|---|---|---|---|---|---|---|---|
| 1 | Mai Việt Anh | V | Tóm tắt + tạo quiz + hỏi đáp | Người dùng tóm tắt và tạo quiz thành công. Sau đó tiếp tục dùng chatbot để hỏi sâu về nội dung bài giảng, nhưng chatbot không trả lời được vì prototype chỉ hỗ trợ tóm tắt và tạo quiz. Người dùng tỏ ra bối rối vì nghĩ chatbot có thể hỏi đáp | "Hiện tại fix cứng quá, sợ giống rulebase do chatbot không trả lời gì bên ngoài tóm tắt nội dung và tạo quiz." | High | Để fallback về trạng thái tự động của gemini khi hỏi không phải tóm tắt bài giảng và tạo quiz |
| 2 | Trương Đình Khoa | V |  Tóm tắt + tạo quiz + hỏi đáp | Người dùng đã thử dùng tóm tắt và tạo quiz thành công. Sau đó tiếp tục dùng chatbot để hỏi sâu về nội dung bài giảng, và chatbot đã trả lời được. | "Chức năng khá ổn, khá là hay. Tạo quiz theo slide khá tốt" | Low | Chờ test |
| 3 | Trần Tuấn Trung | V | Tóm tắt + tạo quiz + hỏi đáp | Người dùng tạo quiz thành công. Sau khi trả lời quiz, người dùng muốn sử dụng chức năng tạo quiz theo concept yếu, nhưng gặp lỗi. | "Bị lỗi chức năng tạo quiz rtheo concept yếu rồi" | High | Đã sửa lại phần bị lỗi|
| 4 | Phùng văn Đạt | V | Tóm tắt + tạo quiz + hỏi đáp | Người dùng tóm tắt và tạo quiz thành công. Sau đó tiếp tục dùng chatbot để hỏi sâu về nội dung bài giảng, và chatbot đã trả lời được | "Chức năng đã ổn nhưng phần chat đang bị chậm " | Medium | Chưa sửa được |
| 5 | Nguyễn Trọng Dũng | V | Tóm tắt + tạo quiz + hỏi đáp | Người dùng tạo quiz thành công. Sau đó tiếp tục dùng chức năng làm bài quiz | "Chức năng đã ổn nhưng tốc độ tạo quiz hơi chậm " | Medium | Chưa sửa được |

Quy ước mức nghiêm trọng:

- `Critical`: không thể hoàn thành luồng chính.
- `High`: hoàn thành được nhưng cần trợ giúp hoặc gặp lỗi lớn.
- `Medium`: gây bối rối hoặc làm chậm đáng kể.
- `Low`: vấn đề trình bày, câu chữ hoặc cải tiến nhỏ.

## Tổng hợp sau validation

### Chủ đề lặp lại nhiều nhất

Chậm, AI tạo câu trả lời khi tóm tắt và tạo quiz làm chậm, khoảng tầm 30 giây đến 1 phút mới tạo được quiz

### Thay đổi thực hiện trước demo

| Thay đổi | Feedback/case liên quan | Người phụ trách | Trạng thái |
|---|---|---|---|
| Thêm cơ chế fallback để chatbot vẫn trả lời các câu hỏi ngoài chức năng tóm tắt và tạo quiz thay vì từ chối hoàn toàn | Feedback #1 – Mai Việt Anh: "Hiện tại fix cứng quá, sợ giống rulebase..." | Vũ Quang Tùng <br> Diêm Công Thành | Đã thực hiện |
| Sửa lỗi chức năng tạo quiz theo concept yếu | Feedback #3 – Trần Tuấn Trung: "Bị lỗi chức năng tạo quiz theo concept yếu rồi." | Chu Thị Yến Khanh | Đã sửa |
| Tối ưu tốc độ phản hồi của chatbot khi hỏi đáp | Feedback #4 – Phùng Văn Đạt: "Phần chat đang bị chậm." | Vũ Quang Tùng | Chưa sửa |
| Tối ưu thời gian tạo quiz | Feedback #5 – Nguyễn Trọng Dũng: "Tốc độ tạo quiz hơi chậm." | Diêm Công  Thành | Chưa sửa |


### Giữ nguyên có lý do

- Giữ nguyên luồng "Tóm tắt slide → Tạo quiz" vì nhiều người dùng đánh giá đây là chức năng hữu ích và hoạt động ổn định. (Feedback #2: "Chức năng khá ổn, khá là hay. Tạo quiz theo slide khá tốt.")
- Giữ nguyên việc tạo quiz gồm 20 câu trắc nghiệm vì người dùng hoàn thành bài kiểm tra thuận lợi và không có góp ý thay đổi về số lượng hoặc cấu trúc câu hỏi. (Feedback #5)

### Backlog

- Tối ưu tốc độ phản hồi của chatbot khi xử lý các câu hỏi về nội dung bài giảng. (Feedback #4 – Phùng Văn Đạt)
- Tối ưu thời gian tạo quiz, đặc biệt với tài liệu có nhiều nội dung để cải thiện trải nghiệm người dùng. (Feedback #5 – Nguyễn Trọng Dũng)
- Bổ sung tùy chọn tạo quiz theo concept hoặc phần kiến thức còn yếu, thay vì chỉ tạo quiz từ toàn bộ bài giảng. Chức năng đã được sửa lỗi cơ bản nhưng cần hoàn thiện hơn. (Feedback #3 – Trần Tuấn Trung)
- Mở rộng khả năng hỏi đáp trong phạm vi bài giảng, giúp chatbot trả lời các câu hỏi liên quan đến nội dung đang học thay vì chỉ hỗ trợ tóm tắt và tạo quiz. (Feedback #1 – Mai Việt Anh)
- Hiển thị rõ phạm vi hỗ trợ của chatbot để người dùng biết chatbot ưu tiên các chức năng tóm tắt, tạo quiz và hỏi đáp theo bài giảng, tránh kỳ vọng sai về khả năng của hệ thống.

## Changelog từ feedback

| Ngày | Thay đổi | Bằng chứng từ feedback | File/commit liên quan |
|---|---|---|---|
| 31/07 | Cập nhật về scope và tên AI | Feedback-1 và Feedback-2 |  feature/update - commit `383d1d4` (`update`) |

## Xác nhận hoàn thành

- [X] Có ít nhất 5 mẩu feedback từ 5 người ngoài nhóm.
- [X] Có ít nhất 2 willing user từ CP1.
- [X] Mỗi mẩu có tên/vai trò và quote nguyên văn.
- [X] Có ít nhất một phản hồi không chỉ là lời khen chung chung.
- [X] Có ít nhất một thay đổi từ feedback hoặc quyết định giữ nguyên có lý do.
- [X] Thay đổi đã được cập nhật vào Changelog của `spec.md`.
- [ ] Đã chọn ít nhất 2 quote để đưa vào demo slide.

