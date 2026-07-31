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
  - Số liệu khảo sát (n = 20 người ngoài nhóm):
    + 14/20 (70%) người được hỏi cho biết mất trên 15 phút để ôn một bộ slide.
    + 10/20 (50%) người được hỏi cho biết khó khăn lớn nhất là slide dài, khó xác định nội dung.
    + 6/20 (30%) đang dùng công cụ AI bên ngoài để tóm tắt nội dung slide.
    + 15/20 (75%) trả lời “Có” khi được hỏi có sẵn sàng thử prototype tóm tắt bài giảng và tạo quiz hay không.

  - Log câu hỏi và kết quả trả lời từ Google Forms:

    | Câu hỏi | Các câu trả lời và số lượt chọn |
    |---|---|
    | Câu 2. Trung bình một bộ slide bạn học trên VLearn dài khoảng bao nhiêu trang? | Dưới 20 trang: 1/20 (5%); 20–40 trang: 3/20 (15%); 41–60 trang: 7/20 (35%); 61–100 trang: 7/20 (35%); trên 100 trang: 2/20 (10%). |
    | Câu 3. Sau một buổi học, bạn thường làm gì để ôn lại nội dung slide? | Đọc lại toàn bộ slide: 5 lượt; tự ghi lại các ý chính: 2 lượt; dùng AI bên ngoài để tóm tắt: 6 lượt; tự tạo câu hỏi ôn tập: 1 lượt; hỏi bạn bè hoặc giảng viên: 2 lượt; không ôn lại: 4 lượt; khác: 2 lượt. Đây là câu hỏi chọn nhiều phương án nên tổng lượt có thể lớn hơn 20. |
    | Câu 4. Bạn thường mất bao lâu để đọc lại và xác định các ý chính của một bộ slide? | Dưới 5 phút: 3/20 (15%); 5–15 phút: 3/20 (15%); 16–30 phút: 6/20 (30%); 31–60 phút: 2/20 (10%); trên 60 phút: 6/20 (30%). Do đó, số người mất trên 15 phút là 6 + 2 + 6 = 14/20 (70%). |
    | Câu 5. Khó khăn lớn nhất của bạn khi ôn tập bằng slide là gì? | Slide dài, khó xác định nội dung: 10/20 (50%); phải mở lại nhiều trang để tìm thông tin: 3/20 (15%); khó biết phần kiến thức mình chưa hiểu: 3/20 (15%); mất thời gian tự viết tóm tắt: 3/20 (15%); mất thời gian tự tạo câu hỏi ôn tập: 3/20 (15%); ghi chú và tài liệu nằm ở nhiều nơi: 1/20 (5%); dễ bỏ sót nội dung quan trọng: 1/20 (5%); không gặp khó khăn đáng kể: 0/20; khác: 3/20 (15%). Đây là câu hỏi chọn nhiều phương án nên tổng lượt có thể lớn hơn 20. |
    | Câu 8. Bạn có sẵn sàng thử prototype gồm tóm tắt bài giảng và quiz cuối buổi không? | Có: 15/20 (75%); có thể nếu chỉ mất dưới 5 phút: 2/20 (10%); chưa chắc: 1/20 (5%); không: 2/20 (10%). |

  - ≥5 ví dụ nguyên văn + nguồn (giữ đúng câu chữ của phương án được người tham gia chọn trong Google Forms):
    1. “Slide dài, khó xác định nội dung.” — Google Forms, câu 5, 10 lượt chọn.
    2. “Phải mở lại nhiều trang để tìm thông tin.” — Google Forms, câu 5, 3 lượt chọn.
    3. “Khó biết phần kiến thức mình chưa hiểu.” — Google Forms, câu 5, 3 lượt chọn.
    4. “Mất thời gian tự viết tóm tắt.” — Google Forms, câu 5, 3 lượt chọn.
    5. “Mất thời gian tự tạo câu hỏi ôn tập.” — Google Forms, câu 5, 3 lượt chọn.

  > Các ví dụ trên là phương án trả lời nguyên văn và số lượt chọn từ biểu đồ tổng hợp Google Forms, không được trình bày như quote phỏng vấn tự do của một cá nhân cụ thể.

