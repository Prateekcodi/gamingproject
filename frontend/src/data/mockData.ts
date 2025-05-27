import { StudySession, Subject, User } from '../types';
import { generateId } from '../utils/helpers';

const generatePastDates = (days: number) => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

const pastDates = generatePastDates(30);

export const subjects: Subject[] = [
  { id: '1', name: 'Mathematics', color: '#4F46E5' },
  { id: '2', name: 'Physics', color: '#0D9488' },
  { id: '3', name: 'Computer Science', color: '#7E22CE' },
  { id: '4', name: 'Literature', color: '#F59E0B' },
  { id: '5', name: 'History', color: '#EF4444' },
  { id: '6', name: 'Chemistry', color: '#10B981' },
];

const moods = ['focused', 'tired', 'motivated', 'distracted', 'neutral'] as const;

export const generateMockSessions = (): StudySession[] => {
  return [];
};

export const mockUser: User = {
  id: '1',
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
  currentStreak: 0,
  longestStreak: 0,
  totalStudyHours: 0
};