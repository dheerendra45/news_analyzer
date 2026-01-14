import api from "./axios";

export const intelligenceCardsAPI = {
  // Public endpoints
  getStats: async () => {
    const response = await api.get("/intelligence-cards/stats");
    return response.data;
  },

  // Admin stats endpoint
  getAdminStats: async () => {
    const response = await api.get("/intelligence-cards/admin-stats");
    return response.data;
  },

  getLandingCards: async (limit = 8) => {
    const response = await api.get(
      `/intelligence-cards/landing?limit=${limit}`
    );
    return response.data;
  },

  getFeaturedCard: async () => {
    const response = await api.get("/intelligence-cards/featured");
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get("/intelligence-cards", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/intelligence-cards/${id}`);
    return response.data;
  },

  // Admin endpoints
  create: async (data) => {
    const response = await api.post("/intelligence-cards", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/intelligence-cards/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/intelligence-cards/${id}`);
    return response.data;
  },

  toggleStatus: async (id) => {
    const response = await api.post(`/intelligence-cards/${id}/toggle-status`);
    return response.data;
  },

  toggleFeatured: async (id) => {
    const response = await api.post(
      `/intelligence-cards/${id}/toggle-featured`
    );
    return response.data;
  },
};
