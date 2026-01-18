import api from "./axios";

export const reportsAPI = {
  // Get all reports (with pagination and filters)
  getAll: async (params = {}) => {
    const response = await api.get("/reports", { params });
    return response.data;
  },

  // Get single report by ID
  getById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  // Create report (admin only)
  create: async (reportData) => {
    const response = await api.post("/reports", reportData);
    return response.data;
  },

  // Update report (admin only)
  update: async (id, reportData) => {
    const response = await api.put(`/reports/${id}`, reportData);
    return response.data;
  },

  // Delete report (admin only)
  delete: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },

  // Toggle status (admin only)
  toggleStatus: async (id) => {
    const response = await api.patch(`/reports/${id}/status`);
    return response.data;
  },

  // Get tags
  getTags: async () => {
    const response = await api.get("/reports/tags/list");
    return response.data;
  },

  // Send preview to manager (admin only)
  sendPreview: async (previewData) => {
    const response = await api.post("/reports/send-preview", previewData);
    return response.data;
  },
};

export default reportsAPI;
