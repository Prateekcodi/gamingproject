import React from "react";
import {
  LineChart,
  Clock,
  BookOpen,
  Calendar,
  Award,
  Settings,
  BarChart,
  Users,
  MessageSquare,
  HelpCircle,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  showSidebar,
  setShowSidebar,
  activeTab,
  setActiveTab,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LineChart size={20} /> },
    { id: "timer", label: "Study Timer", icon: <Clock size={20} /> },
    { id: "subjects", label: "Exam Preparation", icon: <BookOpen size={20} /> },
    { id: "timetable", label: "Schedule", icon: <Calendar size={20} /> },
    { id: "achievements", label: "Achievements", icon: <Award size={20} /> },
    { id: "analytics", label: "Analytics", icon: <BarChart size={20} /> },
    { id: "groups", label: "Study Groups", icon: <Users size={20} /> },
    { id: "messages", label: "Messages", icon: <MessageSquare size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay with blur effect */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white z-30 
          transition-all duration-300 ease-in-out transform
          ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 shadow-xl
        `}
      >
        <div className="p-6 border-b border-indigo-700/50">
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <BookOpen className="text-indigo-300" />
            <span className="bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              StudyTracker
            </span>
          </h1>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`
                    flex items-center w-full px-4 py-3 text-left rounded-lg
                    transition-all duration-200 ease-in-out
                    ${
                      activeTab === item.id
                        ? "bg-white/10 text-white shadow-lg shadow-indigo-500/20"
                        : "text-indigo-100 hover:bg-white/5 hover:text-white"
                    }
                    group
                  `}
                  onClick={() => {
                    setActiveTab(item.id);
                    setShowSidebar(false);
                  }}
                >
                  <span className={`
                    mr-3 transition-transform duration-200
                    ${activeTab === item.id ? "text-white" : "text-indigo-300 group-hover:text-white"}
                  `}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700/50 bg-indigo-900/50 backdrop-blur-sm">
          <ul className="space-y-1">
            <li>
              <button className="flex items-center w-full px-4 py-3 text-left rounded-lg text-indigo-100 hover:bg-white/5 hover:text-white transition-colors duration-200">
                <span className="mr-3 text-indigo-300">
                  <Settings size={20} />
                </span>
                <span className="font-medium">Settings</span>
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-3 text-left rounded-lg text-indigo-100 hover:bg-white/5 hover:text-white transition-colors duration-200">
                <span className="mr-3 text-indigo-300">
                  <HelpCircle size={20} />
                </span>
                <span className="font-medium">Help & Support</span>
              </button>
            </li>
            <li>
              <button className="flex items-center w-full px-4 py-3 text-left rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors duration-200">
                <span className="mr-3">
                  <LogOut size={20} />
                </span>
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

