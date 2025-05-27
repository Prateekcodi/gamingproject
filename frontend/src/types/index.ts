export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  date: string;
  mood: 'focused' | 'tired' | 'motivated' | 'distracted' | 'neutral';
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface DailyStats {
  date: string;
  totalMinutes: number;
  sessions: number;
  subjects: {
    [key: string]: number; // subject name: minutes
  };
  averageMood: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currentStreak: number;
  longestStreak: number;
  totalStudyHours: number;
}