## §2. Impact & quyết định chọn
- Bảng impact ≥3 ứng viên bài toán/tính năng (bao nhiêu người · tần suất · tốn gì mỗi lần · khả thi):

  Khảo sát đo thời gian của toàn workflow “đọc lại và xác định ý chính”, không đo số phút riêng cho từng pain. Vì vậy cột “tốn gì mỗi lần” dùng cùng baseline kiểm chứng được: 14/20 người mất trên 15 phút; trong đó 6/20 mất 16–30 phút, 2/20 mất 31–60 phút và 6/20 mất trên 60 phút. Tần suất được tính là một lần cho mỗi lần người học ôn lại một bộ slide.

| Ứng viên bài toán/tính năng | Bao nhiêu người có signal | Tần suất | Tốn gì mỗi lần theo baseline khảo sát | Khả thi trong hackathon | Quyết định |
|---|---:|---:|---|---:|---|
| Tóm tắt slide để tìm nhanh nội dung trọng tâm | 10/20 (50%) chọn “slide dài, khó xác định nội dung”; 5/20 (25%) đang đọc lại toàn bộ slide | 1 lần/mỗi bộ slide cần ôn | 14/20 (70%) mất trên 15 phút; khoảng đo từ dưới 5 đến trên 60 phút | 5/5 | Chọn làm quyết định trung tâm |
| Tạo quiz để giảm công sức tự tạo câu hỏi ôn tập | 3/20 (15%) coi việc tự tạo câu hỏi là khó khăn; 1/20 (5%) hiện tự tạo câu hỏi | 1 lần/mỗi lần tự kiểm tra sau khi ôn | Nằm trong workflow ôn tập có 14/20 (70%) mất trên 15 phút; khảo sát chưa tách riêng số phút tạo quiz | 5/5 | Giữ làm kết quả hỗ trợ sau tóm tắt |
| Hỏi đáp theo nội dung slide để giảm việc mở lại nhiều trang | 3/20 (15%) phải mở lại nhiều trang để tìm thông tin | 1 lần/mỗi câu hỏi phát sinh khi ôn | Nằm trong workflow ôn tập có 14/20 (70%) mất trên 15 phút; khảo sát chưa tách riêng thời gian tìm từng thông tin | 4/5 | Không chọn làm lát cắt chính; chỉ giữ fallback có grounding |
| Phát hiện phần kiến thức người học chưa hiểu | 3/20 (15%) cho biết khó biết phần kiến thức mình chưa hiểu | 1 lần/mỗi vòng tự kiểm tra | Ít nhất 1 vòng ôn/kiểm tra bổ sung; khảo sát chưa đo số phút riêng cho việc xác định lỗ hổng | 2/5 | Loại khỏi MVP vì cần dữ liệu mastery qua nhiều lượt |

- Ứng viên CHỌN + vì sao bằng số:

  Nhóm chọn **tóm tắt slide để tìm nhanh nội dung trọng tâm** làm quyết định trung tâm vì đây là signal lớn nhất: 10/20 người (50%) xác nhận slide dài, khó xác định nội dung; 14/20 người (70%) mất trên 15 phút cho workflow hiện tại; và 6/20 người (30%) đã dùng AI bên ngoài để tóm tắt. Tính năng này đạt mức khả thi 5/5 và có thể demo end-to-end trong thời gian hackathon. Quiz được giữ làm kết quả hỗ trợ vì toàn prototype “tóm tắt + quiz” có 15/20 người (75%) sẵn sàng thử.

