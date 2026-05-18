import apiClient from './client';
import { Lead, LeadsResponse, LeadFilters } from '../types';

export const leadsApi = {
  getAll: (filters: LeadFilters) =>
    apiClient.get<LeadsResponse>('/leads', { params: filters }),
  getById: (id: string) =>
    apiClient.get<{ success: boolean; data: Lead }>(`/leads/${id}`),
  create: (data: Partial<Lead>) =>
    apiClient.post<{ success: boolean; data: Lead }>('/leads', data),
  update: (id: string, data: Partial<Lead>) =>
    apiClient.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data),
  delete: (id: string) =>
    apiClient.delete(`/leads/${id}`),
  exportCSV: () =>
    apiClient.get('/leads/export/csv', { responseType: 'blob' }),
};
