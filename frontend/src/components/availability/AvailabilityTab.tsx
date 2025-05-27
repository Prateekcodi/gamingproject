import React from "react";
import { Clock } from "lucide-react";
import { useStudyContext } from "./../context/StudyContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/Card";
import Button from "../ui/Button";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AvailabilityTab: React.FC = () => {
  const { availability, updateAvailability, generatePlan } = useStudyContext();

  const totalHours = availability.reduce(
    (sum, day) => sum + day.availableHours,
    0
  );

  const handleHoursChange = (day: string, hours: number) => {
    updateAvailability(day, hours);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Availability</CardTitle>
          <CardDescription>
            Set how many hours you can study each day. The planner will use this
            information to create your study schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {availability.map((dayAvailability) => {
              const dayIndex = parseInt(dayAvailability.day);
              const dayName = dayNames[dayIndex];
              const isWeekend = dayIndex === 0 || dayIndex === 6;

              return (
                <div
                  key={dayAvailability.day}
                  className={`rounded-lg border p-4 text-center ${
                    isWeekend
                      ? "bg-indigo-50 border-indigo-100"
                      : "bg-white border-slate-200"
                  }`}
                >
                  <h3
                    className={`font-medium mb-2 ${
                      isWeekend ? "text-indigo-700" : "text-slate-700"
                    }`}
                  >
                    {dayName}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Clock
                      size={16}
                      className={
                        isWeekend ? "text-indigo-500" : "text-slate-500"
                      }
                    />
                    <span
                      className={`font-medium ${
                        isWeekend ? "text-indigo-600" : "text-slate-600"
                      }`}
                    >
                      {dayAvailability.availableHours} hours
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() =>
                        handleHoursChange(
                          dayAvailability.day,
                          Math.max(0, dayAvailability.availableHours - 0.5)
                        )
                      }
                      className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                      disabled={dayAvailability.availableHours <= 0}
                    >
                      <span className="text-slate-700">-</span>
                    </button>
                    <div className="text-sm text-slate-500">
                      {dayAvailability.availableHours} hrs
                    </div>
                    <button
                      onClick={() =>
                        handleHoursChange(
                          dayAvailability.day,
                          Math.min(12, dayAvailability.availableHours + 0.5)
                        )
                      }
                      className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
                      disabled={dayAvailability.availableHours >= 12}
                    >
                      <span className="text-slate-700">+</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <p className="text-slate-700 font-medium">
                Total weekly availability:
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {totalHours} hours
              </p>
            </div>
            <Button onClick={generatePlan} size="lg" className="mt-4 sm:mt-0">
              Generate Study Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tips for Effective Planning</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-indigo-500 mt-1 mr-2"></span>
              <span>
                Be realistic about how many hours you can commit each day.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-indigo-500 mt-1 mr-2"></span>
              <span>
                Consider allocating more hours on weekends when you might have
                more free time.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-indigo-500 mt-1 mr-2"></span>
              <span>
                Account for other commitments like classes, work, and social
                activities.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-4 rounded-full bg-indigo-500 mt-1 mr-2"></span>
              <span>
                Leave some buffer time for unexpected events and review
                sessions.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityTab;
