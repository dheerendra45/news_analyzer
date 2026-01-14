import api from "./axios";

export const authAPI = {
  // Login user
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Register admin (self-registration with domain validation)
  registerAdmin: async (adminData) => {
    const response = await api.post("/auth/admin/register", adminData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Create admin (admin only)
  createAdmin: async (adminData) => {
    const response = await api.post("/auth/admin/create", adminData);
    return response.data;
  },

  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/auth/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Upload PDF
  uploadPdf: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/auth/upload/pdf", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default authAPI;