- Ứng viên ĐÃ LOẠI hoặc không chọn làm lát cắt chính:

  1. **Hỏi đáp theo nội dung slide:** chỉ 3/20 người (15%) có signal phải mở lại nhiều trang, thấp hơn 35 điểm phần trăm so với pain được chọn. Nhóm không chọn làm lát cắt chính nhưng giữ contextual Q&A có grounding như fallback sau validation.
  2. **Phát hiện phần kiến thức chưa hiểu:** có 3/20 người (15%) xác nhận, nhưng cần theo dõi quiz/mastery qua nhiều lượt nên chỉ đạt khả thi 2/5 và vượt phạm vi MVP.
  3. **Quiz như một bài toán độc lập:** 3/20 người (15%) coi việc tự tạo câu hỏi là khó khăn và chỉ 1/20 người (5%) đang tự tạo câu hỏi. Vì signal thấp hơn pain tóm tắt, nhóm không chọn quiz làm quyết định trung tâm; quiz được giữ như bước hỗ trợ tự kiểm tra sau khi tóm tắt.

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
- Lát cắt MỘT CÂU (1 user · 1 việc · 1 quyết định AI · 1 kết quả): **Một học viên đang ôn bài · yêu cầu tóm tắt bài giảng đang mở · AI quyết định dùng đúng PDF được ánh xạ bởi `lesson_id` để tạo bản tóm tắt có cấu trúc · học viên nhận bản tóm tắt và file PDF tải xuống để ôn nhanh.**
- Non-goals (≥3 thứ KHÔNG build): 
  + Không xây dựng hệ thống quản lý khóa học (LMS) hoàn chỉnh.
  + Không xây dựng đăng nhập, phân quyền hoặc cơ sở dữ liệu production; prototype dùng danh sách ba bài học cố định và lưu trạng thái quiz/mastery cục bộ.
  + Không cho người dùng upload hoặc xử lý một file tùy ý; AI chỉ đọc PDF tin cậy được ánh xạ sẵn bằng `lesson_id`.
  + Không hỗ trợ chỉnh sửa trực tiếp nội dung slide.
  + Không hỗ trợ tạo quiz từ nhiều tài liệu cùng lúc.
  + Không tích hợp đăng nhập bằng Google/Microsoft hoặc đồng bộ với Moodle, Canvas.
  + Không cung cấp chatbot kiến thức chung không kiểm soát: contextual Q&A ưu tiên nội dung PDF; nếu có dùng kiến thức chung thì giao diện phải gắn nhãn rõ “Có bổ sung kiến thức chung ngoài slide”.
- Mức prototype nhắm tới: [ ] Sketch [ ] Mock [X] Working.
  + **Phần chạy thật:** frontend gửi `lesson_id` và yêu cầu tới FastAPI; backend xác thực bài học, đọc PDF, gọi Gemini, validate output có cấu trúc, tạo summary/PDF/quiz, chấm quiz và trả kết quả mastery.
  + **Phần mock/local:** chỉ có ba bài học cố định; chưa có upload tài liệu, tài khoản, phân quyền và database production; quiz/mastery được lưu bằng file/local storage cho phạm vi prototype.
- Automation: [ ] augment [ ] conditional [X] automate.
  + **Quyết định được tự động hóa:** sau khi người học chủ động yêu cầu tóm tắt, hệ thống tự chọn đúng nguồn theo `lesson_id`, đọc PDF và tạo summary có cấu trúc mà không cần người vận hành can thiệp giữa chừng.
  + **Lý do theo cost-of-error:** workflow đọc lại slide lặp lại và có 14/20 người mất trên 15 phút, nên lợi ích tiết kiệm thời gian đủ lớn để automate. Cost-of-error ở mức trung bình vì tóm tắt sai hoặc bỏ sót ý có thể làm học viên học sai; vì vậy backend chặn `lesson_id` không hợp lệ trước lời gọi AI, chỉ dùng PDF đáng tin cậy cho summary/quiz, validate schema đầu ra, giữ tài liệu gốc ngay cạnh chatbot để người học đối chiếu và trả lỗi thay vì tạo artifact khi nguồn/output không hợp lệ.
- §4b. Nguyên tắc đã áp dụng (≥4 — HAX/PAIR, xem guide):

