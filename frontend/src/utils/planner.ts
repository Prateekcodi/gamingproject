import { Subject, DailyAvailability, StudySession } from "../types/index copy";

// Calculate days between two dates
export const daysBetween = (date1: string, date2: string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil(
    Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)
  );
};

// Calculate priority based on exam date and chapters
export const calculatePriority = (subject: Subject): number => {
  const today = new Date().toISOString().split("T")[0];
  const daysToExam = daysBetween(today, subject.examDate);

  if (daysToExam <= 0) return 0; // Exam already happened

  const totalChapters = subject.chapters.length;
  if (totalChapters === 0) return 0;

  const completedChapters = subject.chapters.filter(
    (ch) => ch.completed
  ).length;
  const remainingWorkPercentage =
    (totalChapters - completedChapters) / totalChapters;

  // Higher priority for closer exams with more remaining work
  return Math.round((100 / daysToExam) * remainingWorkPercentage * 100) / 100;
};

// Generate study sessions based on subjects, chapters, and availability
export const generateStudyPlan = (
  subjects: Subject[],
  availability: DailyAvailability[]
): StudySession[] => {
  if (subjects.length === 0 || availability.length === 0) return [];

  const today = new Date();
  const sessions: StudySession[] = [];
  const prioritizedSubjects = [...subjects].sort(
    (a, b) => b.priority - a.priority
  );

  // Calculate total study hours needed per subject
  const subjectHours = prioritizedSubjects.map((subject) => ({
    subjectId: subject.id,
    totalHours: subject.chapters
      .filter((ch) => !ch.completed)
      .reduce((sum, ch) => sum + ch.estimatedHours, 0),
    chapters: subject.chapters.filter((ch) => !ch.completed),
  }));

  // Distribute hours based on availability and priority
  const currentDate = new Date(today);
  let dayIndex = 0;

  while (subjectHours.some((s) => s.totalHours > 0) && dayIndex < 30) {
    // Limit to 30 days
    const dayOfWeek = currentDate.getDay();
    const availabilityForDay = availability.find(
      (a) => parseInt(a.day) === dayOfWeek
    );

    if (availabilityForDay && availabilityForDay.availableHours > 0) {
      let remainingHours = availabilityForDay.availableHours;

      // Distribute hours according to priority
      for (const subject of subjectHours) {
        if (subject.totalHours <= 0 || subject.chapters.length === 0) continue;

        // Allocate at most 30 minutes per session or remaining minutes, whichever is less
        const chapter = subject.chapters[0];
        const minutesForThisSession = Math.min(
          30,
          remainingHours * 60,
          chapter.estimatedHours * 60
        );

        if (minutesForThisSession > 0) {
          sessions.push({
            id: `session-${sessions.length + 1}`,
            subjectId: subject.subjectId,
            chapterId: chapter.id,
            date: currentDate.toISOString().split("T")[0],
            duration: minutesForThisSession,
            completed: false,
          });

          remainingHours -= minutesForThisSession / 60;
          subject.totalHours -= minutesForThisSession / 60;
          chapter.estimatedHours -= minutesForThisSession / 60;

          // Remove chapter if completed
          if (chapter.estimatedHours <= 0) {
            subject.chapters.shift();
          }
        }

        if (remainingHours <= 0) break;
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    dayIndex++;
  }

  return sessions;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

// Get week dates
export const getWeekDates = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  const currentDay = today.getDay();

  // Start from Monday of current week
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};
