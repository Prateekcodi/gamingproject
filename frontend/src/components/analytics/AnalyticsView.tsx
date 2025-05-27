import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, Calendar, Clock, TrendingUp } from 'lucide-react';
import { StudySession } from '../../types/index copy';
import { formatTime, calculateDailyStats, groupBySubject } from '../../utils/helpers';
import StudyChart from '../StudyChart';
import SubjectDistribution from '../SubjectDistribution';

interface AnalyticsViewProps {
  sessions: StudySession[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ sessions }) => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const dailyStats = calculateDailyStats(sessions);
  const subjectDistribution = groupBySubject(sessions);

  // Calculate average session duration
  const avgDuration = sessions.length
    ? sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length
    : 0;

  // Calculate most productive day
  const mostProductiveDay = dailyStats.reduce(
    (max, curr) => (curr.totalMinutes > max.totalMinutes ? curr : max),
    dailyStats[0]
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Analytics</h2>
        <p className="text-gray-600">Detailed insights into your study patterns and progress.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Session Duration</p>
              <p className="text-2xl font-semibold text-gray-800">{formatTime(avgDuration)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Most Productive Day</p>
              <p className="text-2xl font-semibold text-gray-800">
                {mostProductiveDay?.date
                  ? new Date(mostProductiveDay.date).toLocaleDateString('en-US', {
                      weekday: 'long'
                    })
                  : 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-800">{sessions.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Study Trends</h3>
            <select
              className="text-sm border rounded-md py-1 px-3 bg-gray-50"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div className="h-64">
            <StudyChart dailyStats={dailyStats.slice(0, 7).reverse()} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Subject Distribution</h3>
          <div className="h-64">
            <SubjectDistribution data={subjectDistribution} />
          </div>
        </div>
      </div>

      {/* Mood Analysis */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mood Analysis</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {['focused', 'motivated', 'neutral', 'tired', 'distracted'].map((mood) => {
            const moodSessions = sessions.filter((s) => s.mood === mood);
            const percentage = sessions.length
              ? ((moodSessions.length / sessions.length) * 100).toFixed(1)
              : '0';

            return (
              <div key={mood} className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 capitalize mb-1">{mood}</p>
                <p className="text-xl font-semibold text-gray-800">{percentage}%</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;