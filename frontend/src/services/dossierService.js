import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';

const dossierBase = API_ENDPOINTS.dossiers;

export const dossierService = {
  async list() {
    const { data } = await apiClient.get(dossierBase);
    return data;
  },

  async get(id) {
    const { data } = await apiClient.get(`${dossierBase}/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await apiClient.post(dossierBase, payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await apiClient.put(`${dossierBase}/${id}`, payload);
    return data;
  },

  async updateStatus(id, status) {
    const { data } = await apiClient.patch(`${dossierBase}/${id}/status`, { status });
    return data;
  },

  async listModules(dossierId) {
    const { data } = await apiClient.get(`${dossierBase}/${dossierId}/modules`);
    return data;
  },

  async createModule(dossierId, payload) {
    const { data } = await apiClient.post(`${dossierBase}/${dossierId}/modules`, payload);
    return data;
  },

  async updateModule(dossierId, moduleId, payload) {
    const { data } = await apiClient.put(
      `${dossierBase}/${dossierId}/modules/${moduleId}`,
      payload,
    );
    return data;
  },

  async updateModuleStatus(dossierId, moduleId, status) {
    const { data } = await apiClient.patch(
      `${dossierBase}/${dossierId}/modules/${moduleId}/status`,
      { status },
    );
    return data;
  },
};
