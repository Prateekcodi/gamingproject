import React from "react";
import { useStudyContext } from "./../context/StudyContext";
import SubjectCard from "./SubjectCard";
import { BookOpen } from "lucide-react";

const SubjectList: React.FC = () => {
  const { subjects } = useStudyContext();

  if (subjects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <BookOpen size={32} className="text-indigo-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          No subjects added yet
        </h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Start by adding a subject and its exam date. Then you can add
          chapters, set their difficulty, and estimate study hours.
        </p>
      </div>
    );
  }

  const sortedSubjects = [...subjects].sort((a, b) => b.priority - a.priority);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {sortedSubjects.map((subject) => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
};

export default SubjectList;
