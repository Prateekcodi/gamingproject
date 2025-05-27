import React, { useState } from "react";
import {
  CalendarIcon,
  PlusCircle,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Subject } from "../../types/index copy";
import { formatDate } from "../../utils/planner";
import { Card, CardContent, CardHeader } from "../ui/Card";
import Button from "../ui/Button";
import { useStudyContext } from "./../context/StudyContext";
import ChapterList from "./ChapterList";
import ChapterForm from "./ChapterForm";

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const { deleteSubject } = useStudyContext();
  const [showChapters, setShowChapters] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);

  const completedChapters = subject.chapters.filter(
    (ch) => ch.completed
  ).length;
  const totalChapters = subject.chapters.length;
  const progress =
    totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
      deleteSubject(subject.id);
    }
  };

  const toggleChapters = () => {
    setShowChapters(!showChapters);
    if (!showChapters) {
      setShowAddChapter(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div
          className="flex items-center space-x-2 w-full"
          style={{ backgroundColor: subject.color + "10" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: subject.color }}
          >
            <BookOpen size={16} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{subject.name}</h3>
            <div className="flex items-center text-xs text-slate-500">
              <CalendarIcon size={12} className="mr-1" />
              <span>{formatDate(subject.examDate)}</span>
              {subject.priority > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-xs">
                  Priority: {subject.priority.toFixed(1)}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-auto">
            <button
              onClick={handleDelete}
              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
              aria-label="Delete subject"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={toggleChapters}
              className="p-1 text-slate-400 hover:text-indigo-500 transition-colors"
              aria-label={showChapters ? "Hide chapters" : "Show chapters"}
            >
              {showChapters ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-slate-600">
            {totalChapters > 0 ? (
              <span>
                {completedChapters} of {totalChapters} chapters completed
              </span>
            ) : (
              <span>No chapters added yet</span>
            )}
          </div>
          <div className="text-sm font-medium">
            {progress > 0 ? `${Math.round(progress)}%` : "0%"}
          </div>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </CardContent>

      {showChapters && (
        <div className="border-t border-slate-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-slate-900">Chapters</h4>
              <Button
                size="sm"
                variant="outline"
                leftIcon={<PlusCircle size={14} />}
                onClick={() => setShowAddChapter(!showAddChapter)}
              >
                {showAddChapter ? "Cancel" : "Add Chapter"}
              </Button>
            </div>

            {showAddChapter && (
              <div className="mb-4">
                <ChapterForm
                  subjectId={subject.id}
                  onComplete={() => setShowAddChapter(false)}
                />
              </div>
            )}

            <ChapterList subject={subject} />
          </div>
        </div>
      )}
    </Card>
  );
};

export default SubjectCard;
