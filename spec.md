# Template AI Spec *(spec.md — commit trước 23:59 N1 · quality bar chốt từ thời điểm nộp)*

# AI SPEC — [VlearnFuture]
Hướng: [X] A — VLearn  [ ] B — Trợ lý Học viên  [ ] C — Làn mở
Loại: [ ] Tối ưu tính năng có sẵn  [X] Tính năng mới

## §1. User & Job
- Job executor + workflow (đính kèm worksheet JTBD / ảnh sơ đồ): Học viên (sinh viên) đang học từ slide bài giảng.

          👤 Job Executor
              Sinh viên
                  │
                  ▼
        📚 Situation
  Ôn tập từ slide trước kỳ thi
                  │
                  ▼
        😣 Pain Points
 • Slide dài
 • Khó tìm ý chính
 • Tự tạo câu hỏi mất thời gian
                  │
                  ▼
      🎯 Desired Outcome
 • Hiểu nhanh nội dung
 • Có quiz để ôn tập
 • Tiết kiệm thời gian

 - Core JTBD (không tên sản phẩm/AI trong câu): Khi đang ôn tập từ slide bài giảng, tôi muốn nhanh chóng nắm được các ý chính và có câu hỏi để tự kiểm tra kiến thức, nhằm tiết kiệm thời gian và ghi nhớ nội dung hiệu quả hơn.
- Problem statement (KHÔNG chữ AI): Sinh viên thường phải dành nhiều thời gian đọc toàn bộ slide để tìm ý chính và tự tạo câu hỏi ôn tập. Việc này mất thời gian, đặc biệt khi tài liệu dài hoặc trước kỳ thi.
- Evidence (chuẩn A và/hoặc B — log đầy đủ trong repo):
  - Số liệu mining / kết quả khảo sát (n = ?, % xác nhận):  
    + 14/20 (70%) người được hỏi cho biết mất trên 15 phút để ôn một bộ slide.
    + 10/20 (50%) người được hỏi cho biết khó khăn lớn nhất do slide dài, khó xác định nội dung
    + 15/20 (75%) người được hỏi cho biết họ sẵn sàng thử prototype tóm tắt bài giảng và tạo quiz
  - ≥5 quote/ví dụ nguyên văn + nguồn:

## §2. Impact & quyết định chọn
- Bảng impact ≥3 ứng viên (bao nhiêu người · tần suất · tốn gì mỗi lần · khả thi):

| Ứng viên | Bao nhiêu người | Tần suất | Tốn gì mỗi lần | Khả thi |
|---|---|---|---|---|
| Học viên/Sinh viên | 19/20 (95%) | 3-5 buổi/tuần | 16-60 phút | 5/5 |
| Giảng viên | 0/20 (0%) | Không có dữ liệu | Không có dữ liệu | 1/5 |
| Trợ giảng | 0/20 (0%) | Không có dữ liệu | Không có dữ liệu | 1/5 |

- Ứng viên ĐÃ LOẠI + vì sao: Giảng viên: Không có người tham gia khảo sát thuộc nhóm này (0/20), nên nhóm chưa có đủ bằng chứng để xác nhận nhu cầu.
Trợ giảng: Tương tự, không có dữ liệu khảo sát (0/20), đồng thời nhu cầu của trợ giảng khác với mục tiêu MVP là hỗ trợ người học.
- Ứng viên CHỌN + vì sao (bằng số): Chọn: Học viên/Sinh viên

Vì:

95% (19/20) người tham gia khảo sát là học viên.
50% (10/20) cho biết khó khăn lớn nhất là slide dài, khó xác định nội dung chính.
60% (12/20) mất từ 16 phút trở lên để đọc lại và xác định các ý chính của một bộ slide.
30% (6/20) hiện đang dùng AI bên ngoài để tóm tắt, cho thấy nhu cầu về công cụ hỗ trợ học tập.

## §3. Giải pháp tương tự đã nghiên cứu
Flow:

Người học tải slide hoặc copy nội dung bài giảng.
Yêu cầu tóm tắt nội dung hoặc tạo câu hỏi ôn tập.
Hệ thống trả về bản tóm tắt hoặc quiz.

Đáng học:

Khả năng hiểu ngôn ngữ tự nhiên tốt.
Có thể xử lý nhiều loại yêu cầu học tập khác nhau.
Cho phép người dùng tương tác, hỏi tiếp để đào sâu kiến thức.

Đáng né:

Người dùng phải tự biết cách viết prompt.
Không tự động gắn kết với cấu trúc bài giảng.
Có thể trả lời ngoài phạm vi tài liệu nếu không yêu cầu rõ ràng.

Mình khác gì:

Tập trung vào workflow học tập cụ thể: tải slide → tóm tắt → tạo quiz.
Kết quả được tối ưu cho việc ôn tập thay vì hội thoại chung.
Giảm thao tác viết prompt cho người học.
[Sản phẩm 3]: Quizlet

Flow:

Người dùng nhập hoặc tạo bộ học liệu.
Hệ thống tạo flashcard, câu hỏi và bài kiểm tra.
Người học luyện tập.

