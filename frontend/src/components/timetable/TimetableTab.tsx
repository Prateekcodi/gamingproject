import React, { useState } from "react";
import { useStudyContext } from "./../context/StudyContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Button from "../ui/Button";
import { Calendar, List } from "lucide-react";
import CalendarView from "./CalendarView";
import ListView from "./ListView";

const TimetableTab: React.FC = () => {
  const { sessions, subjects, generatePlan } = useStudyContext();
  const [view, setView] = useState<"calendar" | "list">("calendar");

  if (sessions.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <Calendar size={32} className="text-indigo-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              No study plan generated yet
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Add subjects and chapters, set your availability, and then
              generate a personalized study plan.
            </p>
            <Button onClick={generatePlan} size="lg">
              Generate Study Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Your Study Plan</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={view === "calendar" ? "primary" : "outline"}
              size="sm"
              leftIcon={<Calendar size={16} />}
              onClick={() => setView("calendar")}
            >
              Calendar
            </Button>
            <Button
              variant={view === "list" ? "primary" : "outline"}
              size="sm"
              leftIcon={<List size={16} />}
              onClick={() => setView("list")}
            >
              List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {view === "calendar" ? (
            <CalendarView sessions={sessions} subjects={subjects} />
          ) : (
            <ListView sessions={sessions} subjects={subjects} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
              <h4 className="font-medium text-teal-700 mb-2">
                Pomodoro Technique
              </h4>
              <p className="text-sm text-teal-600">
                Study for 25 minutes, then take a 5-minute break. After 4
                cycles, take a longer 15-30 minute break.
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="font-medium text-purple-700 mb-2">
                Active Recall
              </h4>
              <p className="text-sm text-purple-600">
                Test yourself on material rather than passively re-reading.
                Create practice questions for each chapter.
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h4 className="font-medium text-amber-700 mb-2">
                Spaced Repetition
              </h4>
              <p className="text-sm text-amber-600">
                Review material at increasing intervals to improve long-term
                retention and reduce forgetting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimetableTab;
