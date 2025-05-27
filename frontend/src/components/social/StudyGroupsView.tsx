import React, { useState } from 'react';
import { Users, UserPlus, MessageSquare, Book, Calendar } from 'lucide-react';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  nextSession: string;
  description: string;
}

const mockGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'Math Masters',
    subject: 'Mathematics',
    members: 12,
    nextSession: '2024-03-20T15:00:00',
    description: 'Advanced calculus study group for university students'
  },
  {
    id: '2',
    name: 'Physics Forum',
    subject: 'Physics',
    members: 8,
    nextSession: '2024-03-21T14:00:00',
    description: 'Weekly physics problem-solving sessions'
  },
  {
    id: '3',
    name: 'CS Study Hub',
    subject: 'Computer Science',
    members: 15,
    nextSession: '2024-03-22T16:00:00',
    description: 'Programming practice and algorithm discussions'
  }
];

const StudyGroupsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const filteredGroups = mockGroups.filter(
    (group) =>
      (selectedSubject === 'all' || group.subject === selectedSubject) &&
      (group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Study Groups</h2>
        <p className="text-gray-600">Join study groups and learn together with peers!</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <select
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Computer Science">Computer Science</option>
          </select>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
          <UserPlus size={20} className="mr-2" />
          Create Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
              <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                {group.subject}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{group.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Users size={16} className="mr-2" />
                <span>{group.members} members</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-2" />
                <span>
                  Next session:{' '}
                  {new Date(group.nextSession).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors flex items-center justify-center">
                <Users size={16} className="mr-2" />
                Join Group
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                <MessageSquare size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyGroupsView;