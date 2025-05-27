import React, { useState, useRef, useEffect } from "react";
import { Menu, ChevronDown, Bell, RotateCcw, User, Settings, LogOut } from "lucide-react";
import { User as UserType } from "../types";

interface HeaderProps {
  user: UserType;
  setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, setShowSidebar, onReset }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleReset = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all study data? This action cannot be undone."
      )
    ) {
      onReset();
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-4">
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          onClick={() => setShowSidebar((prev) => !prev)}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent hidden md:block">
          Studify
        </h1>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={handleReset}
          className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          title="Reset all data"
        >
          <RotateCcw size={20} />
        </button>

        <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <User size={18} className="text-indigo-600" />
            </div>
            <span className="hidden sm:block text-sm font-medium">{user.name}</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-1 animate-fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
