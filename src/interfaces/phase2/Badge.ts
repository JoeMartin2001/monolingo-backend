import { LanguageLevel } from '../User';

// Language level badges
export interface IBadge {
  id: string;
  userId: string; // FK -> User
  language: string;
  level: LanguageLevel;
  source: 'ai' | 'peer' | 'tutor' | 'exam'; // who granted the badge
  grantedAt: Date;
}
