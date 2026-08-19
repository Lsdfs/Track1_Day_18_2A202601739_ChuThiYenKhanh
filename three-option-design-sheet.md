# Three-option Design Sheet

## Shared test context

- **Target user:** Học viên có thói quen highlight hoặc ghi chú các nội dung quan trọng/chưa hiểu trong bài giảng.
- **Situation:** Sau một buổi học có nhiều slide, học viên quay lại ôn nhưng ghi chú ngắn và highlight đã mất ngữ cảnh.
- **Task:** Tìm lại một điểm chưa hiểu, khôi phục lý do đã đánh dấu và đưa điểm đó vào kế hoạch ôn tập tiếp theo.
- **Shared content/input:** Cùng một bộ slide mẫu, ba highlight, hai ghi chú ngắn và một điểm chưa hiểu; nội dung và thứ tự task giống nhau ở A/B/C.
- **Desired outcome:** Học viên xác định đúng phần cần xem lại, hiểu vì sao nó được đánh dấu và chọn được hành động tiếp theo mà không phải đọc lại toàn bộ slide.
- **Hypothesis Problem:** Khi học viên đánh dấu nội dung chưa hiểu và quay lại ôn tập, họ khó nhận biết phần cần xem lại và khôi phục ngữ cảnh vì highlight/ghi chú ngắn không nêu rõ lý do được tạo ra và dễ bị bỏ quên.

> Giữ nguyên toàn bộ shared test context khi test A/B/C; chỉ thay đổi mechanism hoặc cách chia việc giữa user và AI.

## Option A – Context Capture

- **Core mechanism:** Mỗi highlight trở thành một context card gồm đoạn trước/sau, vị trí slide, lý do đánh dấu và hành động tiếp theo.
- **User thực hiện:** Highlight nội dung, chọn hoặc tự viết lý do, kiểm tra context card trước khi lưu và chọn việc cần làm khi ôn lại.
- **AI thực hiện:** Lấy vùng nội dung xung quanh highlight, đề xuất nhãn lý do và tạo tóm tắt ngắn; không tự lưu khi chưa được xác nhận.
- **Expectation – user cần hiểu gì trước khi dùng:** Nội dung do AI đề xuất chỉ là bản nháp dựa trên phần slide hiển thị; người học cần xác nhận ngữ cảnh và lý do.
- **Agency – user có thể chọn/sửa/bỏ qua gì:** Sửa tóm tắt, thay lý do, mở rộng/thu hẹp ngữ cảnh, bỏ đề xuất AI hoặc lưu nguyên văn.
- **Evidence & uncertainty – hệ thống cho biết căn cứ và điểm chưa chắc thế nào:** Card hiển thị số slide và đoạn nguồn; đề xuất không chắc được gắn nhãn “Cần bạn kiểm tra”.
- **Recovery – khi AI sai hoặc kết quả không phù hợp, user xử lý thế nào:** Mở slide gốc tại đúng vị trí, khôi phục nội dung nguyên văn và tạo lại card thủ công.
- **Điểm khác biệt có chủ đích:** Ngữ cảnh được ghi ngay tại thời điểm highlight; AI hỗ trợ nhưng user xác nhận từng card.

## Option B – Question Inbox

- **Core mechanism:** Điểm chưa hiểu được chuyển thành một câu hỏi trong inbox thay vì chỉ lưu dưới dạng highlight; mỗi câu hỏi có trạng thái Chưa xử lý/Đang tìm hiểu/Đã hiểu.
- **User thực hiện:** Viết hoặc xác nhận câu hỏi, chọn mức ưu tiên, xem nguồn liên quan và tự đánh dấu trạng thái sau khi xử lý.
- **AI thực hiện:** Gợi ý cách diễn đạt câu hỏi từ highlight, gom các câu hỏi trùng chủ đề và đề xuất tài liệu/đoạn slide liên quan.
- **Expectation – user cần hiểu gì trước khi dùng:** AI có thể hiểu sai ý định của highlight; câu hỏi và trạng thái chỉ có giá trị khi người học kiểm tra.
- **Agency – user có thể chọn/sửa/bỏ qua gì:** Viết lại câu hỏi, tách/gộp câu hỏi, từ chối gợi ý nguồn, đổi ưu tiên và tự quyết định khi nào đã hiểu.
- **Evidence & uncertainty – hệ thống cho biết căn cứ và điểm chưa chắc thế nào:** Mỗi gợi ý gắn với slide/ghi chú nguồn; kết quả ngoài slide được phân biệt rõ và ghi trạng thái chưa kiểm chứng.
- **Recovery – khi AI sai hoặc kết quả không phù hợp, user xử lý thế nào:** Khôi phục câu hỏi nguyên bản, bỏ nhóm AI tạo, quay lại highlight gốc và tự thêm nguồn.
- **Điểm khác biệt có chủ đích:** User chủ động quản lý một hàng đợi vấn đề; AI không tổ chức thành note hoàn chỉnh.

## Option C – Review Map

- **Core mechanism:** AI tổ chức toàn bộ highlight, ghi chú và điểm chưa hiểu thành bản đồ ôn tập theo chủ đề, đồng thời đánh dấu các nút còn thiếu ngữ cảnh.
- **User thực hiện:** Xem bản đồ nháp, mở từng nút để đối chiếu nguồn, kéo/thả chỉnh nhóm và chọn các nút cần ôn trước.
- **AI thực hiện:** Phân cụm nội dung, đặt tên chủ đề, nối các nội dung liên quan và gợi ý điểm còn thiếu dựa trên bộ slide.
- **Expectation – user cần hiểu gì trước khi dùng:** Bản đồ là cách AI diễn giải mối quan hệ, không phải cấu trúc chính thức của bài học.
- **Agency – user có thể chọn/sửa/bỏ qua gì:** Đổi tên/di chuyển/xóa nút, tắt liên kết AI, xem danh sách nguyên bản và xác nhận từng nhóm.
- **Evidence & uncertainty – hệ thống cho biết căn cứ và điểm chưa chắc thế nào:** Mỗi nút liên kết về slide hoặc ghi chú nguồn; liên kết suy luận dùng nét đứt và nhãn độ chắc chắn.
- **Recovery – khi AI sai hoặc kết quả không phù hợp, user xử lý thế nào:** Chuyển về chế độ danh sách nguyên bản, hoàn tác thay đổi hoặc tạo nhóm thủ công mà không mất dữ liệu nguồn.
- **Điểm khác biệt có chủ đích:** AI chủ động đề xuất cấu trúc toàn cục; user kiểm duyệt bản đồ thay vì xác nhận từng highlight lúc tạo.

## So sánh nhanh

| Tiêu chí | Option A | Option B | Option C |
| --- | --- | --- | --- |
| Mechanism | Context card theo từng highlight | Inbox câu hỏi có trạng thái | Bản đồ ôn tập theo chủ đề |
| Vai trò của user | Xác nhận ngay khi lưu | Chủ động quản lý câu hỏi | Kiểm duyệt cấu trúc tổng thể |
| Vai trò của AI | Bổ sung ngữ cảnh cục bộ | Gợi ý câu hỏi và nguồn | Phân cụm và tạo liên kết |
| Human control | Sửa/bỏ từng đề xuất trước khi lưu | Quyết định câu hỏi, ưu tiên và trạng thái | Chỉnh nhóm, liên kết và quay về dữ liệu gốc |
| Rủi ro cần quan sát | Làm gián đoạn lúc ghi chú | Tạo thêm việc phải quản lý | Sơ đồ phức tạp hoặc khiến user tin quá mức |
