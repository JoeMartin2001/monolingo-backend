// Exam questions
export interface IExamQuestion {
  id: string;
  sectionId: string; // FK -> ExamSection
  type: 'mcq' | 'short' | 'essay' | 'audio';
  prompt: string;
  options?: string[]; // for MCQ
  correctAnswer?: string; // optional (for auto-scoring)
}
