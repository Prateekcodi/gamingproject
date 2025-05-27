import React, { useState } from "react";
import Dashboard from "./Dashboard";
import StudyTimer from "./StudyTimer";
import { Plus } from "lucide-react";
import AddSessionModal from "./AddSessionModal";
import { StudySession } from "../types/index copy";
import { User } from "../types";
import { generateMockSessions, mockUser } from "../data/mockData";
import useLocalStorage from "../hooks/useLocalStorage";
import AchievementsView from "./achievements/AchievementsView";
import AnalyticsView from "./analytics/AnalyticsView";
import StudyGroupsView from "./social/StudyGroupsView";
import MessagesView from "./messages/MessagesView";
import Header from "./Header";
import { StudyProvider, useStudyContext } from "./context/StudyContext";
import AvailabilityTab from "./availability/AvailabilityTab";
import SubjectsTab from "./subjects/SubjectsTab";
import TimetableTab from "./timetable/TimetableTab";
import { StudyPlan } from '../utils/api';
import api from '../utils/api';
// import SubjectsTab from "./subjects/SubjectsTab";

interface CenterContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CenterContent: React.FC<CenterContentProps> = ({ activeTab, setActiveTab }) => {
  const { sessions, syncStudyPlans } = useStudyContext();
  const [user] = useLocalStorage<User>("user", mockUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudyPlans = async () => {
    try {
      const plans = await api.getStudyPlans();
      setStudyPlans(plans);
      if (syncStudyPlans) syncStudyPlans(plans);
      setError(null);
    } catch (err) {
      setError('Failed to load study plans. Please try again.');
      console.error('Error fetching study plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const autoAddDefaultPlans = async () => {
      await fetchStudyPlans();
      if (studyPlans.length === 0) {
        // Add several default study plans if none exist
        const defaultPlans = [
          { subject: 'Mathematics', exam_date: '2025-05-20', description: 'Default subject for demo' },
          { subject: 'Physics', exam_date: '2025-05-21', description: 'Default subject for demo' },
          { subject: 'Chemistry', exam_date: '2025-05-22', description: 'Default subject for demo' },
          { subject: 'Computer Science', exam_date: '2025-05-23', description: 'Default subject for demo' },
          { subject: 'History', exam_date: '2025-05-24', description: 'Default subject for demo' },
        ];
        for (const plan of defaultPlans) {
          await api.createStudyPlan(plan);
        }
        await fetchStudyPlans();
      }
    };
    autoAddDefaultPlans();
  }, []);

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard 
            user={user} 
            onReset={handleReset} 
            setActiveTab={setActiveTab} 
            studyPlans={studyPlans}
            fetchStudyPlans={fetchStudyPlans}
            isLoading={isLoading}
            error={error}
          />
        );
      case "subjects":
        return (
          <div className="min-h-screen bg-slate-50">
            <main className="container mx-auto px-4 py-6">
              <div className="max-w-6xl mx-auto">
                <SubjectsTab />
              </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-6 mt-12">
              <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
                <p>StudyPlanner &copy; {new Date().getFullYear()}</p>
                <p className="mt-1">
                  A smart solution to optimize your study time and achieve
                  better results
                </p>
              </div>
            </footer>
          </div>
        );
      case "timer":
        return <StudyTimer />;
      case "achievements":
        return (
          <AchievementsView
            user={user}
            totalStudyHours={sessions.reduce((sum, s) => sum + s.duration, 0) / 60}
            totalSessions={sessions.length}
          />
        );
      case "analytics":
        return <AnalyticsView sessions={sessions} />;
      case "groups":
        return <StudyGroupsView />;
      case "messages":
        return <MessagesView />;
      case "availability":
        return <AvailabilityTab />;
      case "timetable":
        return <TimetableTab />;
      default:
        return <Dashboard user={user} onReset={handleReset} setActiveTab={setActiveTab} studyPlans={studyPlans} fetchStudyPlans={fetchStudyPlans} isLoading={isLoading} error={error} />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {renderContent()}

      {activeTab !== "messages" && (
        <button
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-3 sm:p-4 rounded-full shadow-lg flex items-center justify-center z-10 transition-transform hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={24} />
        </button>
      )}

      <AddSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSessionAdded={fetchStudyPlans}
        studyPlans={studyPlans}
      />
    </div>
  );
};

export default CenterContent;
