// Tutor profile (separate table for tutor details)
export interface ITutorProfile {
  id: string;
  userId: string; // FK -> User
  hourlyRate: number; // in USD or your base currency
  bio: string;
  languagesTaught: string[]; // e.g., ["en", "ru"]
  availability?: string; // serialized schedule or Google Calendar sync
  rating?: number; // avg rating from reviews
  createdAt: Date;
}
