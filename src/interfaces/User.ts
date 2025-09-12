// Enum for CEFR levels
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// User account
export interface User {
  id: string;
  email: string;
  username: string;
  nativeLanguage: string; // e.g., "uz", "en"
  targetLanguage: string; // e.g., "en", "de"
  level: LanguageLevel; // starting level (A1–C2)
  bio?: string;
  avatarUrl?: string;
  isTutor: boolean; // true if switched into tutor mode
  createdAt: Date;
  updatedAt: Date;
}
