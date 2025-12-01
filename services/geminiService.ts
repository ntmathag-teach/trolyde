
import { GoogleGenAI } from "@google/genai";
import { ExamConfig, DetailedTopic, DifficultyDistribution } from "../types";

const calculateTotal = (dist: DifficultyDistribution) => {
  return dist.nb + dist.th + dist.vd + dist.vdc;
};

const calculateTopicTotal = (dist: DifficultyDistribution) => {
  return dist.nb + dist.th + dist.vd + dist.vdc;
};

const formatTopicsForPrompt = (topics: DetailedTopic[]) => {
    if (!topics || topics.length === 0) return "Tự chọn các chủ đề phù hợp với chương trình.";
    return topics.map((t, idx) => 
        `   - Chuyên đề: "${t.name}" (Số lượng: ${calculateTopicTotal(t.distribution)} câu). Phân bố: ${t.distribution.nb} NB, ${t.distribution.th} TH, ${t.distribution.vd} VD, ${t.distribution.vdc} VDC.`
    ).join('\n    ');
};

export const generateExamLatex = async (config: ExamConfig, apiKey: string): Promise<string> => {
  if (!apiKey) {
      throw new Error("Vui lòng nhập API Key để tiếp tục.");
  }

  // Initialization using the user-provided key (BYOK)
  const ai = new GoogleGenAI({ apiKey: apiKey });

  // Tính toán tổng số lượng câu hỏi cho mỗi phần để hiển thị trong prompt
  const part1Total = config.useDetailedTopics 
    ? config.part1Topics.reduce((acc, t) => acc + calculateTopicTotal(t.distribution), 0)
    : calculateTotal(config.multipleChoice);

  const part2Total = config.useDetailedTopics 
    ? config.part2Topics.reduce((acc, t) => acc + calculateTopicTotal(t.distribution), 0)
    : config.trueFalse;
  
  const part3Total = config.useDetailedTopics 
    ? config.part3Topics.reduce((acc, t) => acc + calculateTopicTotal(t.distribution), 0)
    : calculateTotal(config.shortAnswer);


  // Xây dựng nội dung từng phần dựa trên chế độ (Simple vs Detailed)
  const part1Content = config.useDetailedTopics 
    ? `CẤU TRÚC CHI TIẾT THEO CHUYÊN ĐỀ:\n    ${formatTopicsForPrompt(config.part1Topics)}`
    : `Phân bố mức độ: Nhận biết: ${config.multipleChoice.nb}, Thông hiểu: ${config.multipleChoice.th}, Vận dụng: ${config.multipleChoice.vd}, Vận dụng cao: ${config.multipleChoice.vdc}.`;

  const part2Content = config.useDetailedTopics
    ? `DANH SÁCH CÁC CÂU HỎI THEO CHUYÊN ĐỀ:\n    ${formatTopicsForPrompt(config.part2Topics)}\n    (Lưu ý: Tổng số lượng chuyên đề tương ứng với số lượng câu hỏi lớn)`
    : `Số lượng câu hỏi lớn: ${config.trueFalse} câu.`;

  const part3Content = config.useDetailedTopics
    ? `CẤU TRÚC CHI TIẾT THEO CHUYÊN ĐỀ:\n    ${formatTopicsForPrompt(config.part3Topics)}`
    : `Phân bố mức độ: Nhận biết: ${config.shortAnswer.nb}, Thông hiểu: ${config.shortAnswer.th}, Vận dụng: ${config.shortAnswer.vd}, Vận dụng cao: ${config.shortAnswer.vdc}.`;


  // LƯU Ý: Phải escape dấu backslash (\\) trong chuỗi để tránh lỗi SyntaxError
  const prompt = `
    Đóng vai trò là một giáo viên giỏi và một chuyên gia về LaTeX.
    Nhiệm vụ của bạn là tạo ra một mã nguồn LaTeX hoàn chỉnh (full document) cho một đề kiểm tra chất lượng cao, bám sát cấu trúc đề thi Tốt nghiệp THPT từ năm 2025.

    THÔNG TIN ĐỀ THI:
    - Đơn vị/Trường: ${config.schoolName}
    - Tiêu đề đề thi: ${config.examTitle}
    - Môn học: ${config.subject}
    - Lớp: ${config.grade}
    - Bộ sách: ${config.book}
    - Chủ đề bao quát / Nội dung trọng tâm: ${config.topic || "Tổng hợp kiến thức"}
    
    CẤU TRÚC ĐỀ THI (Theo định dạng mới 2025):
    
    PHẦN 1. Trắc nghiệm nhiều lựa chọn (Khoảng ${part1Total} câu):
       - Gồm các câu hỏi có 4 phương án A, B, C, D (chỉ chọn 1 đúng).
       - ${part1Content}
    
    PHẦN 2. Trắc nghiệm Đúng/Sai (Khoảng ${part2Total} câu hỏi lớn):
       - ${part2Content}
       - Mỗi câu hỏi lớn bao gồm 4 ý nhỏ a), b), c), d).
       - YÊU CẦU ĐẶC BIỆT VỀ LOGIC (QUAN TRỌNG): Các ý a, b, c, d phải được sắp xếp theo độ khó tăng dần (lũy tiến).
         + Ý a, b: Mức độ Nhận biết, Thông hiểu.
         + Ý c, d: Mức độ Vận dụng, Vận dụng cao (Các ý sau thường sử dụng kết quả hoặc dữ kiện của ý trước).
       - Nội dung các ý phải liên quan mật thiết với nhau (Logic chùm câu hỏi).
    
    PHẦN 3. Trắc nghiệm trả lời ngắn (Khoảng ${part3Total} câu):
       - Học sinh tự điền đáp án số.
       - ${part3Content}
       - ƯU TIÊN ĐẶC BIỆT: Các câu hỏi mang tính VẬN DỤNG THỰC TẾ (Real-world application), bài toán thực tế, liên môn (Lý, Hóa, Sinh) hoặc mô hình hóa toán học.

    YÊU CẦU KỸ THUẬT QUAN TRỌNG (BẮT BUỘC TUÂN THỦ):
    1. Output phải là mã LaTeX thuần túy, có thể biên dịch ngay trên TexStudio hoặc Overleaf.
    2. Sử dụng \\documentclass{article}.
    3. BẮT BUỘC sử dụng các package sau trong Preamble (ĐẦY ĐỦ CÁC GÓI HÌNH HỌC): 
       - \\usepackage[utf8]{vietnam}
       - \\usepackage{amsmath,amssymb,amsfonts,mathrsfs}
       - \\usepackage{tikz,pgfplots} 
       - \\usepackage{tkz-euclide} (QUAN TRỌNG: Để vẽ hình học phẳng chuẩn xác)
       - \\usepackage{tkz-tab} (Để vẽ bảng biến thiên)
       - \\usepackage{geometry}
       - \\usepackage{enumitem}
       - \\usepackage{multicol}
       - \\usepackage{tasks} (Để hiển thị các lựa chọn trắc nghiệm)

    4. CẤU HÌNH GÓI TASKS (Tinh chỉnh khoảng cách & THỤT LỀ):
       - Thêm dòng này vào sau \\begin{document} hoặc trong Preamble:
         \\settasks{label=\\textbf{\\Alph*.}, label-width=1.5em, label-offset=0.5em, item-indent=2cm}
       - 'item-indent=2cm' để đảm bảo đáp án A thụt vào trong (Tab) so với lề trái.

    5. QUY TẮC HIỂN THỊ CÔNG THỨC TOÁN (NGHIÊM NGẶT):
       - Phân số: LUÔN LUÔN dùng lệnh \\dfrac{...}{...}.
       - Giới hạn, Tích phân, Max, Min: LUÔN LUÔN thêm \\limits (VD: \\lim\\limits_{...}, \\int\\limits_{...}).
       - Trị tuyệt đối: LUÔN LUÔN dùng cặp lệnh \\left| ... \\right| thay vì dùng dấu | đơn thuần.
       
       - VECTƠ (QUY TẮC THÔNG MINH):
         + Nếu tên vectơ chỉ có 1 chữ cái (VD: u, v, x, a, b...): Dùng lệnh \\vec{...} (VD: \\vec{u}, \\vec{n}).
         + Nếu tên vectơ có 2 chữ cái trở lên (VD: AB, MN, ABC...): Dùng lệnh \\overrightarrow{...} (VD: \\overrightarrow{AB}).
       
       - NGẮT DÒNG CÔNG THỨC (QUAN TRỌNG):
         + Khi liệt kê các công thức toán học hoặc vectơ liên tiếp nhau bằng dấu phẩy trong văn bản (text mode), KHÔNG ĐƯỢC gộp chung vào một cặp dấu $.
         + PHẢI TÁCH RIÊNG từng công thức.
         + Ví dụ ĐÚNG: $\\overrightarrow{AB}$, $\\overrightarrow{AC}$, $\\overrightarrow{AD}$.

    6. QUY TẮC VỀ ĐỒ THỊ VÀ HÌNH VẼ (AN TOÀN & CHÍNH XÁC - NO TIKZ-3DPLOT):
       - Đồ thị hàm số: Phải đi qua các điểm có tọa độ rõ ràng, hiển thị số trên trục. Đỉnh parabol, giao điểm trục tung/hoành phải được đánh dấu hoặc có tọa độ nguyên dễ nhìn.
       
       - HÌNH Oxyz (QUAN TRỌNG - CHUẨN SÁCH GIÁO KHOA VN):
         + TUYỆT ĐỐI KHÔNG dùng gói \`tikz-3dplot\` hay lệnh \`tdplot_main_coords\` để tránh lỗi biên dịch và hình xấu.
         + Hãy vẽ bằng TikZ thuần với hệ tọa độ giả lập được cấu hình thủ công như sau (Copy y nguyên dòng này):
           \\begin{tikzpicture}[line join=round, line cap=round, >=stealth, x={(-0.5cm,-0.5cm)}, y={(1cm,0cm)}, z={(0cm,1cm)}, scale=1]
         + Giải thích hệ trục này: Trục z hướng lên (0,1), trục y hướng sang phải (1,0), trục x hướng chéo xuống góc trái (-0.5,-0.5). Đây là góc nhìn chuẩn trong SGK Toán Việt Nam.
         + Định nghĩa các điểm bằng tọa độ 3D: \\coordinate (A) at (1,2,3);
         + Vẽ trục tọa độ thủ công:
           \\draw[->] (-1,0,0) -- (4,0,0) node[below left] {$x$};
           \\draw[->] (0,-1,0) -- (0,4,0) node[below right] {$y$};
           \\draw[->] (0,0,-1) -- (0,0,4) node[above] {$z$};

       - Bảng biến thiên (tkz-tab): BẮT BUỘC đặt trong môi trường \\begin{tikzpicture} ... \\end{tikzpicture}.
       - Hình học phẳng: Ưu tiên dùng gói tkz-euclide (\\tkzDefPoint, \\tkzDrawSegments...).

    7. ĐỊNH DẠNG CÂU HỎI VÀ ĐÁP ÁN (TASKS THÔNG MINH):
       
       PHẦN 1 (Trắc nghiệm nhiều lựa chọn):
       - Bắt đầu bằng: \\noindent\\textbf{Câu <số>.} <Nội dung câu hỏi>
       - Các lựa chọn A, B, C, D dùng môi trường 'tasks'.
       - QUAN TRỌNG (TRÁNH LỖI OVERLAP):
         + Nếu các đáp án RẤT NGẮN (số, chữ cái): Dùng \\begin{tasks}(4)
         + Nếu các đáp án TRUNG BÌNH: Dùng \\begin{tasks}(2)
         + Nếu các đáp án DÀI (biểu thức toán, vectơ dài): BẮT BUỘC dùng \\begin{tasks}(1) để xuống dòng.

       PHẦN 2 (Trắc nghiệm Đúng/Sai):
       - Bắt đầu bằng: \\noindent\\textbf{Câu <số>.} <Nội dung dẫn>
       - Các ý a), b), c), d) BẮT BUỘC dùng môi trường enumerate với label a), b)...:
         \\begin{enumerate}[label=\\alph*)]
           \\item <Nội dung ý a>
           \\item <Nội dung ý b>
           \\item <Nội dung ý c>
           \\item <Nội dung ý d>
         \\end{enumerate}

    8. SẠCH SẼ TUYỆT ĐỐI (QUAN TRỌNG NHẤT):
       - CHỈ TRẢ VỀ CODE LATEX.
       - KHÔNG VIẾT BẤT KỲ DÒNG CHỮ DẪN NHẬP NÀO (VD: "Đây là code...", "Dưới đây là...").
       - BẮT ĐẦU FILE NGAY VỚI \\documentclass.
       - KHÔNG xuất hiện lời bình dẫn ("Lưu ý...", "Chỉnh sửa...").

    9. Header:
       - Góc trái: \\textbf{${config.schoolName.toUpperCase()}}
       - Góc phải: \\textbf{Môn: ${config.subject}}
       - Giữa: \\textbf{${config.examTitle.toUpperCase()}}
    
    10. LỜI GIẢI CHI TIẾT (NẾU CÓ):
       - Phải dùng môi trường \\begin{itemize} hoặc tách dòng rõ ràng bằng \\par.
       - CẤM viết lời giải dính chùm thành đoạn văn.
  `;

  try {
    const modelName = config.useDeepThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
    const thinkingBudget = config.useDeepThinking ? 16384 : 0; 

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: thinkingBudget }
      }
    });

    let text = response.text || "";
    
    // Clean up markdown code blocks
    text = text.replace(/^```(latex|tex)?/i, '').replace(/```$/i, '');

    // Strict cleaning: Only keep content from \documentclass to \end{document}
    const startIdx = text.indexOf('\\documentclass');
    if (startIdx !== -1) {
        text = text.substring(startIdx);
    }
    
    const endIdx = text.lastIndexOf('\\end{document}');
    if (endIdx !== -1) {
        text = text.substring(0, endIdx + 14); // Keep \end{document} length
    }

    // Secondary cleanup just in case
    text = text.replace(/^\s*\(.*(chỉnh sửa|lưu ý|đáp án).*\)\s*$/gim, '');
    text = text.trim();

    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    if (error.message && (error.message.includes('429') || error.message.includes('Resource has been exhausted'))) {
       throw new Error(`Đã hết lượt dùng (Quota) cho mô hình này. Vui lòng tắt "Deep Thinking" hoặc thử lại sau 1 phút.`);
    }

    throw new Error("Không thể tạo đề bài. Chi tiết lỗi: " + (error.message || "Lỗi không xác định"));
  }
};
