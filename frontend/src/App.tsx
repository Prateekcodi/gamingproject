import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import CenterContent from "./components/CenterContent";
import { mockUser } from "./data/mockData";
import { StudyProvider } from "./components/context/StudyContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-indigo-600">Loading Studify...</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <StudyProvider>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="flex flex-col flex-1 md:ml-72 overflow-hidden transition-all duration-300">
            <Header
              user={mockUser}
              setShowSidebar={setShowSidebar}
              onReset={() => {
                localStorage.clear();
                window.location.reload();
              }}
            />
            <main className="flex-1 overflow-y-auto bg-gray-50">
              <div className="container mx-auto px-4 py-6 max-w-7xl">
                <Routes>
                  <Route 
                    path="/*" 
                    element={
                      <div className="animate-fade-in">
                        <CenterContent 
                          activeTab={activeTab} 
                          setActiveTab={setActiveTab} 
                        />
                      </div>
                    } 
                  />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </StudyProvider>
    </Router>
  );
};

export default App;
