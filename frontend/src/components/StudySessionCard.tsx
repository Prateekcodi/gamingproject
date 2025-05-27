import React from 'react';
import { StudySession } from '../types/index copy';
import { formatTime } from '../utils/helpers';
import { Calendar, Clock, ThumbsUp, ThumbsDown, FileText } from 'lucide-react';

interface StudySessionCardProps {
  session: StudySession & {
    subject: string;
    mood?: string;
    notes?: string;
  };
}

interface AnalyticsViewProps {
  sessions: StudySession[];
}

// Get icon based on mood
const getMoodIcon = (mood: string) => {
  switch(mood) {
    case 'focused':
    case 'motivated':
      return <ThumbsUp className="text-green-500" size={16} />;
    case 'tired':
    case 'distracted':
      return <ThumbsDown className="text-red-500" size={16} />;
    default:
      return null;
  }
};

// Get color based on subject
const getSubjectColor = (subject: string): string => {
  const subjectColors: Record<string, string> = {
    'Mathematics': 'bg-indigo-500',
    'Physics': 'bg-teal-500',
    'Computer Science': 'bg-purple-500',
    'Literature': 'bg-amber-500',
    'History': 'bg-red-500',
    'Chemistry': 'bg-green-500',
  };
  
  return subjectColors[subject] || 'bg-gray-500';
};

const StudySessionCard: React.FC<StudySessionCardProps> = ({ session }) => {
  const formattedDate = new Date(session.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start">
        <div className={`${getSubjectColor(session.subject)} w-1.5 h-full rounded-full self-stretch mr-3`}></div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-gray-800">{session.subject}</h4>
            <span className="text-sm font-medium bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
              {formatTime(session.duration)}
            </span>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={14} className="mr-1" />
              {formattedDate}
            </div>
            
            {session.mood && (
              <div className="flex items-center text-sm text-gray-600 capitalize">
                {getMoodIcon(session.mood)}
                <span className="ml-1">{session.mood}</span>
              </div>
            )}
          </div>
          
          {session.notes && (
            <div className="mt-2 text-sm text-gray-600">
              <details>
                <summary className="flex items-center cursor-pointer">
                  <FileText size={14} className="mr-1" />
                  <span>Notes</span>
                </summary>
                <p className="mt-1 pl-5">{session.notes}</p>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudySessionCard;