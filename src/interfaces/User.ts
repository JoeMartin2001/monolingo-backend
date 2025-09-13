import { registerEnumType } from '@nestjs/graphql';

// Enum for CEFR levels
export enum LanguageLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

registerEnumType(LanguageLevel, {
  name: 'LanguageLevel', // 👈 GraphQL schema type name
  description: 'CEFR language proficiency levels',
});

// User account
export interface IUser {
  id: string;
  email: string;
  username: string;
  nativeLanguage: string; // e.g., "uz", "en"
  targetLanguage: string; // e.g., "en", "de"
  level: LanguageLevel; // starting level (A1–C2)

  bio?: string;
  avatarUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

export enum IUserRole {
  STUDENT = 'student',
  TUTOR = 'tutor',
}

registerEnumType(IUserRole, {
  name: 'IUserRole', // 👈 GraphQL schema type name
  description: 'User roles',
});
