import React, { useMemo, useState } from "react";
import { CheckCircle, Circle, ChevronLeft, ChevronRight } from "lucide-react";
import { Subject, StudySession } from "../../types/index copy";
import { formatDate } from "../../utils/planner";
import { useStudyContext } from "./../context/StudyContext";
import Button from "../ui/Button";

interface ListViewProps {
  sessions: StudySession[];
  subjects: Subject[];
}

const ListView: React.FC<ListViewProps> = ({ sessions, subjects }) => {
  const { updateSession } = useStudyContext();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const groups: Record<string, StudySession[]> = {};

    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    sortedSessions.forEach((session) => {
      if (!groups[session.date]) {
        groups[session.date] = [];
      }
      groups[session.date].push(session);
    });

    return groups;
  }, [sessions]);

  const dates = useMemo(() => {
    return Object.keys(groupedSessions).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }, [groupedSessions]);

  const paginatedDates = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return dates.slice(start, end);
  }, [dates, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(dates.length / itemsPerPage);

  const toggleSessionCompletion = (session: StudySession) => {
    updateSession({
      ...session,
      completed: !session.completed,
    });
  };

  const getSubjectById = (id: string) => {
    return subjects.find((subject) => subject.id === id);
  };

  const getChapterById = (subjectId: string, chapterId: string) => {
    const subject = getSubjectById(subjectId);
    return subject?.chapters.find((chapter) => chapter.id === chapterId);
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);

    return date.getTime() === today.getTime();
  };

  return (
    <div>
      <div className="space-y-6">
        {paginatedDates.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-slate-500">No study sessions found.</p>
          </div>
        ) : (
          paginatedDates.map((date) => (
            <div
              key={date}
              className="border border-slate-200 rounded-lg overflow-hidden"
            >
              <div
                className={`px-4 py-2 font-medium ${
                  isToday(date)
                    ? "bg-indigo-100 text-indigo-800"
                    : "bg-slate-50 text-slate-700"
                }`}
              >
                {formatDate(date)} {isToday(date) && "(Today)"}
              </div>
              <div className="divide-y divide-slate-100">
                {groupedSessions[date].map((session) => {
                  const subject = getSubjectById(session.subjectId);
                  const chapter = getChapterById(
                    session.subjectId,
                    session.chapterId
                  );

                  if (!subject || !chapter) return null;

                  return (
                    <div
                      key={session.id}
                      className={`p-4 flex items-center ${
                        session.completed ? "bg-slate-50" : ""
                      }`}
                    >
                      <button
                        onClick={() => toggleSessionCompletion(session)}
                        className={`flex-shrink-0 mr-3 ${
                          session.completed
                            ? "text-green-500"
                            : "text-slate-300 hover:text-slate-400"
                        }`}
                      >
                        {session.completed ? (
                          <CheckCircle size={20} />
                        ) : (
                          <Circle size={20} />
                        )}
                      </button>
                      <div className="flex-grow">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: subject.color }}
                          ></div>
                          <span
                            className={`font-medium ${
                              session.completed
                                ? "text-slate-500 line-through"
                                : "text-slate-800"
                            }`}
                          >
                            {subject.name}
                          </span>
                        </div>
                        <p
                          className={`text-sm mt-1 ${
                            session.completed
                              ? "text-slate-400"
                              : "text-slate-600"
                          }`}
                        >
                          {chapter.name} - {session.duration}{" "}
                          {session.duration === 1 ? "hour" : "hours"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ChevronLeft size={16} />}
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <div className="text-sm text-slate-600">
            Page {currentPage + 1} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ChevronRight size={16} />}
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
            }
            disabled={currentPage === totalPages - 1}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListView;
