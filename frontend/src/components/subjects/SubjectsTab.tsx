import React from "react";
import SubjectForm from "./SubjectForm";
import SubjectList from "./SubjectList";

const SubjectsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <SubjectForm />
      <SubjectList />
    </div>
  );
};

export default SubjectsTab;
