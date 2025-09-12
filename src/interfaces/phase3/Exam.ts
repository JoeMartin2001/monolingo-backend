// Exam definition (like IELTS, TOEFL, custom tests)
export interface IExam {
  id: string;
  name: string; // "IELTS Mock Test 1"
  language: string;
  description?: string;
  createdAt: Date;
}
