// User answers
export interface IExamAnswer {
  id: string;
  attemptId: string; // FK -> ExamAttempt
  questionId: string; // FK -> ExamQuestion
  answer: string; // text/URL to audio file
  isCorrect?: boolean; // for auto-scored questions
  score?: number; // AI/tutor evaluation score
}
