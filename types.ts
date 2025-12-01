
export interface DifficultyDistribution {
  nb: number; // Nhận biết
  th: number; // Thông hiểu
  vd: number; // Vận dụng
  vdc: number; // Vận dụng cao
}

export interface DetailedTopic {
  id: string;
  name: string;
  distribution: DifficultyDistribution;
}

export interface ExamConfig {
  schoolName: string;
  examTitle: string;
  subject: string;
  grade: string;
  book: string;
  topic: string; // Used for general context
  useDetailedTopics: boolean; // Toggle between simple inputs and detailed matrix
  
  // Detailed topics per part
  part1Topics: DetailedTopic[]; 
  part2Topics: DetailedTopic[];
  part3Topics: DetailedTopic[];

  // Simple configuration fallback
  multipleChoice: DifficultyDistribution;
  trueFalse: number; 
  shortAnswer: DifficultyDistribution;
  
  useDeepThinking: boolean;
}

export const DEFAULT_DISTRIBUTION: DifficultyDistribution = {
  nb: 0,
  th: 0,
  vd: 0,
  vdc: 0,
};

export const DEFAULT_CONFIG: ExamConfig = {
  schoolName: 'TRƯỜNG THPT CHUYÊN ABC',
  examTitle: 'ĐỀ KIỂM TRA GIỮA KỲ I',
  subject: 'Toán',
  grade: '12',
  book: 'Kết nối tri thức',
  topic: '',
  useDetailedTopics: false,
  
  part1Topics: [],
  part2Topics: [],
  part3Topics: [],

  multipleChoice: { nb: 3, th: 3, vd: 2, vdc: 0 }, 
  trueFalse: 4, 
  shortAnswer: { nb: 1, th: 2, vd: 1, vdc: 0 },
  useDeepThinking: false,
};

export const SUBJECTS = [
  'Toán',
  'Vật Lí',
  'Hóa Học',
  'Sinh Học',
  'Ngữ Văn',
  'Lịch Sử',
  'Địa Lí',
  'Tiếng Anh',
  'Tin Học'
];

export const GRADES = ['6', '7', '8', '9', '10', '11', '12'];

export const BOOKS = [
  'Kết nối tri thức với cuộc sống',
  'Chân trời sáng tạo',
  'Cánh diều',
  'Sách cũ (Chương trình cũ)',
  'Khác'
];
