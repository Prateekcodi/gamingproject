import React from 'react';
import { Trophy, Star, Target, Clock, Book, Users, Zap, Award } from 'lucide-react';
import { User } from '../../types';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

interface AchievementsViewProps {
  user: User;
  totalStudyHours: number;
  totalSessions: number;
}

const AchievementsView: React.FC<AchievementsViewProps> = ({ user, totalStudyHours, totalSessions }) => {
  const achievements: Achievement[] = [
    {
      id: 'study-master',
      title: 'Study Master',
      description: 'Complete 100 study sessions',
      icon: <Trophy className="text-yellow-500" />,
      progress: totalSessions,
      maxProgress: 100,
      unlocked: totalSessions >= 100
    },
    {
      id: 'time-warrior',
      title: 'Time Warrior',
      description: 'Study for 50 hours total',
      icon: <Clock className="text-blue-500" />,
      progress: Math.floor(totalStudyHours),
      maxProgress: 50,
      unlocked: totalStudyHours >= 50
    },
    {
      id: 'streak-champion',
      title: 'Streak Champion',
      description: 'Maintain a 7-day study streak',
      icon: <Zap className="text-purple-500" />,
      progress: user.currentStreak,
      maxProgress: 7,
      unlocked: user.currentStreak >= 7
    },
    {
      id: 'subject-explorer',
      title: 'Subject Explorer',
      description: 'Study 5 different subjects',
      icon: <Book className="text-green-500" />,
      progress: 3, // This should be calculated from actual subjects studied
      maxProgress: 5,
      unlocked: false
    }
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Achievements</h2>
        <p className="text-gray-600">Track your progress and unlock achievements as you study!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
              achievement.unlocked ? 'border-green-500' : 'border-gray-300'
            }`}
          >
            <div className="flex items-start mb-3">
              <div className="p-2 rounded-lg bg-gray-50">
                {achievement.icon}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{achievement.progress} / {achievement.maxProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    achievement.unlocked ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{
                    width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>

            {achievement.unlocked && (
              <div className="mt-3 flex items-center text-sm text-green-600">
                <Award size={16} className="mr-1" />
                <span>Unlocked!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsView;