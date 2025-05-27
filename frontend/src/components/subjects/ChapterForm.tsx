import React, { useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { useStudyContext } from "./../context/StudyContext";

interface ChapterFormProps {
  subjectId: string;
  onComplete: () => void;
}

const ChapterForm: React.FC<ChapterFormProps> = ({ subjectId, onComplete }) => {
  const { addChapter } = useStudyContext();
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [hours, setHours] = useState("2");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Chapter name is required");
      return;
    }

    const parsedHours = parseFloat(hours);
    if (isNaN(parsedHours) || parsedHours <= 0) {
      setError("Hours must be a positive number");
      return;
    }

    addChapter(subjectId, name, difficulty, parsedHours);
    setName("");
    setDifficulty("medium");
    setHours("2");
    onComplete();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-50 rounded-md p-3 border border-slate-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-1">
          <Input
            placeholder="Chapter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </div>
        <div className="md:col-span-1">
          <Select
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ]}
            value={difficulty}
            onChange={(value) =>
              setDifficulty(value as "easy" | "medium" | "hard")
            }
            fullWidth
          />
        </div>
        <div className="md:col-span-1 flex space-x-2">
          <Input
            type="number"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            min="0.5"
            step="0.5"
            fullWidth
          />
          <Button type="submit" size="sm">
            Add
          </Button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </form>
  );
};

export default ChapterForm;
