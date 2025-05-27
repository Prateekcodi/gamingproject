import { StudySession } from "../types/index copy";
import { DailyStats } from "../types";

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Format minutes into hours and minutes
export const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours} hr`;
  } else {
    return `${hours} hr ${mins} min`;
  }
};

// Calculate daily statistics from study sessions
export const calculateDailyStats = (sessions: (StudySession & { subject: string; mood?: string })[]): DailyStats[] => {
  const dailyMap: { [key: string]: DailyStats } = {};

  sessions.forEach((session) => {
    const { date, duration, subject } = session;

    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        totalMinutes: 0,
        sessions: 0,
        subjects: {},
        averageMood: "",
      };
    }

    dailyMap[date].totalMinutes += duration;
    dailyMap[date].sessions += 1;

    if (!dailyMap[date].subjects[subject]) {
      dailyMap[date].subjects[subject] = 0;
    }

    dailyMap[date].subjects[subject] += duration;
  });

  // Calculate average mood for each day
  Object.keys(dailyMap).forEach((date) => {
    const dateSessions = sessions.filter((s) => s.date === date);
    const moodCounts: { [key: string]: number } = {};

    dateSessions.forEach((session) => {
      const mood = session.mood || 'focused';
      if (!moodCounts[mood]) {
        moodCounts[mood] = 0;
      }
      moodCounts[mood] += 1;
    });

    let mostFrequentMood = "";
    let highestCount = 0;

    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > highestCount) {
        mostFrequentMood = mood;
        highestCount = count;
      }
    });

    dailyMap[date].averageMood = mostFrequentMood;
  });

  return Object.values(dailyMap).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get current streak (consecutive days with study sessions)
export const calculateStreak = (sessions: StudySession[]): number => {
  const dailyStats = calculateDailyStats(sessions.map(s => ({
    ...s,
    subject: 'Unknown',
    mood: 'focused'
  })));
  let streak = 0;
  const today = new Date().toISOString().split("T")[0];

  // Check if studied today
  if (dailyStats[0]?.date !== today) return 0;

  for (let i = 0; i < dailyStats.length; i++) {
    const currentDate = new Date(dailyStats[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (
      currentDate.toISOString().split("T")[0] ===
      expectedDate.toISOString().split("T")[0]
    ) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

// Group study sessions by subject
export const groupBySubject = (
  sessions: (StudySession & { subject: string })[]
): { subject: string; totalMinutes: number }[] => {
  const subjectMap: { [key: string]: number } = {};

  sessions.forEach((session) => {
    if (!subjectMap[session.subject]) {
      subjectMap[session.subject] = 0;
    }
    subjectMap[session.subject] += session.duration;
  });

  return Object.entries(subjectMap)
    .map(([subject, totalMinutes]) => ({
      subject,
      totalMinutes,
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes);
};
