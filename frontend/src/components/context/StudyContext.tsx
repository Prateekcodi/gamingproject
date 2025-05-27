import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Subject,
  StudySession,
  Chapter,
  DailyAvailability,
  StudyPlan,
} from "../../types/index copy";
import { calculatePriority, generateStudyPlan } from "../../utils/planner";
import { getRandomColor } from "../../utils/colors";

interface StudyContextType {
  subjects: Subject[];
  availability: DailyAvailability[];
  sessions: StudySession[];
  addSubject: (name: string, examDate: string) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  addChapter: (
    subjectId: string,
    name: string,
    difficulty: "easy" | "medium" | "hard",
    hours: number
  ) => void;
  updateChapter: (subjectId: string, chapter: Chapter) => void;
  deleteChapter: (subjectId: string, chapterId: string) => void;
  updateAvailability: (day: string, hours: number) => void;
  generatePlan: () => void;
  updateSession: (session: StudySession) => void;
  clearData: () => void;
  addSession: (session: StudySession) => void;
  syncStudyPlans: (plans: any[]) => void;
}

const defaultAvailability: DailyAvailability[] = [
  { day: "0", availableHours: 4 }, // Sunday
  { day: "1", availableHours: 2 }, // Monday
  { day: "2", availableHours: 2 }, // Tuesday
  { day: "3", availableHours: 2 }, // Wednesday
  { day: "4", availableHours: 2 }, // Thursday
  { day: "5", availableHours: 2 }, // Friday
  { day: "6", availableHours: 4 }, // Saturday
];

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [availability, setAvailability] =
    useState<DailyAvailability[]>(defaultAvailability);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem("studyPlan");
    if (savedPlan) {
      const plan: StudyPlan = JSON.parse(savedPlan);
      setSubjects(plan.subjects || []);
      setAvailability(plan.availability || defaultAvailability);
      setSessions(plan.sessions || []);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const plan: StudyPlan = {
      subjects,
      availability,
      sessions,
    };
    localStorage.setItem("studyPlan", JSON.stringify(plan));
  }, [subjects, availability, sessions]);

  // Update subject priorities whenever subjects change
  useEffect(() => {
    const updatedSubjects = subjects.map((subject) => ({
      ...subject,
      priority: calculatePriority(subject),
    }));

    if (JSON.stringify(updatedSubjects) !== JSON.stringify(subjects)) {
      setSubjects(updatedSubjects);
    }
  }, [subjects]);

  const addSubject = (name: string, examDate: string) => {
    const color = getRandomColor();
    const newSubject: Subject = {
      id: `subject-${Date.now()}`,
      name,
      color: color.value,
      chapters: [],
      examDate,
      priority: 0, // Will be calculated by effect
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  const updateSubject = (subject: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === subject.id ? subject : s)));
  };

  const deleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    // Remove associated sessions
    setSessions((prev) => prev.filter((s) => s.subjectId !== id));
  };

  const addChapter = (
    subjectId: string,
    name: string,
    difficulty: "easy" | "medium" | "hard",
    hours: number
  ) => {
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      name,
      difficulty,
      estimatedHours: hours,
      completed: false,
    };

    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            chapters: [...subject.chapters, newChapter],
          };
        }
        return subject;
      })
    );
  };

  const updateChapter = (subjectId: string, chapter: Chapter) => {
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            chapters: subject.chapters.map((ch) =>
              ch.id === chapter.id ? chapter : ch
            ),
          };
        }
        return subject;
      })
    );
  };

  const deleteChapter = (subjectId: string, chapterId: string) => {
    setSubjects((prev) =>
      prev.map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            chapters: subject.chapters.filter((ch) => ch.id !== chapterId),
          };
        }
        return subject;
      })
    );
    // Remove associated sessions
    setSessions((prev) => prev.filter((s) => s.chapterId !== chapterId));
  };

  const updateAvailability = (day: string, hours: number) => {
    setAvailability((prev) =>
      prev.map((a) => (a.day === day ? { ...a, availableHours: hours } : a))
    );
  };

  const generatePlan = () => {
    const newSessions = generateStudyPlan(subjects, availability);
    setSessions(newSessions);
  };

  const updateSession = (session: StudySession) => {
    setSessions((prev) => prev.map((s) => (s.id === session.id ? session : s)));
  };

  const clearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This cannot be undone."
      )
    ) {
      setSubjects([]);
      setAvailability(defaultAvailability);
      setSessions([]);
      localStorage.removeItem("studyPlan");
    }
  };

  const addSession = (session: StudySession) => {
    setSessions((prev) => [...prev, session]);
  };

  const syncStudyPlans = (plans: any[]) => {
    // Convert backend study plans to local subject format
    const newSubjects = plans.map(plan => ({
      id: `subject-${plan.id}`,
      name: plan.subject,
      color: '#6366f1', // default color, or map if available
      chapters: [
        {
          id: `chapter-${plan.id}-1`,
          name: 'Default Chapter',
          difficulty: 'medium',
          estimatedHours: 2,
          completed: false,
        },
      ],
      examDate: plan.exam_date,
      priority: 0,
    }));
    setSubjects(newSubjects);
    // Regenerate sessions for new subjects
    // setTimeout(() => generatePlan(), 0); // DISABLED: Do not auto-generate sessions for all days
  };

  return (
    <StudyContext.Provider
      value={{
        subjects,
        availability,
        sessions,
        addSubject,
        updateSubject,
        deleteSubject,
        addChapter,
        updateChapter,
        deleteChapter,
        updateAvailability,
        generatePlan,
        updateSession,
        clearData,
        addSession,
        syncStudyPlans,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudyContext = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error("useStudyContext must be used within a StudyProvider");
  }
  return context;
};
