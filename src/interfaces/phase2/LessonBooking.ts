// Lesson booking
export interface ILessonBooking {
  id: string;
  tutorId: string; // FK -> TutorProfile
  studentId: string; // FK -> User
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  createdAt: Date;
}