| Nguyên tắc HAX/PAIR | Áp cụ thể vào đâu trong prototype | Bằng chứng code |
|---|---|---|
| **Make clear what the system can do — nói rõ khả năng và giới hạn** | Lời chào trong `ChatPanel` nói rõ người học có thể hỏi về slide, yêu cầu tóm tắt hoặc tạo quiz; hai nút gợi ý “Tóm tắt bài giảng” và “Tạo quiz” giúp người dùng bắt đầu mà không cần tự viết prompt. | `codebase/frontend/src/App.jsx` — component `ChatPanel`, khối `hello` và `suggestion-row`. |
| **Show status — phản hồi trạng thái kịp thời** | Khi AI đang chạy, giao diện hiện “ViAI đang xử lý nội dung bài học...”, khóa nút gửi để tránh gửi lặp; khi tải/chấm quiz, UI hiện “Đang tải quiz...” hoặc “Đang chấm bài...”. | `codebase/frontend/src/App.jsx` — state `loading`, khối `thinking`, nút gửi `disabled`, `quizLoading` và `submitting`. |
| **Explainability & source transparency — cho biết căn cứ** | Contextual Q&A hiển thị badge “Dựa trên bài giảng đang mở” khi grounded; nếu model dùng kiến thức chung, hiển thị badge cảnh báo “Có bổ sung kiến thức chung ngoài slide”. Tài liệu PDF gốc vẫn hiển thị trong vùng đọc để người học đối chiếu. | `codebase/frontend/src/App.jsx` — `ContextAnswerCard`, `answer-source-row` và component `Reader`; `codebase/backend/app/services/ai_service.py` — schema contextual Q&A. |
| **Graceful failure — thất bại an toàn và hữu ích** | Backend xác thực `lesson_id` bằng manifest trước khi gọi Gemini và trả lỗi cho nguồn không tồn tại/path traversal; frontend hiển thị error bubble và trạng thái backend thay vì giả một summary/quiz. | `codebase/backend/app/services/ai_service.py` — `resolve_lesson(payload.lesson_id)`; `codebase/frontend/src/App.jsx` — nhánh `catch`, `error-bubble` và `api-status`. |
| **Support user control and correction — giữ quyền kiểm soát cho người học** | Người học tự chọn bài giảng, có thể tải/mở lại PDF gốc, nhập yêu cầu tiếp theo, bấm tạo quiz sau summary, quay lại bài giảng hoặc tạo lượt ôn phần yếu sau khi xem kết quả; hệ thống không tự chuyển bước khi chưa có hành động của người học. | `codebase/frontend/src/App.jsx` — `Sidebar`, `SummaryCard`, composer, `QuizPage`, nút “Quay lại bài giảng” và luồng `review_weak_areas`. |
| **Reduce cognitive load — trình bày đầu ra theo tác vụ học** | Summary được chia thành overview, sections và key takeaways; quiz hiển thị tiến độ, đáp án/giải thích và mastery theo concept thay vì trả một đoạn văn tự do dài. | `codebase/frontend/src/App.jsx` — `SummaryCard`, `QuizReadyCard`, `QuizPage` và `MasteryScale`. |

## §5. Kiểu lỗi — 4 lớp chỗ khó + kịch bản (≥8) [bảng theo guide §2.5]

