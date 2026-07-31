# Reflection cá nhân – Chu Thị Yến Khanh

- **Mã học viên:** 2A202601739
- **Nhóm:** K3-Hackathon-VlearnFuture-E403
- **Dự án:** VLearn AI Tutor
- **Vai trò:** Frontend và tích hợp luồng AIr

## Vai trò và phần tôi thực hiện

Trong dự án này, tôi tập trung xây dựng giao diện React mô phỏng VLearn Tutor và kết nối giao diện với backend AI. Luồng chính tôi tham gia gồm:

- Xây dựng giao diện đọc tài liệu theo bố cục VLearn, gồm danh sách học liệu Day 1–Day 3, vùng hiển thị slide và khung chatbot.
- Cho phép người dùng nhập câu hỏi trực tiếp vào chatbot thay vì chỉ hiển thị dữ liệu hardcoded.
- Thiết kế luồng yêu cầu tóm tắt: frontend gửi `lesson_id` và nội dung chat xuống backend, hiển thị bản tóm tắt, sau đó cung cấp liên kết tải PDF.
- Thiết kế luồng tạo quiz: frontend gửi yêu cầu theo tài liệu đang chọn, nhận phản hồi có cấu trúc từ backend, hiển thị liên kết mở quiz, cho phép chọn đáp án và xem kết quả.
- Thống nhất API contract giữa frontend và backend để các dạng phản hồi như `text`, `lesson-summary`, `quiz-ready` và `error` được xử lý nhất quán.
- Cấu hình frontend dùng biến môi trường `VITE_API_BASE_URL`, đồng thời kiểm tra kết nối giữa Vite và FastAPI.
- Tham gia xây dựng và chạy Golden Set để kiểm tra các tình huống tóm tắt, tạo quiz, lesson isolation và xử lý lỗi.

## AI đã hỗ trợ tôi như thế nào

Tôi sử dụng AI như một công cụ hỗ trợ lập trình và rà soát thiết kế. AI giúp tôi:

- Đề xuất cấu trúc component và state cho giao diện React.
- Phân tích lỗi runtime như `React is not defined`, lỗi CORS và lỗi kết nối frontend–backend.
- Xây dựng API contract để giảm sự phụ thuộc giữa hai phần frontend và backend.
- Đề xuất schema có cấu trúc cho kết quả tóm tắt và quiz.
- Tạo khung Golden Set và runner để kiểm tra API tự động.
- Rà soát cấu trúc repository theo yêu cầu nộp bài.

Tôi không coi kết quả AI là đúng mặc định. Tôi kiểm tra lại bằng cách chạy ứng dụng, quan sát Network/Console, gọi health endpoint và chạy từng test case. Các dữ liệu nhạy cảm như Gemini API key được đặt trong `.env` và không được commit.

## Một case fail và cách nhóm xử lý

Một lỗi đáng chú ý là frontend hiển thị thông báo không kết nối được backend trong khi health endpoint vẫn trả về `200 OK`. Log backend cho thấy `POST /api/chat` trả về `502 Bad Gateway`. Điều này chứng minh lỗi không nằm ở việc Vite không gọi được FastAPI, mà nằm trong bước backend gọi Gemini hoặc xử lý kết quả từ model.

Nhóm đã tách việc kiểm tra thành từng lớp:

1. Kiểm tra `GET /api/health` để xác nhận FastAPI đang hoạt động.
2. Kiểm tra đúng port giữa `VITE_API_BASE_URL` và Uvicorn.
3. Kiểm tra `GEMINI_API_KEY` được backend nạp từ `.env`.
4. Kiểm tra log chi tiết của `POST /api/chat`.
5. Chuẩn hóa phản hồi lỗi để frontend phân biệt lỗi kết nối với lỗi AI upstream.

Một case fail khác trong eval là `lesson_id` không tồn tại vẫn trả về nội dung tóm tắt hoặc quiz. Đây là lỗi nghiêm trọng vì model có thể tạo nội dung không dựa trên đúng tài liệu. Cách xử lý là kiểm tra `lesson_id` bằng manifest trước khi gọi Gemini và trả về `404 Unknown lesson_id` nếu không tìm thấy tài liệu.

## Bài học rút ra

Bài học lớn nhất của tôi là một giao diện AI không chỉ cần đẹp và gọi được model. Hệ thống phải kiểm soát ngữ cảnh và định dạng phản hồi từ đầu đến cuối. `lesson_id` cần được xác thực, model chỉ được đọc đúng tài liệu đã chọn, và frontend không nên suy đoán định dạng câu trả lời từ văn bản tự do.

Việc định nghĩa contract rõ ràng giúp frontend và backend có thể phát triển song song. Khi backend trả về một `type` và payload có schema ổn định, frontend có thể hiển thị đúng bản tóm tắt, link PDF hoặc link quiz mà không phụ thuộc vào cách Gemini diễn đạt câu chữ.

Tôi cũng học được rằng test thất bại không chỉ là lỗi cần sửa mà còn là bằng chứng giúp xác định ranh giới an toàn của sản phẩm. Các test về lesson isolation và unknown lesson quan trọng không kém các test happy path.

## Nếu có thêm thời gian

Tôi sẽ ưu tiên:

1. Bổ sung trạng thái loading, retry và thông báo lỗi chi tiết hơn cho từng bước gọi AI.
2. Thêm citation theo trang slide để người học kiểm tra nguồn của nội dung tóm tắt và đáp án quiz.
3. Chạy validation với ít nhất 5 người ngoài nhóm, tổng hợp quote nguyên văn và chỉnh UI dựa trên hành vi thực tế.
4. Bổ sung test frontend tự động cho toàn bộ luồng chọn tài liệu, chat, tải PDF và hoàn thành quiz.

## Phần tôi có thể giải thích tại CP5/CP6

Tôi có thể trình bày:

- Cách React quản lý tài liệu đang chọn và truyền `lesson_id` vào request.
- Cách frontend chọn component hiển thị dựa trên `response.type`.
- Cách link PDF và link quiz được tạo từ dữ liệu backend trả về.
- Cách cấu hình `VITE_API_BASE_URL` quyết định API mà localhost gọi.
- Cách phân biệt lỗi frontend, lỗi kết nối FastAPI và lỗi Gemini upstream.
- Lý do phải xác thực lesson trước khi gọi model và trước khi sinh quiz.

