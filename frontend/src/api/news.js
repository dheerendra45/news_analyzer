import api from "./axios";

export const newsAPI = {
  // Get all news (with pagination and filters)
  getAll: async (params = {}) => {
    const response = await api.get("/news", { params });
    return response.data;
  },

  // Get single news by ID
  getById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Create news (admin only)
  create: async (newsData) => {
    const response = await api.post("/news", newsData);
    return response.data;
  },

  // Update news (admin only)
  update: async (id, newsData) => {
    const response = await api.put(`/news/${id}`, newsData);
    return response.data;
  },

  // Delete news (admin only)
  delete: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  // Toggle status (admin only)
  toggleStatus: async (id) => {
    const response = await api.patch(`/news/${id}/status`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get("/news/categories/list");
    return response.data;
  },
};

export default newsAPI;
