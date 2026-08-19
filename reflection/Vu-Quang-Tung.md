# Reflection cá nhân – Vũ Quang Tùng

- **Mã học viên:** 2A202601545
- **Nhóm:** K3-Hackathon-VlearnFuture-E403
- **Dự án:** VLearn AI Tutor
- **Vai trò:** Prompt và Spec

## Vai trò và phần tôi thực hiện

Trong dự án này, tôi phụ trách xây dựng AI Spec và thiết kế Prompt behavior cho VLearn AI Tutor. Công việc chính của tôi tập trung vào việc xác định cách hệ thống AI nên hoạt động, giới hạn phạm vi trả lời và đảm bảo kết quả tạo ra phù hợp với mục tiêu hỗ trợ học tập.

Các phần tôi thực hiện gồm:

- Xây dựng và hoàn thiện tài liệu `spec.md`, bao gồm user/job, problem statement, impact analysis, thiết kế workflow và các nguyên tắc AI.
- Xác định lát cắt sản phẩm: học viên chọn slide bài giảng, yêu cầu tóm tắt hoặc tạo quiz, hệ thống xử lý nội dung trong tài liệu và trả về kết quả ôn tập.
- Thiết kế prompt để AI chỉ sử dụng nội dung thuộc bài giảng hiện tại, tránh tự bổ sung kiến thức ngoài tài liệu.
- Xác định format đầu ra cho hai chức năng chính: tóm tắt bài giảng và tạo quiz.
- Xây dựng các tình huống lỗi AI gồm hallucination, thiếu thông tin, yêu cầu ngoài phạm vi và sai ngữ cảnh tài liệu.
- Thiết kế Golden Set gồm các case thường, case khó và case hiếm để đánh giá chất lượng AI.
- Xác định quality bar cho hệ thống: AI phải tóm tắt đúng bài giảng, không tiết lộ thông tin hệ thống, quiz phải đúng cấu trúc và nội dung phải dựa trên tài liệu được chọn.
- Phối hợp với thành viên code để thống nhất cách backend trả dữ liệu và frontend hiển thị kết quả.

## AI đã hỗ trợ tôi như thế nào

Tôi sử dụng AI như một công cụ hỗ trợ trong quá trình thiết kế sản phẩm, đặc biệt ở các công việc phân tích yêu cầu và kiểm tra ý tưởng.

AI hỗ trợ tôi:

- Gợi ý cấu trúc ban đầu cho AI Spec theo hướng user, job, pain point và solution.
- Đề xuất các nhóm lỗi thường gặp của hệ thống AI như bịa thông tin, hiểu sai câu hỏi hoặc trả lời ngoài phạm vi.
- Hỗ trợ xây dựng các prompt thử nghiệm để kiểm tra khả năng bám sát nội dung slide.
- Gợi ý cấu trúc Golden Set và các trường hợp cần kiểm thử như lesson isolation, ambiguous intent và structured output.
- Hỗ trợ rà soát tài liệu để phát hiện những phần chưa rõ ràng trong workflow hoặc tiêu chí đánh giá.

Tuy nhiên, tôi không sử dụng kết quả AI một cách mặc định. Tôi kiểm tra lại bằng cách đối chiếu với yêu cầu sản phẩm, chạy thử các case trong Golden Set và đánh giá xem kết quả có đúng với tài liệu nguồn hay không.

## Một case fail và cách nhóm xử lý

Một lỗi quan trọng nhóm gặp phải là trường hợp AI có thể tạo ra câu trả lời hợp lý nhưng không dựa trên đúng bài giảng đang được chọn.

Ví dụ: khi người dùng yêu cầu tóm tắt một bài học hiện tại nhưng hệ thống có thể lấy nhầm nội dung của bài khác hoặc dựa vào kiến thức chung của mô hình. Đây là lỗi nguy hiểm vì người học có thể tin rằng nội dung đó đến từ slide trong khóa học.

Ở vai trò Prompt và Spec, tôi xử lý vấn đề này bằng cách:

1. Xác định rõ trong spec rằng AI chỉ được phép sử dụng nội dung thuộc `lesson_id` hiện tại.
2. Thiết kế prompt yêu cầu AI không suy luận hoặc bổ sung kiến thức ngoài tài liệu.
3. Bổ sung các case kiểm thử lesson isolation trong Golden Set.
4. Đặt rule khi không tìm thấy thông tin: AI phải thông báo không có dữ liệu thay vì tự tạo câu trả lời.

Qua quá trình kiểm thử, nhóm nhận thấy việc thiết kế prompt cần đi cùng với giới hạn sản phẩm. Prompt tốt không chỉ giúp AI trả lời đúng mà còn quy định cách hệ thống phản ứng khi không chắc chắn.

## Bài học rút ra

Bài học lớn nhất của tôi là xây dựng sản phẩm AI không chỉ là viết một câu prompt để model trả lời tốt. Prompt cần trở thành một phần của thiết kế sản phẩm, trong đó phải xác định rõ:

- AI được phép làm gì.
- AI không được làm gì.
- Khi nào AI cần từ chối hoặc yêu cầu thêm thông tin.
- Làm thế nào để người dùng kiểm tra lại kết quả.

Tôi nhận ra rằng các lỗi như hallucination không thể chỉ xử lý bằng việc chỉnh câu lệnh cho AI, mà cần kết hợp giữa spec, workflow, dữ liệu đầu vào và bộ kiểm thử.

Việc xây dựng Golden Set cũng giúp tôi hiểu rằng đánh giá AI cần dựa trên các tình huống cụ thể thay vì chỉ nhìn vào một vài câu trả lời đẹp trong demo.

## Nếu có thêm thời gian

Tôi sẽ ưu tiên:

1. Bổ sung thêm nhiều case Golden Set lấy từ hành vi thực tế của học viên.
2. Cải thiện prompt để AI có thể trích dẫn vị trí nội dung trong slide khi tạo summary.
3. Xây dựng thêm tiêu chí đánh giá chất lượng quiz như độ khó, mức độ bao phủ kiến thức và độ chính xác của đáp án.
4. Thực hiện thêm vòng validation với người học thật để kiểm tra mức độ hữu ích của nội dung AI tạo ra.

## Phần tôi có thể giải thích tại CP5/CP6

Tôi có thể trình bày:

- Cách nhóm xác định user, job và problem statement.
- Cách thiết kế prompt để AI bám sát tài liệu bài giảng.
- Cách xây dựng 4 lớp lỗi và Golden Set.
- Lý do chọn automation level cho chức năng tóm tắt và tạo quiz.
- Cách xác định quality bar và đánh giá kết quả AI.
- Cách xử lý các trường hợp AI không chắc chắn hoặc không có căn cứ.