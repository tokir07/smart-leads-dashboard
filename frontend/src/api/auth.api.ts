import apiClient from './client';
import { User } from '../types';

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export const authApi = {
  login: (data: Record<string, string>) =>
    apiClient.post<AuthResponse>('/auth/login', data),
  register: (data: Record<string, string>) =>
    apiClient.post<AuthResponse>('/auth/register', data),
  getMe: () =>
    apiClient.get<{ success: boolean; data: User }>('/auth/me'),
};
