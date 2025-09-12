// Tutor reviews
export interface IReview {
  id: string;
  tutorId: string;
  studentId: string;
  rating: number; // 1–5
  comment?: string;
  createdAt: Date;
}
