import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Subject, StudySession } from "../../types/index copy";
import { formatDate, getWeekDates } from "../../utils/planner";
import { useStudyContext } from "./../context/StudyContext";
import Button from "../ui/Button";

interface CalendarViewProps {
  sessions: StudySession[];
  subjects: Subject[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ sessions, subjects }) => {
  const { updateSession } = useStudyContext();
  const [currentWeek, setCurrentWeek] = useState<string[]>(getWeekDates());
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    const dates: string[] = [];
    const today = new Date();

    // Calculate the date of Monday for the current offset
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }

    setCurrentWeek(dates);
  }, [weekOffset]);

  const navigateWeek = (direction: number) => {
    setWeekOffset((prev) => prev + direction);
  };

  const toggleSessionCompletion = (session: StudySession) => {
    updateSession({
      ...session,
      completed: !session.completed,
    });
  };

  const getDayLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateObj = new Date(dateString);
    dateObj.setHours(0, 0, 0, 0);

    if (dateObj.getTime() === today.getTime()) {
      return "Today";
    }

    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getSessionsForDay = (dateString: string) => {
    return sessions.filter((session) => session.date === dateString);
  };

  const getSubjectById = (id: string) => {
    return subjects.find((subject) => subject.id === id);
  };

  const getChapterById = (subjectId: string, chapterId: string) => {
    const subject = getSubjectById(subjectId);
    return subject?.chapters.find((chapter) => chapter.id === chapterId);
  };

  const isWeekend = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  };

  const isCurrentDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    return date.getTime() === today.getTime();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ChevronLeft size={16} />}
          onClick={() => navigateWeek(-1)}
        >
          Previous
        </Button>
        <h3 className="font-medium text-slate-700">
          {formatDate(currentWeek[0])} - {formatDate(currentWeek[6])}
        </h3>
        <Button
          variant="outline"
          size="sm"
          rightIcon={<ChevronRight size={16} />}
          onClick={() => navigateWeek(1)}
        >
          Next
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {currentWeek.map((date) => (
          <div key={date} className="text-center">
            <div
              className={`py-1 mb-2 rounded-t ${
                isWeekend(date) ? "bg-indigo-50" : ""
              } ${isCurrentDate(date) ? "bg-indigo-100 font-bold" : ""}`}
            >
              <span className="text-sm font-medium">{getDayLabel(date)}</span>
              <div className="text-xs text-slate-500">
                {date.split("-").slice(1).join("/")}
              </div>
            </div>
          </div>
        ))}

        {currentWeek.map((date) => (
          <div
            key={`sessions-${date}`}
            className={`border border-slate-200 rounded-b min-h-[150px] ${
              isWeekend(date) ? "bg-indigo-50" : ""
            } ${isCurrentDate(date) ? "border-indigo-200" : ""}`}
          >
            {getSessionsForDay(date).length === 0 ? (
              <div className="h-full flex items-center justify-center p-2">
                <p className="text-xs text-slate-400">No sessions</p>
              </div>
            ) : (
              <div className="p-1 space-y-1">
                {getSessionsForDay(date).map((session) => {
                  const subject = getSubjectById(session.subjectId);
                  const chapter = getChapterById(
                    session.subjectId,
                    session.chapterId
                  );

                  if (!subject || !chapter) return null;

                  return (
                    <div
                      key={session.id}
                      className={`p-2 rounded text-xs ${
                        session.completed
                          ? "bg-slate-100 text-slate-500"
                          : "border-l-4 hover:bg-slate-50"
                      }`}
                      style={{
                        borderLeftColor: session.completed
                          ? "#CBD5E1"
                          : subject.color,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="truncate">
                          <span className="font-medium">{subject.name}</span>
                          <div className="truncate text-xs text-slate-500">
                            {chapter.name}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleSessionCompletion(session)}
                          className={`ml-1 ${
                            session.completed
                              ? "text-green-500"
                              : "text-slate-300 hover:text-slate-500"
                          }`}
                        >
                          <CheckCircle size={14} />
                        </button>
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="text-slate-500">
                          {session.duration}{" "}
                          {session.duration === 1 ? "hour" : "hours"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
