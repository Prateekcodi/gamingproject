import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/study-plans/';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Add request interceptor for logging
// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (config.baseURL && config.baseURL.startsWith('http://')) {
//       config.baseURL = config.baseURL.replace('http://', 'https://');
//     }
//     if (config.url && config.url.startsWith('http://')) {
//       config.url = config.url.replace('http://', 'https://');
//     }
//     console.log('Making request to:', config.url);
//     return config;
//   },
//   (error) => {
//     console.error('Request error:', error);
//     return Promise.reject(error);
//   }
// );

// Add response interceptor for logging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error - no response received');
    } else {
      console.error('Response error:', error.response.status);
    }
    return Promise.reject(error);
  }
);

export interface StudyPlan {
  id: number;
  subject: string;
  exam_date: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateStudyPlan {
  subject: string;
  exam_date: string;
  description?: string;
}

const api = {
  // Study Plans
  getStudyPlans: async (): Promise<StudyPlan[]> => {
    try {
      const response = await axiosInstance.get('/');
      return response.data;
    } catch (error) {
      console.error('Error in getStudyPlans:', error);
      throw error;
    }
  },

  getStudyPlan: async (id: number): Promise<StudyPlan> => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error in getStudyPlan:', error);
      throw error;
    }
  },

  createStudyPlan: async (data: CreateStudyPlan): Promise<StudyPlan> => {
    try {
      console.log('Sending data to create study plan:', data);
      const response = await axiosInstance.post('/', data);
      console.log('Response from create study plan:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in createStudyPlan:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw error;
    }
  },

  updateStudyPlan: async (id: number, data: CreateStudyPlan): Promise<StudyPlan> => {
    try {
      const response = await axiosInstance.put(`/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error in updateStudyPlan:', error);
      throw error;
    }
  },

  deleteStudyPlan: async (id: number): Promise<void> => {
    try {
      await axiosInstance.delete(`/${id}`);
    } catch (error) {
      console.error('Error in deleteStudyPlan:', error);
      throw error;
    }
  },
};

export default api;
export { axiosInstance }; 
