export interface Subject {
  id: string;
  name: string;
  color: string;
  chapters: Chapter[];
  examDate: string;
  priority: number;
}
export interface Chapter {
  id: string;
  name: string;
  difficulty: string;
  estimatedHours: number;
  completed: boolean;
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
  // other properties...
}

// (Remove this duplicate interface declaration)

export interface DailyAvailability {
  day: string;
  availableHours: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  chapterId: string;
  date: string;
  duration: number;
  completed: boolean;
  mood?: string;
  notes?: string;
}

export interface StudyPlan {
  subjects: Subject[];
  availability: DailyAvailability[];
  sessions: StudySession[];
}
