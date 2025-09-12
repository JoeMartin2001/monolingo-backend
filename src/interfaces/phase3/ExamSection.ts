// Exam sections (listening, reading, writing, speaking)
export interface IExamSection {
  id: string;
  examId: string; // FK -> Exam
  type: 'listening' | 'reading' | 'writing' | 'speaking';
  title: string;
  instructions: string;
  createdAt: Date;
}
