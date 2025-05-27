import React, { useState } from "react";
import { BookOpen, Calendar, Clock, Menu, X } from "lucide-react";
import Button from "./ui/Button";
import { useStudyContext } from "./context/StudyContext";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { clearData } = useStudyContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "subjects", label: "Subjects", icon: <BookOpen size={18} /> },
    { id: "availability", label: "Availability", icon: <Clock size={18} /> },
    { id: "timetable", label: "Timetable", icon: <Calendar size={18} /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <BookOpen size={24} className="text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">StudyPlanner</h1>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={clearData}>
              Reset Data
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-2 px-4">
          <nav className="flex flex-col space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={clearData}
              fullWidth
              className="mt-2"
            >
              Reset Data
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
