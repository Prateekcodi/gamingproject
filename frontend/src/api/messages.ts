import { axiosInstance } from '../utils/api';

const API_URL = '/api/messages';

export interface Message {
  id: number;
  sender_id: number;
  recipient_id?: number;
  group_id?: number;
  content: string;
  type: 'public' | 'private' | 'group';
  timestamp: string;
}

export interface MessageCreate {
  content: string;
  type?: 'public' | 'private' | 'group';
  recipient_id?: number;
  group_id?: number;
  sender_id?: number;
}

export const getMessages = async (params?: any): Promise<Message[]> => {
  const res = await axiosInstance.get(API_URL, { params });
  return res.data;
};

export const sendMessage = async (data: MessageCreate): Promise<Message> => {
  const res = await axiosInstance.post(API_URL, data);
  return res.data;
};

export const deleteMessage = async (id: number): Promise<void> => {
  await axiosInstance.delete(`${API_URL}/${id}`);
}; 
