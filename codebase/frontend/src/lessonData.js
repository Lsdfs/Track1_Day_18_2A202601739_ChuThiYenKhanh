export const lessonData = {
  id: "day02-business-problem-for-ai",
  title: "Xác định bài toán kinh doanh cho AI",
  fileName: "Day02 - Xác định bài toán kinh doanh - Teacher.pdf",
  pdfUrl: "/Day02-business-problem.pdf",
  triggerMessage: "tóm tắt cho tôi bài giảng hiện tại",
  loadingMessage: "Đang phân tích nội dung bài giảng...",
  summary: {
    greeting: "Dưới đây là bản tóm tắt bài giảng “Xác định bài toán kinh doanh cho AI”:",
    overview:
      "Bài học hướng dẫn cách chọn đúng bài toán, đúng mức tự động hóa và thiết lập các gate kỹ thuật trước khi xây dựng một sản phẩm AI.",
    sections: [
      ["Chọn bài toán trước khi chọn công nghệ", "Một dự án AI thường không thất bại vì thiếu model, mà vì chọn sai bài toán, sai kiến trúc hoặc không đặt tiêu chí dừng đúng lúc. Team cần xác định rõ actor, workflow hiện tại, bottleneck và tác động có thể đo lường."],
      ["Không phải tác vụ nào cũng cần Agent", "Tác vụ có input ổn định và logic rõ nên dùng rule hoặc workflow. Tác vụ tổng hợp, tóm tắt hoặc sinh văn bản linh hoạt có thể dùng LLM feature. Chỉ dùng Agent khi bài toán có nhiều bước, nhiều công cụ và trạng thái thay đổi."],
      ["Ưu tiên giải pháp đơn giản nhất", "Bắt đầu từ rule hoặc workflow, sau đó mới cân nhắc LLM feature và Agent. Chỉ tăng độ phức tạp khi giá trị bổ sung lớn hơn chi phí, rủi ro và độ khó vận hành."],
      ["Sáu giai đoạn của AI Product Lifecycle", "Quy trình gồm Problem Scoping, Data Readiness, Baseline hoặc Model Choice, Build & Eval, Deploy Controls, cuối cùng là Monitor & Iterate. Giữa các giai đoạn cần có gate để quyết định tiếp tục hay dừng."],
      ["Metric, baseline và eval là bắt buộc", "Không có metric thì không biết hệ thống có tạo giá trị hay không. Không có baseline thì không biết AI cần tốt hơn phương pháp nào. Không có bộ eval thì sản phẩm mới chỉ là demo."],
      ["Cấu tạo của một AI System", "Một hệ thống AI có thể gồm Model, Context, Planning và Tools, được điều phối bởi system logic. Mỗi thành phần tạo thêm giá trị nhưng cũng kéo theo các failure mode riêng."],
      ["Problem Statement phải đủ chặt", "Problem Statement cần chỉ rõ actor, current workflow, bottleneck, impact, success metric và operational boundary; đồng thời giúp suy ra test case và eval metric."],
      ["Kiểm tra AI Readiness và Feasibility", "Trước khi build, cần kiểm tra giá trị kinh doanh, baseline, dữ liệu, khả năng đánh giá, mức chấp nhận sai, latency, chi phí, logging, rollback và người chịu trách nhiệm."]
    ],
    keyTakeaways: [
      "Đúng kiến trúc quan trọng hơn việc chọn model mạnh.",
      "Bắt đầu từ rule hoặc workflow trước khi nghĩ đến Agent.",
      "AI Product Lifecycle là một chuỗi gate, không phải build xong rồi mới kiểm tra.",
      "Problem Statement phải dẫn được đến metric, eval plan và system boundary.",
      "Feasibility phải xét cả kỹ thuật, vận hành và giá trị kinh doanh."
    ]
  },
  questions: [
    ["Theo bài giảng, điều gì thường khiến dự án AI thất bại?", ["Không sử dụng model lớn nhất", "Chọn sai bài toán, sai kiến trúc hoặc không đặt gate phù hợp", "Không sử dụng giao diện chatbot", "Không xây dựng Agent ngay từ đầu"], 1, "Dự án AI hiếm khi thất bại vì không có model; nguyên nhân thường nằm ở bài toán, kiến trúc và gate."],
    ["Tác vụ nào phù hợp nhất với rule hoặc workflow thông thường?", ["Tác vụ có input ổn định và logic rõ ràng", "Tác vụ cần tự chọn nhiều công cụ", "Tác vụ có trạng thái thay đổi liên tục", "Tác vụ cần lập kế hoạch động nhiều bước"], 0, "Rule hoặc workflow phù hợp khi đầu vào ổn định, quy tắc rõ và cần đầu ra có tính dự đoán cao."],
    ["Khi nào team nên nghiêm túc cân nhắc sử dụng Agent?", ["Khi chỉ cần tóm tắt một đoạn văn", "Khi chỉ cần đổi tên file theo quy tắc", "Khi cần tự chọn nhiều bước, gọi nhiều tool và xử lý feedback loop", "Khi muốn giao diện trông hiện đại hơn"], 2, "Agent thực sự cần thiết khi workflow động, nhiều bước, nhiều công cụ và cần xử lý phản hồi."],
    ["Giai đoạn đầu tiên trong AI Product Lifecycle là gì?", ["Deploy Controls", "Build & Eval", "Problem Scoping", "Monitor & Iterate"], 2, "Trước khi chọn dữ liệu hay model, team cần xác định rõ actor, workflow, pain và metric."],
    ["Vì sao một hệ thống cần baseline trước khi build AI?", ["Để biết AI cần tốt hơn phương pháp hiện tại ở điểm nào", "Để tăng số lượng token sử dụng", "Để không cần xây dựng bộ test", "Để có thể bỏ qua việc đo metric"], 0, "Baseline cho biết hệ thống AI phải cải thiện so với rule, workflow hoặc con người hiện tại như thế nào."],
    ["Thành phần nào giúp AI System dựa trên tài liệu hoặc trạng thái bên ngoài?", ["Context", "Planning", "User Interface", "CSS"], 0, "Context có thể đến từ RAG, memory, tài liệu hoặc dữ liệu trạng thái bên ngoài."],
    ["Một Problem Statement tốt cần có thành phần nào?", ["Tên model sẽ sử dụng", "Actor, workflow, bottleneck, impact, metric và boundary", "Số lượng màn hình của ứng dụng", "Ngôn ngữ lập trình của backend"], 1, "Problem Statement cần mô tả vấn đề có thể đo được và giới hạn rõ hệ thống được phép làm gì."],
    ["Nếu không có logging, rollback và người chịu trách nhiệm khi output sai, team đang thiếu gì?", ["Deploy Controls", "Prompt dài hơn", "Model có nhiều tham số hơn", "Giao diện responsive"], 0, "Deploy Controls cần có logging, approval, rollback và owner of failure."]
  ].map(([question, options, correct, explanation], index) => ({
    id: index + 1, question, options, correct, explanation
  }))
};
