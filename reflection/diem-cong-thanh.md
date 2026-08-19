# Reflection cá nhân – [Diêm Công Thành]

- **Mã học viên:** [2A202601689]
- **Nhóm:** K3-Hackathon-VlearnFuture-E403
- **Dự án:** VLearn AI Tutor
- **Vai trò:** Backend, tích hợp AI tool và kiểm thử/evaluation

## Vai trò và phần tôi thực hiện

Trong dự án VLearn AI Tutor, phần tôi tập trung là xây dựng lớp backend để chatbot không chỉ trả lời bằng văn bản tự do, mà có thể đọc đúng tài liệu bài học đang chọn, tạo bản tóm tắt có cấu trúc, sinh file PDF, tạo quiz và trả kết quả theo một API contract ổn định cho frontend.

Các phần chính tôi tham gia gồm:

- Xây dựng API FastAPI với các endpoint chính như `GET /api/health`, `POST /api/chat`, `GET /api/quizzes/{quiz_id}` và `GET /api/files/{filename}`.
- Thiết kế cấu hình backend qua `.env`, gồm `GEMINI_API_KEY`, model Gemini, timeout, port và CORS origin cho frontend Vite.
- Tạo tool `get_current_lesson_content` để backend đọc manifest `data/lessons.json`, xác thực `lesson_id`, tìm đúng file PDF và trích xuất nội dung bài học.
- Thiết kế schema phản hồi có cấu trúc cho các loại response `text`, `lesson-summary`, `quiz-ready` và `error`.
- Xử lý luồng tạo tóm tắt: Gemini gọi tool đọc slide, backend validate output, sau đó tạo file PDF summary và trả `download_url` cho frontend.
- Xử lý luồng tạo quiz: Gemini trả quiz có cấu trúc, backend lưu quiz thành artifact JSON và trả `quiz_url` để frontend mở trang quiz.
- Viết và chạy test cho phần tool đọc lesson/PDF, đảm bảo alias như `d2` resolve đúng bài học và nội dung PDF được trích xuất thật.
- Tham gia xây golden set/eval để kiểm tra các nhóm case: tóm tắt, tạo quiz, structured output, ambiguous intent, context grounding và lesson isolation.

## AI đã hỗ trợ tôi như thế nào

Tôi dùng AI như một cộng sự kỹ thuật để tăng tốc quá trình thiết kế và rà soát. AI giúp tôi phác thảo cấu trúc backend, đề xuất schema response, gợi ý cách chia lớp service/tool/schema và hỗ trợ viết các test case cho những điểm dễ lỗi.

AI cũng hỗ trợ trong quá trình debug. Ví dụ, khi frontend báo không kết nối được backend, tôi không dừng ở thông báo lỗi trên giao diện mà kiểm tra từng lớp: Vite gọi đúng base URL chưa, FastAPI có chạy không, `/api/health` có trả `200` không, CORS có đúng origin không, và lỗi thật nằm ở bước gọi Gemini hay ở bước validate output.

Tôi không copy kết quả AI một cách nguyên xi. Các phần quan trọng đều được kiểm chứng bằng cách chạy backend local, gọi health endpoint, chạy test, đọc log Uvicorn và kiểm tra response thực tế trả về cho frontend. Những thông tin nhạy cảm như API key được giữ trong `.env` và không commit vào repository.

## Một case fail và cách nhóm xử lý

Một case fail quan trọng là nguy cơ `lesson_id` không hợp lệ nhưng hệ thống vẫn cho model tạo tóm tắt hoặc quiz. Nếu chuyện này xảy ra, người học có thể nhận một câu trả lời nghe rất hợp lý nhưng không dựa trên đúng tài liệu bài giảng. Đây là lỗi nghiêm trọng vì sản phẩm AI tutor cần được grounding vào tài liệu đang học, không được tự bịa hoặc trộn nội dung giữa các ngày học.

Cách xử lý của nhóm là đưa bước xác thực `lesson_id` lên trước khi gọi Gemini. Backend dùng manifest bài học làm nguồn tin cậy duy nhất. Nếu `lesson_id` không tồn tại hoặc có dấu hiệu path traversal, backend chặn sớm và trả lỗi thay vì gửi yêu cầu cho model. Với quiz và summary, backend cũng kiểm tra rằng Gemini đã gọi tool đọc nội dung bài học trước khi cho phép tạo artifact.

Một case fail khác là khác biệt port giữa frontend và backend. Frontend có thể trỏ `VITE_API_BASE_URL` sang port khác trong khi Uvicorn chạy ở `8000`, dẫn tới cảm giác như backend lỗi dù thực chất hai phần đang không nói chuyện với nhau. Sau khi phát hiện, nhóm chuẩn hóa file môi trường local để frontend gọi `http://127.0.0.1:8000/api` và dùng `/api/health` làm điểm kiểm tra nhanh.

## Bài học rút ra

Bài học lớn nhất của tôi là một sản phẩm AI học tập không thể chỉ dựa vào việc “gọi được model”. Phần khó nằm ở lớp kiểm soát xung quanh model: xác định nguồn dữ liệu đáng tin cậy, giới hạn ngữ cảnh, validate input/output, xử lý lỗi và đo chất lượng bằng các case cụ thể.

Tôi cũng học được rằng API contract là một phần rất quan trọng của sản phẩm AI. Nếu backend trả response theo schema rõ ràng, frontend có thể hiển thị summary, link PDF, link quiz và trạng thái lỗi một cách ổn định. Nếu chỉ trả văn bản tự do từ model, frontend sẽ phải đoán ý nghĩa câu trả lời, làm sản phẩm dễ vỡ và khó demo.

Về evaluation, tôi nhận ra test không chỉ để chứng minh hệ thống chạy được, mà còn để định nghĩa ranh giới an toàn. Các case như `lesson_isolation`, unknown lesson, structured output sai format hay quiz thiếu đáp án đều giúp nhóm nhìn thấy sản phẩm có thể hỏng ở đâu trước khi đưa cho người dùng.

## Nếu có thêm thời gian

Tôi sẽ ưu tiên các cải tiến sau:

1. Bổ sung test API end-to-end cho `POST /api/chat`, `GET /api/quizzes/{quiz_id}` và `GET /api/files/{filename}`.
2. Thêm citation theo trang slide trong summary và explanation của quiz để người học kiểm tra nguồn.
3. Cải thiện fallback khi chưa có `GEMINI_API_KEY`, ví dụ trả hướng dẫn rõ hơn hoặc mock response gần với luồng demo thật.
4. Lưu log eval theo từng lần chạy và tóm tắt pass/fail tự động để nhóm dễ so sánh chất lượng sau mỗi thay đổi.
5. Hoàn thiện validation với người dùng thật, ghi quote nguyên văn và cập nhật lại sản phẩm dựa trên bằng chứng thay vì cảm tính.

## Phần tôi có thể giải thích tại CP5/CP6

Tôi có thể trình bày:

- Vì sao backend phải validate `lesson_id` trước khi gọi Gemini.
- Cách tool `get_current_lesson_content` đọc manifest và trích xuất nội dung PDF.
- Cách schema `lesson-summary` và `quiz-ready` giúp frontend render ổn định.
- Cách backend tạo PDF summary và lưu quiz để link có thể mở lại.
- Cách phân biệt lỗi frontend, lỗi cấu hình port/CORS, lỗi backend và lỗi Gemini upstream.
- Cách golden set kiểm tra happy path, edge case, structured output và lesson isolation.
- Vì sao không commit `.env`, API key hoặc dữ liệu nhạy cảm vào repository.

