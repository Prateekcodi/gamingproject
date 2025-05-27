import React, { useState, useEffect } from 'react';
import { StudySession, Subject } from "../types/index copy";
import { User, DailyStats } from "../types";
import { Clock, Calendar, Award, Zap, TrendingUp, Book, Plus, Trash2 } from "lucide-react";
import { formatTime, calculateDailyStats, groupBySubject } from "../utils/helpers";
import StudyChart from "./StudyChart";
import StudySessionCard from "./StudySessionCard";
import SubjectDistribution from "./SubjectDistribution";
import { StudyPlan } from '../utils/api';
import api from '../utils/api';
import AddStudySessionModal from './AddStudySessionModal';
import { useStudyContext } from "./context/StudyContext";
import { useStudyStats } from "../hooks/useStudyStats";

interface DashboardProps {
  user: User;
  onReset: () => void;
  setActiveTab: (tab: string) => void;
  studyPlans: StudyPlan[];
  fetchStudyPlans: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onReset, setActiveTab, studyPlans, fetchStudyPlans, isLoading, error }) => {
  const { sessions, syncStudyPlans, subjects, addSession } = useStudyContext();
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const mappedSessions = sessions.map((s) => ({
    ...s,
    subject: subjects.find(sub => sub.id === s.subjectId)?.name || 'Unknown',
    mood: (s as any).mood || 'focused',
    duration: s.duration,
  }));
  const { totalMinutes, todayMinutes, weekMinutes, streak } = useStudyStats(mappedSessions);
  console.log(sessions);

  const dailyStats: DailyStats[] = calculateDailyStats(mappedSessions);
  const recentSessions = [...mappedSessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const subjectDistribution = groupBySubject(mappedSessions);

  const handleSessionAdded = () => {
    fetchStudyPlans();
  };

  const handlePlanCreated = () => {
    setActiveTab('subjects');
  };

  const handleDeletePlan = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this study plan?")) {
      try {
        await api.deleteStudyPlan(id);
        fetchStudyPlans(); // Refresh the list after deletion
      } catch (err) {
        alert("Failed to delete study plan.");
      }
    }
  };

  // Add this function to handle deleting all study plans
  const handleDeleteAllPlans = async () => {
    if (window.confirm("Are you sure you want to delete ALL study plans? This cannot be undone.")) {
      try {
        await Promise.all(studyPlans.map(plan => api.deleteStudyPlan(plan.id)));
        fetchStudyPlans();
      } catch (err) {
        alert("Failed to delete all study plans.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!Array.isArray(studyPlans)) {
    return <div className="text-red-500">Study plans data is invalid.</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Hello, {user.name}! 👋
          </h2>
        </div>
        <p className="text-gray-600 mt-2">
          Here's an overview of your study progress and statistics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard label="Today's Study Time" value={formatTime(todayMinutes)} icon={<Clock size={24} className="text-indigo-600" />} color="indigo" />
        <StatCard label="Weekly Study Time" value={formatTime(weekMinutes)} icon={<Calendar size={24} className="text-teal-600" />} color="teal" />
        <StatCard label="Current Streak" value={`${streak} days`} icon={<Zap size={24} className="text-purple-600" />} color="purple" />
        <StatCard label="Total Study Time" value={formatTime(totalMinutes)} icon={<Award size={24} className="text-amber-600" />} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <TrendingUp size={20} className="mr-2 text-indigo-600" />
              Study Activity
            </h3>

            <select className="text-sm border rounded-md py-1 px-3 bg-gray-50">
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="h-64">
            <StudyChart dailyStats={dailyStats.slice(0, 7).reverse()} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <Book size={20} className="mr-2 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Subject Distribution
            </h3>
          </div>

          <div className="h-64">
            <SubjectDistribution data={subjectDistribution} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Study Sessions
        </h3>

        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <StudySessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-6 text-center">
            No recent study sessions found.
          </p>
        )}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Study Plans</h2>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteAllPlans}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 size={20} className="mr-2" />
            Delete All
          </button>
          <button
            onClick={() => setIsSessionModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Study Session
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {studyPlans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No study plans yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {plan.subject}
              </h3>
              <p className="text-gray-600 mb-4">
                Exam Date: {new Date(plan.exam_date).toLocaleDateString()}
              </p>
              {plan.description && (
                <p className="text-gray-700">{plan.description}</p>
              )}
              <div className="mt-4 text-sm text-gray-500">
                Created: {new Date(plan.created_at).toLocaleDateString()}
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="text-red-500 hover:text-red-700 flex items-center"
                  title="Delete Study Plan"
                >
                  <Trash2 size={18} />
                  <span className="ml-1">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddStudySessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        subjects={subjects}
        onAdd={(session) => {
          console.log("Dashboard subjects (passed to AddStudySessionModal):", subjects, "length:", subjects.length);
          const newSession = { ...session, id: `session-${Date.now()}` };
          // @ts-ignore
          addSession(newSession);
          setIsSessionModalOpen(false);
          fetchStudyPlans();
        }}
      />
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-semibold text-gray-800">{value}</h3>
      </div>
      <div className={`bg-${color}-100 p-3 rounded-lg`}>{icon}</div>
    </div>
  </div>
);

export default Dashboard;
