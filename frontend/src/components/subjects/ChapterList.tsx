import React from "react";
import { CheckCircle, Circle, Clock, Trash2 } from "lucide-react";
import { Subject } from "../../types/index copy";
import { useStudyContext } from "./../context/StudyContext";
import { difficultyColors } from "../../utils/colors";

interface ChapterListProps {
  subject: Subject;
}

const ChapterList: React.FC<ChapterListProps> = ({ subject }) => {
  const { updateChapter, deleteChapter } = useStudyContext();

  if (!subject.chapters || subject.chapters.length === 0) {
    return (
      <div className="text-center py-4 text-slate-500 text-sm">
        No chapters added yet. Add some chapters to start planning.
      </div>
    );
  }

  const toggleChapterCompletion = (chapterId: string) => {
    const chapter = subject.chapters.find((ch) => ch.id === chapterId);
    if (chapter) {
      updateChapter(subject.id, {
        ...chapter,
        completed: !chapter.completed,
      });
    }
  };

  const handleDeleteChapter = (chapterId: string, chapterName: string) => {
    if (window.confirm(`Are you sure you want to delete "${chapterName}"?`)) {
      deleteChapter(subject.id, chapterId);
    }
  };

  return (
    <div className="space-y-2">
      {subject.chapters.map((chapter) => {
        const difficultyStyle =
          difficultyColors[chapter.difficulty as keyof typeof difficultyColors];

        return (
          <div
            key={chapter.id}
            className={`flex items-center justify-between p-2 rounded-md transition-colors ${
              chapter.completed ? "bg-slate-100" : "bg-white hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center">
              <button
                onClick={() => toggleChapterCompletion(chapter.id)}
                className={`mr-2 text-indigo-600 hover:text-indigo-800 transition-colors ${
                  chapter.completed ? "opacity-100" : "opacity-70"
                }`}
                aria-label={
                  chapter.completed ? "Mark as incomplete" : "Mark as complete"
                }
              >
                {chapter.completed ? (
                  <CheckCircle size={18} />
                ) : (
                  <Circle size={18} />
                )}
              </button>
              <div>
                <span
                  className={`font-medium ${
                    chapter.completed
                      ? "line-through text-slate-500"
                      : "text-slate-900"
                  }`}
                >
                  {chapter.name}
                </span>
                <div className="flex items-center space-x-2 text-xs mt-0.5">
                  <span
                    className={`px-1.5 py-0.5 rounded ${difficultyStyle.bg} ${difficultyStyle.text}`}
                  >
                    {chapter.difficulty}
                  </span>
                  <span className="flex items-center text-slate-500">
                    <Clock size={12} className="mr-1" />
                    {chapter.estimatedHours}{" "}
                    {chapter.estimatedHours === 1 ? "hour" : "hours"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDeleteChapter(chapter.id, chapter.name)}
              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
              aria-label={`Delete ${chapter.name}`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ChapterList;