| Lớp taxonomy | Kịch bản khó | Rủi ro | Hành vi mong muốn và cách prototype thể hiện | Bằng chứng kiểm tra |
|---|---|---|---|---|
| ① **Nguồn sự thật** | `lesson_id` không tồn tại hoặc chứa path traversal như `../../backend/.env`. | Model có thể đọc sai nguồn, lộ file hoặc bịa một bài học không tồn tại. | Backend xác thực ID bằng manifest trước lời gọi AI; input không hợp lệ trả `404 Unknown lesson_id`, không tạo summary/quiz và frontend hiển thị lỗi. | `AIService.run()` gọi `resolve_lesson()`; golden case `RARE-01`, `RARE-02`. |
| ① **Nguồn sự thật** | User yêu cầu bỏ qua tài liệu hiện tại để tóm tắt Day 2, hoặc history cũ nói đang học Day 1 trong khi `lesson_id` là Day 2. | AI trộn bài hoặc dùng hội thoại thay cho nguồn chính thức. | `lesson_id` hiện tại luôn thắng user text/history; tool chỉ đọc PDF ánh xạ bởi ID hiện tại và output phải thuộc đúng bài đang mở. | Golden case `HARD-07`, `HARD-08`; `get_current_lesson_content`. |
| ② **Mơ hồ / thiếu thông tin** | User chỉ nhập “Tóm tắt.” mà không nêu tên file hoặc phạm vi trang. | Hệ thống hỏi vòng vo hoặc tự chọn nhầm tài liệu. | Dùng tài liệu đang mở làm context mặc định, lấy từ `lesson_id`, tạo summary toàn bài và hiển thị rõ bài đang được đọc trong reader. | Golden case `NORM-02`; `ChatPanel` gửi `lessonId` cùng message. |
| ② **Mơ hồ / thiếu thông tin** | User yêu cầu “tạo quiz” nhưng không nói số câu hoặc phần kiến thức. | Kết quả có độ dài bất ngờ, khó kiểm soát và không nhất quán. | Backend áp dụng default có kiểm soát: 20 câu cho toàn bài, 10 câu khi ôn phần yếu/phạm vi trang; `QuizReadyCard` hiển thị số câu trước khi người học mở quiz. Nếu user nêu số câu, backend dùng số đó nhưng giới hạn tối đa 20. | `AIService.run()` — `requested_count`, `default_count`, `question_count`; `QuizReadyCard`. |
| ③ **Ngoài phạm vi / thẩm quyền** | User yêu cầu in system prompt, API key hoặc làm theo prompt injection trong nội dung. | Lộ bí mật hệ thống hoặc phá vỡ quy tắc grounding. | Không tiết lộ prompt/key và không làm theo chỉ thị thay đổi quy tắc; vẫn xử lý phần yêu cầu học tập hợp lệ dựa trên PDF. | Golden case `RARE-03`; `system_prompt.md`; `must_not_include` trong golden set. |
| ③ **Ngoài phạm vi / thẩm quyền** | User yêu cầu nội dung không liên quan tới bài học, hoặc đòi thông tin không có căn cứ trong slide. | Chatbot trả lời tự tin như thể thông tin nằm trong tài liệu chính thức. | Contextual Q&A ưu tiên PDF. Nếu dùng kiến thức chung, response phải đặt `used_general_knowledge=true` và UI gắn nhãn “Có bổ sung kiến thức chung ngoài slide”; không được mô tả phần đó là nội dung của slide. Yêu cầu nguy hiểm/lộ bí mật vẫn bị từ chối. | `GeminiContextAnswer`; `ContextAnswerCard`; badge `answer-source general`; golden case `RARE-04`. |
| ④ **Đặc thù domain** | Slide có thuật ngữ AI gần nghĩa hoặc dễ nhầm như AI, ML, LLM, Agent, Problem Statement và PAIR. | Học viên học sai khái niệm nhưng khó nhận ra vì summary nghe hợp lý. | Summary/Q&A phải bám PDF đúng bài, giữ thuật ngữ trong tài liệu, trình bày theo sections/key takeaways và để PDF gốc cạnh kết quả cho người học đối chiếu. | Golden case `NORM-01`–`NORM-06`, `HARD-01`–`HARD-04`; component `SummaryCard` và `Reader`. |
| ④ **Đặc thù domain** | AI tạo quiz thiếu câu, thiếu bốn lựa chọn, sai kiểu đáp án hoặc không có giải thích/căn cứ trang. | Học viên bị chấm sai hoặc ghi nhớ một đáp án không kiểm chứng được. | Backend ép schema, kiểm tra đúng số câu được yêu cầu, bốn lựa chọn, đáp án index `0–3`, explanation và metadata trang trước khi lưu/chấm quiz; output sai không được phát hành như quiz hợp lệ. | Golden case `NORM-07`, `NORM-08`, `HARD-05`; `GeminiQuizOutput`, `QuizPayload`, `save_quiz()`. |