Đáng học:

Cách tổ chức nội dung học tập rõ ràng.
Có nhiều hình thức kiểm tra giúp tăng khả năng ghi nhớ.
Tạo thói quen ôn tập thường xuyên.

Đáng né:

Người dùng thường phải tự nhập nội dung hoặc chuẩn bị dữ liệu.
Không tập trung vào việc hiểu nội dung từ slide bài giảng ban đầu.

Mình khác gì:

Tự động biến slide bài giảng có sẵn thành tài liệu ôn tập.
Giảm bước chuẩn bị thủ công trước khi học.
Kết hợp tóm tắt và kiểm tra trong cùng một luồng.

## §4. Thiết kế
- Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả): Một học viên đọc tài liệu trong buổi học · hỏi AI tóm tắt slide · AI quyết định đọc và tóm tắt nội dung · AI trả về nội dung đã tóm tắt  
- Non-goals (≥3 thứ KHÔNG build): 
  + Không xây dựng hệ thống quản lý khóa học (LMS) hoàn chỉnh.
  + Không hỗ trợ chỉnh sửa trực tiếp nội dung slide.
  + Không hỗ trợ tạo quiz từ nhiều tài liệu cùng lúc.
  + Không tích hợp đăng nhập bằng Google/Microsoft hoặc đồng bộ với Moodle, Canvas.
  + Không có chức năng AI chatbot trả lời mọi câu hỏi ngoài nội dung của slide.  
- Mức prototype nhắm tới: [ ] Sketch [ ] Mock [X] Working — phần nào mock, phần nào thật:
- Automation: [ ] augment [ ] conditional [X] automate — lý do theo cost-of-error: Hệ thống tự động hóa việc đọc và tóm tắt nội dung slide vì đây là công việc lặp lại, tốn nhiều thời gian nhưng rủi ro thấp. Tuy nhiên, kết quả vẫn cần người học kiểm tra lại với tài liệu gốc vì việc tóm tắt sai hoặc bỏ sót ý quan trọng có thể ảnh hưởng đến quá trình học tập.
- §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR, xem guide):
  | Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| AI không tự bịa thông tin (Honesty / Transparency) | Hệ thống chỉ tạo bản tóm tắt dựa trên nội dung slide được người dùng cung cấp, không tự thêm kiến thức ngoài tài liệu. |
| Hiển thị nguồn tham chiếu (Source / Explainability) | Kết quả tóm tắt được tạo từ nội dung trong slide để người học có thể đối chiếu lại với tài liệu gốc. |
| Giảm tải nhận thức (Reduce Cognitive Load) | AI chuyển nội dung slide dài thành các ý chính ngắn gọn, giúp người học nhanh chóng nắm được kiến thức quan trọng. |
| Thiết kế phản hồi rõ ràng (Feedback & Iteration) | Kết quả được trình bày theo cấu trúc dễ đọc để người học đánh giá và tiếp tục tương tác. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8) [bảng theo guide §2.5]

| Lớp lỗi | Kịch bản khó | Rủi ro | Cách xử lý trong prototype |
|---|---|---|---|
| Lỗi dữ liệu đầu vào (Input/Data) | Học viên tải file PDF bị lỗi, không đọc được nội dung slide | Hệ thống không có dữ liệu để tóm tắt hoặc tạo kết quả sai | Thông báo lỗi tải file và yêu cầu người dùng cung cấp lại tài liệu |
| Lỗi dữ liệu đầu vào (Input/Data) | Slide chỉ chứa hình ảnh, biểu đồ, ít chữ nên khó trích xuất nội dung | Tóm tắt thiếu ý quan trọng | Thông báo kết quả có thể không đầy đủ và khuyến nghị dùng slide có nội dung rõ hơn |
| Lỗi hiểu nội dung (Understanding) | Slide chứa nhiều thuật ngữ chuyên ngành, hệ thống hiểu sai ý nghĩa khái niệm | Bản tóm tắt sai kiến thức | Yêu cầu hệ thống bám sát nội dung gốc, không tự thêm giải thích ngoài tài liệu |
| Lỗi hiểu nội dung (Understanding) | Nội dung slide dài, có nhiều chương trong một file | Bỏ sót phần quan trọng hoặc tóm tắt quá chung chung | Chia nhỏ nội dung hoặc cho phép tóm tắt theo từng phần |
| Lỗi tương tác người dùng (User Request) | Học viên yêu cầu "tóm tắt thật ngắn" nhưng không nói rõ mức độ chi tiết | Kết quả không đúng kỳ vọng | Cho phép chọn mức độ tóm tắt: ngắn, vừa, chi tiết |
| Lỗi tương tác người dùng (User Request) | Người dùng yêu cầu tóm tắt nội dung không có trong slide | Hệ thống có thể trả lời dựa trên kiến thức ngoài tài liệu | Thông báo không tìm thấy thông tin trong tài liệu và yêu cầu cung cấp thêm nguồn |
| Lỗi kết quả AI (Output/Trust) | Hệ thống tạo bản tóm tắt nghe hợp lý nhưng bỏ mất ý quan trọng | Người học hiểu sai kiến thức | Cho phép đối chiếu với slide gốc trước khi sử dụng kết quả |
| Lỗi kết quả AI (Output/Trust) | Hệ thống tạo bản tóm tắt quá dài, không đúng cấu trúc | Người học khó tiếp nhận thông tin | Chuẩn hóa đầu ra thành các ý chính dạng bullet, dễ đọc |
## §6. Bốn đường đi của trải nghiệm
- Happy path:
Học viên tải lên slide bài giảng hợp lệ → hệ thống đọc nội dung → tạo bản tóm tắt các ý chính → sinh quiz kiểm tra kiến thức → học viên sử dụng kết quả để ôn tập.

