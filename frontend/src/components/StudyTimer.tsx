import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Settings } from 'lucide-react';

interface StudyTimerProps {
  onSessionComplete: (duration: number) => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onSessionComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [studyTime, setStudyTime] = useState(25 * 60); // 25 minutes in seconds
  const [breakTime, setBreakTime] = useState(5 * 60); // 5 minutes in seconds
  const [showSettings, setShowSettings] = useState(false);
  
  // Reset timer based on mode
  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setSeconds(timerMode === 'study' ? studyTime : breakTime);
  }, [timerMode, studyTime, breakTime]);
  
  // Initialize timer with study time
  useEffect(() => {
    resetTimer();
  }, [resetTimer]);
  
  // Timer logic
  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            setIsRunning(false);
            
            // If study session ended, record the duration
            if (timerMode === 'study') {
              onSessionComplete(studyTime);
              setTimerMode('break');
              return breakTime;
            } else {
              setTimerMode('study');
              return studyTime;
            }
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timerMode, studyTime, breakTime, onSessionComplete]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const calculateProgress = (): number => {
    const totalTime = timerMode === 'study' ? studyTime : breakTime;
    return ((totalTime - seconds) / totalTime) * 100;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      {/* Timer header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {timerMode === 'study' ? 'Study Time' : 'Break Time'}
        </h3>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Settings size={20} />
        </button>
      </div>
      
      {/* Settings panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Timer Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Study Time (min)</label>
              <input
                type="number"
                min="1"
                max="120"
                value={studyTime / 60}
                onChange={(e) => setStudyTime(parseInt(e.target.value) * 60)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Break Time (min)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={breakTime / 60}
                onChange={(e) => setBreakTime(parseInt(e.target.value) * 60)}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Timer circle */}
      <div className="flex justify-center mb-8">
        <div className="relative w-56 h-56">
          {/* Progress circle background */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={timerMode === 'study' ? '#4F46E5' : '#0D9488'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="282.7"
              strokeDashoffset={282.7 - (282.7 * calculateProgress() / 100)}
              transform="rotate(-90 50 50)"
              className="transition-all duration-1000 ease-in-out"
            />
          </svg>
          
          {/* Time display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">{formatTime(seconds)}</span>
            <span className="text-sm text-gray-500 mt-1 capitalize">{timerMode} mode</span>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`
            p-3 rounded-full
            ${isRunning 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-green-100 text-green-600 hover:bg-green-200'}
            transition-colors
          `}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          disabled={isRunning}
        >
          <RotateCcw size={24} />
        </button>
        
        <button
          onClick={() => {
            setTimerMode(timerMode === 'study' ? 'break' : 'study');
            setIsRunning(false);
            setSeconds(timerMode === 'study' ? breakTime : studyTime);
          }}
          className="p-3 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
        >
          {timerMode === 'study' ? <Coffee size={24} /> : <Play size={24} />}
        </button>
      </div>
    </div>
  );
};

export default StudyTimer;