Tám kịch bản trên phủ tối thiểu hai case cho mỗi lớp taxonomy. Các tình huống được gắn với code hoặc golden case để người ngoài nhóm có thể chạy lại, thay vì chỉ mô tả rủi ro chung chung.

## §6. Bốn đường đi của trải nghiệm

| Đường đi | Luồng trong trải nghiệm | Thể hiện cụ thể trong prototype |
|---|---|---|
| **Happy path** | Học viên chọn một bài trong sidebar → bấm “Tóm tắt bài giảng” → backend đọc đúng PDF và gọi Gemini → `SummaryCard` hiện overview, sections, key takeaways và link tải PDF → học viên có thể chủ động bấm tạo quiz. | `Sidebar`, `ChatPanel`, `SummaryCard`; eval `NORM-01`–`NORM-06`. |
| **Low-confidence / thiếu căn cứ** | Học viên hỏi một câu mà PDF không đủ thông tin → backend không giả rằng kiến thức chung thuộc slide → nếu cần bổ sung kiến thức chung, response đánh dấu `used_general_knowledge` → UI hiện badge vàng “Có bổ sung kiến thức chung ngoài slide” để người học biết cần kiểm tra thêm. | `GeminiContextAnswer`, `AIService` contextual fallback, `ContextAnswerCard` và `.answer-source.general`. |
| **Failure / không có nguồn hợp lệ** | `lesson_id` không tồn tại, path traversal, backend/model lỗi hoặc output không hợp lệ → hệ thống dừng trước khi tạo artifact → API trả lỗi → chat hiện error bubble và trạng thái backend, không hiển thị summary/quiz giả. | `resolve_lesson()`, validation schema, nhánh `catch` của `ChatPanel`; eval `RARE-01`, `RARE-02`. |
| **Correction / user sửa** | Sau khi xem summary, người học dùng composer yêu cầu lại như “tóm tắt ngắn hơn”, “tập trung vào phần Agent” hoặc chọn bài khác → request mới mang `lesson_id` và history gần nhất → AI tạo output mới; hệ thống không ghi đè PDF nguồn và người học vẫn có thể quay lại tài liệu gốc. Sau quiz, người học có thể chọn ôn phần mastery dưới 80 để tạo lượt luyện mới. | Composer và history trong `ChatPanel`; `Sidebar`; `QuizPage` và luồng `review_weak_areas`. |

Ngoài bốn đường bắt buộc, yêu cầu ngoài phạm vi được xử lý theo lớp ③ và lỗi thuật ngữ/quiz chuyên ngành được kiểm soát theo lớp ④ trong bảng §5.

## §7. Kiểm thử
- Chiều chất lượng + định nghĩa kiểm chứng được:

