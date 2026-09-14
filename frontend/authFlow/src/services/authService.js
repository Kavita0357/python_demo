import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../config/api";

export const authService = {
  async login(credentials) {
    const { data } = await apiClient.post(
      API_ENDPOINTS.auth.login,
      credentials,
    );
    return data;
  },
  async register(payload) {
    const { data } = await apiClient.post(API_ENDPOINTS.auth.register, payload);
    return data;
  },
  async forgotPassword(payload) {
    const { data } = await apiClient.post(
      API_ENDPOINTS.auth.forgotPassword,
      payload,
    );
    return data;
  },
  async resetPassword(payload) {
    const { data } = await apiClient.post(
      API_ENDPOINTS.auth.resetPassword,
      payload,
    );
    return data;
  },
  async logout() {
    const { data } = await apiClient.post(API_ENDPOINTS.auth.logout);
    return data;
  },
  async getCurrentUser() {
    const { data } = await apiClient.get(API_ENDPOINTS.auth.me);
    return data;
  },
};
