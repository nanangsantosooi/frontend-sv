import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const articleApi = {
  // 1. Create Article: POST /article/
  createArticle: async (data) => {
    const response = await apiClient.post('/article/', data);
    return response.data;
  },

  // 2. Get Articles with Pagination: GET /article/<limit>/<offset>
  getArticlesPaged: async (limit = 10, offset = 0, status = '') => {
    const params = {};
    if (status) params.status = status;
    const response = await apiClient.get(`/article/${limit}/${offset}`, { params });
    return response.data;
  },

  // 3. Get Article by ID: GET /article/<id>
  getArticleById: async (id) => {
    const response = await apiClient.get(`/article/${id}`);
    return response.data;
  },

  // 4. Update Article: PUT /article/<id> (or PATCH/POST)
  updateArticle: async (id, data) => {
    const response = await apiClient.put(`/article/${id}`, data);
    return response.data;
  },

  // 5. Delete Article: DELETE /article/<id>
  deleteArticle: async (id) => {
    const response = await apiClient.delete(`/article/${id}`);
    return response.data;
  },

  // Helper: Move to trash (update status to 'thrash')
  moveToTrash: async (id, currentArticle) => {
    const response = await apiClient.put(`/article/${id}`, {
      title: currentArticle.title,
      content: currentArticle.content,
      category: currentArticle.category,
      status: 'thrash',
    });
    return response.data;
  },

  // Helper: Restore from trash (update status to 'publish' or 'draft')
  restoreArticle: async (id, currentArticle, targetStatus = 'draft') => {
    const response = await apiClient.put(`/article/${id}`, {
      title: currentArticle.title,
      content: currentArticle.content,
      category: currentArticle.category,
      status: targetStatus,
    });
    return response.data;
  },

  // Helper: Get counts for tabs
  getStatsCounts: async () => {
    try {
      const response = await apiClient.get('/article/stats/counts');
      return response.data;
    } catch {
      return { publish: 0, draft: 0, thrash: 0, total: 0 };
    }
  },
};

export default articleApi;