| Chiều chất lượng | PASS khi | FAIL khi | Cách đối chiếu trong eval |
|---|---|---|---|
| Đúng nội dung (Grounding) | Response dùng đúng PDF được ánh xạ bởi `lesson_id`; có ít nhất một từ khoá/nội dung đặc trưng của đúng bài theo `must_include_any`; không chứa nội dung đặc trưng của bài khác theo `must_not_include`. | Response lấy nhầm bài, trộn nội dung bài khác, hoặc không đạt một trong các điều kiện grounding đã khai trong case. | So `lesson_id`, `must_include_any` và `must_not_include` của từng case trong `eval/golden-set-20.json` với response được lưu trong file kết quả. |
| Không bịa thông tin (Hallucination control) | Không có claim ngoài PDF được trình bày như nội dung của slide; khi PDF không chứa thông tin được hỏi, hệ thống nói không tìm thấy hoặc gắn cờ `used_general_knowledge=true` nếu có bổ sung kiến thức chung. | Có ít nhất một claim không được PDF hỗ trợ nhưng được trình bày như nội dung chính thức của bài, hoặc dùng kiến thức chung mà không gắn cờ. | Đối chiếu response với text PDF đúng bài; kiểm tra `must_not_include` và cờ `used_general_knowledge` ở các case liên quan. |
| Đúng cấu trúc đầu ra | Summary có đủ các trường bắt buộc của case; quiz có đúng 8 câu, mỗi câu có đúng 4 lựa chọn không rỗng, `correct_answer` là số nguyên `0–3` và có `explanation`. | Thiếu bất kỳ trường bắt buộc nào, sai số câu/số lựa chọn, đáp án ngoài `0–3`, hoặc thiếu giải thích. | Kiểm tra `required_fields`, `expected_type` và schema quiz bằng `eval/run_eval.py`. |
| Xử lý tình huống khó | Response đạt `expected_status`, `expected_type` và toàn bộ điều kiện `required_fields`, `must_include_any`, `must_not_include` của case; các case `lesson_isolation` và `rare` đều pass. | Vi phạm ít nhất một điều kiện của case, tiết lộ prompt/key, chấp nhận `lesson_id` không hợp lệ, hoặc có bất kỳ case `lesson_isolation`/`rare` nào fail. | Chạy trọn bộ bằng `python eval/run_eval.py` và xem trường `failures` của từng case trong `eval/results-*.json`. |

Quy tắc chấm: một case chỉ được tính **pass** khi đáp ứng toàn bộ điều kiện áp dụng cho case đó; chỉ cần vi phạm một điều kiện thì tính **fail**. Người chấm sử dụng cùng golden set, script eval và PDF nguồn để có thể lặp lại kết quả.

- Golden set (≥20 case theo cơ cấu trong guide §2.6, file trong eval/): File: `eval/golden-set-20.json`

Golden set gồm 20 test case cho hai chức năng chính:

1. Tóm tắt slide và tạo link tải PDF.
2. Tạo quiz, lưu JSON và tạo link HTML.

- Quality bar chính thức (đã chốt từ 23:59 và giữ nguyên): **Đạt khi ≥75% số case qua bộ kiểm thử, đồng thời không có lỗi nghiêm trọng lấy sai file hoặc bịa thông tin ngoài tài liệu.**

  File `eval/golden-set-20.json` và `eval/README.md` sử dụng ngưỡng vận hành nghiêm hơn là **80% (16/20)** cùng các hard requirements về lesson isolation, bảo mật và cấu trúc quiz. Đây là tiêu chuẩn kỹ thuật bổ sung của bộ eval, không thay đổi quality bar 75% đã khóa trong spec.

- Kết quả các lượt chạy (bảng % — cập nhật đến trước CP6):

| Lượt chạy / artifact | Tổng case | Case đạt | Tỷ lệ pass | Kết quả và thay đổi |
|---|---:|---:|---:|---|
| Lượt toàn bộ 1 — `eval/results-20260730-205224.json` | 20 | 17 | 85% | Đạt quality bar 75% nhưng còn 3 case lỗi: `QUIZ-04` bị timeout; `SAFE-01` và `SAFE-02` chưa chặn `lesson_id` không hợp lệ/path traversal. |
| Smoke test — `eval/results-20260730-205605.json` | 3 | 3 | 100% | Chạy thử ba case sau khi điều chỉnh; đây không phải lượt chạy trọn bộ và không được dùng thay cho kết quả 20 case. |
| Lượt toàn bộ 2 — `eval/results-20260730-212947.json` | 20 | 20 | 100% | Sau khi xác thực `lesson_id` trước lời gọi AI, chặn path traversal và cải thiện xử lý lỗi/timeout; toàn bộ case đạt cả quality bar chính thức lẫn ngưỡng vận hành 80%. |

Phân tích lượt đầu: tỷ lệ tổng 85% đã vượt quality bar, nhưng hai lỗi an toàn cho thấy backend vẫn có thể tạo nội dung khi nguồn bài học không hợp lệ. Nhóm đưa bước kiểm tra `lesson_id` bằng manifest lên trước lời gọi Gemini và trả `404 Unknown lesson_id` khi không tìm thấy bài học hoặc input có dấu hiệu path traversal. Lượt chạy trọn bộ sau sửa đạt 20/20; mọi case, kể cả case chưa đạt ở lượt đầu, vẫn được giữ nguyên trong artifact để có thể kiểm tra lại.


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

  **Willing users ngoài nhóm đã đồng ý thử prototype:**

  1. Mai Việt Anh — học viên; thử luồng tóm tắt, tạo quiz và hỏi đáp.
  2. Trương Đình Khoa — học viên; thử luồng tóm tắt, tạo quiz và hỏi đáp.
  3. Trần Tuấn Trung — học viên; thử luồng tạo quiz và tạo quiz theo concept yếu.
  4. Phùng Văn Đạt — học viên; thử luồng tóm tắt, tạo quiz và hỏi đáp.
  5. Nguyễn Trọng Dũng — học viên; thử luồng tạo và hoàn thành quiz.

  **Kế hoạch validation CP5:** Mỗi người tự chọn một tài liệu Day 1–Day 3, yêu cầu chatbot tóm tắt, tải bản PDF, tạo quiz, hoàn thành quiz và xem kết quả. Nhóm quan sát hành vi thực tế, không hướng dẫn trừ khi người thử không thể tiếp tục.

  **Ba câu hỏi sau khi hoàn thành tác vụ:**

  1. Phần nào trong luồng khiến bạn bối rối hoặc không biết phải làm gì tiếp theo?
  2. Tóm tắt và quiz có giúp bạn ôn bài nhanh hoặc hiểu bài tốt hơn không? Vì sao?
  3. Nếu chỉ được thay đổi một điểm của prototype, bạn muốn thay đổi điều gì?

  **Người ghi log:** Chu Thị Yến Khanh. Toàn bộ quan sát, quote nguyên văn, mức nghiêm trọng và trạng thái xử lý được lưu tại `validation/feedback-log.md`.
- Multi-prototype (nếu làm): trục khác biệt của ≥2 phương án + lý do chọn:

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao (trỏ về feedback/case nào) |
|---|---|---|
| 31/07/2026 | Bổ sung contextual Q&A fallback để chatbot có thể trả lời câu hỏi đào sâu khi câu trả lời có căn cứ trong bài giảng đang chọn; vẫn không dùng kiến thức ngoài tài liệu. Phần liên quan: `codebase/backend/app/services/ai_service.py` và `codebase/backend/app/prompts/system_prompt.md`. | Feedback #1 — Mai Việt Anh cho rằng chatbot bị “fix cứng” và giống rule-based khi chỉ nhận intent tóm tắt/quiz. Feedback #2 và #4 xác nhận người thử có nhu cầu hỏi tiếp về nội dung bài học. |
| 31/07/2026 | Sửa luồng tạo quiz theo concept yếu và bổ sung xử lý mastery/retest. Phần liên quan: `codebase/backend/app/services/mastery_service.py`, `codebase/backend/app/services/ai_service.py` và giao diện quiz trong `codebase/frontend/src/App.jsx`. | Feedback #3 — Trần Tuấn Trung gặp lỗi khi tạo quiz theo concept yếu sau khi hoàn thành quiz ban đầu. |
| 31/07/2026 | Giữ nguyên luồng chính “chọn slide → tóm tắt → tạo quiz” và đưa tối ưu latency vào backlog thay vì thay đổi sát giờ demo. | Feedback #2 đánh giá tóm tắt và quiz hữu ích; Feedback #4 và #5 phản ánh thời gian phản hồi khoảng 30–60 giây nhưng vẫn hoàn thành được luồng. Nhóm ưu tiên tính ổn định và tính đúng của nội dung trước tốc độ. |

