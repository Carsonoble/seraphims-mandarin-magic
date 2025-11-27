export enum AppMode {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  FLASHCARDS = 'FLASHCARDS',
  CONVERSATION = 'CONVERSATION',
  GAME = 'GAME'
}

export enum ProficiencyLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface Flashcard {
  hanzi: string;
  pinyin: string;
  english: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mascot';
  text: string;
  audioUrl?: string; // Placeholder for potential TTS
}

export interface UserState {
  name: string;
  level: ProficiencyLevel;
  points: number;
  streak: number;
  unlockedItems: string[]; // E.g., 'purple-collar', 'golden-bell'
}

export const THEME = {
  primary: 'purple-600',
  secondary: 'purple-400',
  accent: 'amber-400',
  background: 'purple-50',
  text: 'gray-800'
};