- Low-confidence (②):
Hệ thống nhận thấy slide có ít nội dung, chất lượng thấp hoặc thông tin không đủ rõ → thông báo mức độ tin cậy thấp → yêu cầu học viên cung cấp thêm slide hoặc chọn phần nội dung cụ thể cần xử lý.

- Failure/không căn cứ (①):
Hệ thống không tìm thấy thông tin phù hợp trong slide hoặc không thể đọc file → không tự tạo câu trả lời → thông báo không có đủ căn cứ và yêu cầu người dùng tải lại tài liệu.

- Correction (user sửa):
Học viên nhận thấy bản tóm tắt chưa phù hợp → có thể yêu cầu tóm tắt lại theo mức độ khác (ngắn hơn, chi tiết hơn) hoặc chọn lại nội dung cần tập trung.

- Khi bị đòi ngoài phạm vi (③):
Học viên yêu cầu giải thích kiến thức không có trong slide hoặc hỏi các nội dung ngoài tài liệu → hệ thống thông báo nội dung nằm ngoài phạm vi hỗ trợ và hướng dẫn người dùng cung cấp tài liệu liên quan.

- Case đặc thù domain (④):
Slide chứa thuật ngữ chuyên ngành hoặc kiến thức quan trọng dễ hiểu sai → hệ thống ưu tiên bám sát nội dung gốc, hiển thị cảnh báo cần kiểm tra lại với tài liệu gốc để tránh học sai kiến thức.

## §7. Kiểm thử
- Chiều chất lượng + định nghĩa kiểm chứng được:

| Chiều chất lượng | Cách kiểm chứng |
|---|---|
| Đúng nội dung (Grounding) | Nội dung tóm tắt và quiz phải dựa trên đúng PDF được ánh xạ qua lesson_id, không lấy nhầm bài giảng khác. |
| Không bịa thông tin (Hallucination control) | Khi tài liệu không có thông tin, hệ thống phải báo không tìm thấy thay vì tự tạo nội dung. |
| Đúng cấu trúc đầu ra | Summary phải có đủ các trường cần thiết; quiz phải có đúng 8 câu, mỗi câu có 4 lựa chọn, đáp án và giải thích. |
| Xử lý tình huống khó | Hệ thống phải xử lý được các trường hợp mơ hồ, yêu cầu ngoài phạm vi, prompt injection và file không tồn tại. |

- Golden set (≥20 case theo cơ cấu trong guide §2.6, file trong eval/): File: `eval/golden-set-20.json`

Golden set gồm 20 test case cho hai chức năng chính:

1. Tóm tắt slide và tạo link tải PDF.
2. Tạo quiz, lưu JSON và tạo link HTML.

- Quality bar (chốt từ 23:59, giữ nguyên sau đó): "Đạt khi ≥ 75% qua bộ, và AI không được lấy sai file và không được bịa thông tin"

- Kết quả các lượt chạy (bảng % — cập nhật đến trước CP6):

| Lượt chạy | Tổng case | Case đạt | Tỷ lệ pass | Thay đổi |
|---|---|---|---|---|
| Lần 1 | 20 | 17 | 85% | Prompt ban đầu |
| Lần 2 | 20 | 20 | 100% | Cải thiện prompt và xử lý lỗi |
| Lần 3 | 20 | 20 | 100% | Chuẩn hóa output và tăng độ bám tài liệu |


## §8. Phân công & kế hoạch
-- Phân công có tên:

| Thành viên | Vai trò | Công việc |
|---|---|---|
| Vũ Quang Tùng | Spec | Viết và cập nhật spec.md, thiết kế JTBD, flow sản phẩm |
| Chu Thị Yến Khanh | Evidence | Thu thập khảo sát, tổng hợp số liệu, lưu log bằng chứng |
| Vũ Quang Tùng | Prompt | Thiết kế prompt, xây dựng golden set, kiểm tra các case lỗi |
| Diêm Công Thành | Code | Xây dựng prototype, tích hợp API AI, xử lý workflow |
| Chu Thị Yến Khanh | Demo | Chuẩn bị slide, kịch bản demo, quay backup và kiểm tra flow |

- Willing users (≥3 tên) + kế hoạch vòng validation CP5 (3 câu hỏi, ai log):
- Multi-prototype (nếu làm): trục khác biệt của ≥2 phương án + lý do chọn:

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |

