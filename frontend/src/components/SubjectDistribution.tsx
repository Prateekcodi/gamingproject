import React from 'react';
import { formatTime } from '../utils/helpers';

interface SubjectDistributionProps {
  data: {
    subject: string;
    totalMinutes: number;
  }[];
}

const subjectColors: Record<string, string> = {
  'Mathematics': 'bg-indigo-500',
  'Physics': 'bg-teal-500',
  'Computer Science': 'bg-purple-500',
  'Literature': 'bg-amber-500',
  'History': 'bg-red-500',
  'Chemistry': 'bg-green-500',
};

const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const SubjectDistribution: React.FC<SubjectDistributionProps> = ({ data }) => {
  const totalMinutes = data.reduce((sum, item) => sum + item.totalMinutes, 0);

  return (
    <div className="h-full flex flex-col">
      {data.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Subject Distribution</h3>
            <span className="text-sm text-gray-500">{formatTime(totalMinutes)}</span>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="space-y-3">
              {data.map((item) => {
                const percentage = Math.round((item.totalMinutes / totalMinutes) * 100);
                
                return (
                  <div key={item.subject} className="flex items-center">
                    <div className={`w-3 h-3 rounded-sm ${subjectColors[item.subject] || 'bg-gray-500'} mr-2`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate" title={item.subject}>
                          {item.subject}
                        </span>
                        <span className="text-gray-500">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1">
                        <div 
                          className={`${subjectColors[item.subject] || 'bg-gray-500'} h-1.5 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {formatMinutes(item.totalMinutes)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No study data available</p>
        </div>
      )}
    </div>
  );
};

export default SubjectDistribution;