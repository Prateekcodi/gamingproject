import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStudyContext } from "./context/StudyContext";
import api, { CreateStudyPlan, StudyPlan } from '../utils/api';
import axios from 'axios';

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionAdded: () => void;
  onPlanCreated?: () => void;
  studyPlans: StudyPlan[];
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ 
  isOpen, 
  onClose,
  onSessionAdded,
  onPlanCreated,
  studyPlans
}) => {
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const studyPlan: CreateStudyPlan = {
        subject,
        exam_date: new Date(examDate).toISOString().split('T')[0],
        description: description.trim() || undefined
      };
      
      await api.createStudyPlan(studyPlan);
      onSessionAdded();
      if (onPlanCreated) onPlanCreated();
      onClose();
      
      // Reset form
      setSubject('');
      setExamDate('');
      setDescription('');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Error: ${err.response.data.detail || err.response.statusText}`);
        } else if (err.request) {
          // The request was made but no response was received
          setError('No response from server. Please check if the backend is running.');
        } else {
          // Something happened in setting up the request that triggered an Error
          setError(`Error: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error creating study plan:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full px-6 py-5 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Add Study Plan</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter subject name"
                  required
                  disabled={isLoading}
                />
              </div>
              
              {/* Exam Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={isLoading}
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add any notes or details about your study plan..."
                  disabled={isLoading}
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSessionModal;
