import { useMemo } from "react";
import { StudySession } from "../types";

export function useStudyStats(sessions: StudySession[]) {
  const today = new Date().toISOString().split("T")[0];

  return useMemo(() => {
    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);

    const todayMinutes = sessions
      .filter((s) => s.date === today)
      .reduce((sum, s) => sum + s.duration, 0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekMinutes = sessions
      .filter((s) => new Date(s.date) >= oneWeekAgo)
      .reduce((sum, s) => sum + s.duration, 0);

    // Streak calculation
    const uniqueDates = Array.from(new Set(sessions.map((s) => s.date))).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    let streak = 0;
    let currentDate = new Date(today);
    for (let i = 0; i < uniqueDates.length; i++) {
      const studyDate = new Date(uniqueDates[i]);
      if (
        studyDate.toISOString().split("T")[0] ===
        currentDate.toISOString().split("T")[0]
      ) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { totalMinutes, todayMinutes, weekMinutes, streak };
  }, [sessions, today]);
} 
