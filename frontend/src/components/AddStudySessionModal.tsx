import React, { useState } from "react";
import { StudySession, Subject } from "../types/index copy";
import { useStudyContext } from "./context/StudyContext";

interface AddStudySessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (session: Omit<StudySession, 'id'>) => void;
  subjects: Subject[];
}

const moods = ["focused", "motivated", "neutral", "tired", "distracted"] as const;

type Mood = typeof moods[number];

const AddStudySessionModal: React.FC<AddStudySessionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  subjects,
}) => {
  console.log("AddStudySessionModal subjects:", subjects, "length:", subjects.length);
  const { addSession } = useStudyContext();
  const [subjectId, setSubjectId] = useState<string>("");
  const [duration, setDuration] = useState(30);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [mood, setMood] = useState<Mood>("focused");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      subjectId,
      chapterId: "", // or handle chapter selection if needed
      date,
      duration,
      completed: false,
      mood,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full px-6 py-5 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Add Study Session</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  required
                >
                  <option value="">Select subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How did you feel during this session?
                </label>
                <div className="flex gap-2">
                  {moods.map((m) => (
                    <button
                      type="button"
                      key={m}
                      className={`px-2 py-1 rounded ${mood === m ? "bg-indigo-600 text-white" : "bg-gray-100"}`}
                      onClick={() => setMood(m)}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full border-gray-300 rounded-md shadow-sm"
                  placeholder="What did you learn? Any challenges?"
                ></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
              >
                Save Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudySessionModal; 
