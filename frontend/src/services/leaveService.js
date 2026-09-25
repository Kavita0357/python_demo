import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

export const leaveService = {
  list: async (status) => (await apiClient.get(API_ENDPOINTS.leaves, {
    params: status ? { status_filter: status } : undefined,
  })).data,
  my: async () => (await apiClient.get(`${API_ENDPOINTS.leaves}/my`)).data,
  get: async (id) => (await apiClient.get(`${API_ENDPOINTS.leaves}/${id}`)).data,
  create: async (payload) => (await apiClient.post(API_ENDPOINTS.leaves, payload)).data,
  submit: async (id) => (await apiClient.post(`${API_ENDPOINTS.leaves}/${id}/submit`)).data,
  approve: async (id) => (await apiClient.post(`${API_ENDPOINTS.leaves}/${id}/approve`)).data,
  reject: async (id, reason) => (await apiClient.post(`${API_ENDPOINTS.leaves}/${id}/reject`, { reason })).data,
  cancel: async (id) => (await apiClient.post(`${API_ENDPOINTS.leaves}/${id}/cancel`)).data,
  comments: async (id) => (await apiClient.get(`${API_ENDPOINTS.leaves}/${id}/comments`)).data,
  addComment: async (id, comment) => (await apiClient.post(`${API_ENDPOINTS.leaves}/${id}/comments`, { comment })).data,
};

export const leaveTypeService = {
  list: async () => (await apiClient.get(API_ENDPOINTS.leaveTypes)).data,
  create: async (payload) => (await apiClient.post(API_ENDPOINTS.leaveTypes, payload)).data,
  update: async (id, payload) => (await apiClient.put(`${API_ENDPOINTS.leaveTypes}/${id}`, payload)).data,
  deactivate: async (id) => (await apiClient.delete(`${API_ENDPOINTS.leaveTypes}/${id}`)).data,
};

export const leaveBalanceService = {
  byUser: async (userId) => (await apiClient.get(`${API_ENDPOINTS.leaveBalances}/user/${userId}`)).data,
};

export const roleService = {
  list: async () => (await apiClient.get(API_ENDPOINTS.roles)).data,
};
