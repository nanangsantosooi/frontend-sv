import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000, // Quick timeout so it falls back swiftly if offline
});

// Initial mock data for Demo Mode when backend is offline
const INITIAL_DEMO_POSTS = [
  {
    id: 1,
    title: 'Panduan Lengkap Implementasi Golang Clean Architecture dan REST API',
    content: 'Golang adalah salah satu bahasa pemrograman modern yang dirancang oleh Google untuk membangun sistem berkinerja tinggi, berskala besar, dan andal. Dalam arsitektur microservices modern, Golang sering digunakan untuk backend API karena efisiensinya yang luar biasa dalam menangani concurrency menggunakan goroutines dan channels. Dengan framework seperti Gin atau Fiber, pembuatan REST API menjadi sangat terstruktur, cepat, dan mudah dipelihara dalam jangka panjang.',
    category: 'Technology',
    status: 'publish',
    created_date: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_date: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 2,
    title: 'Masa Depan AI dan Engineering di Era Modern Revolusi Industri',
    content: 'Kecerdasan buatan atau Artificial Intelligence saat ini merevolusi bagaimana para software engineer membangun aplikasi berskala besar. Mulai dari penulisan kode cerdas, otomatisasi pengetesan kode, hingga deployment pipeline cerdas berbasis cloud. Pengembangan sistem saat ini dituntut untuk selalu adaptif terhadap teknologi baru yang bermunculan secara cepat.',
    category: 'Artificial Intelligence',
    status: 'draft',
    created_date: new Date(Date.now() - 3600000 * 12).toISOString(),
    updated_date: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 3,
    title: 'Artikel Percobaan Dihapus Yang Masuk Kategori Thrash Untuk Pengujian',
    content: 'Ini merupakan sebuah artikel percobaan yang dibuat khusus untuk menguji apakah sistem tabulasi trash atau thrash pada frontend dan backend berjalan sebagaimana mestinya tanpa kendala. Validasi konten ini sudah melebihi dua ratus karakter agar lolos validasi request backend API.',
    category: 'Testing',
    status: 'thrash',
    created_date: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_date: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 4,
    title: 'Prinsip Desain Monokrom Minimalis untuk Dashboard Modern',
    content: 'Desain antarmuka monokrom menekankan kontras yang kuat, keterbacaan tipografi kelas satu, dan kesederhanaan visual. Dengan menyingkirkan elemen warna yang berlebihan, pengguna dapat lebih fokus pada konten esensial dan data yang disajikan. Filosofi ini banyak diadopsi oleh platform modern seperti Linear, Vercel, dan Stripe untuk memberikan pengalaman pengguna yang profesional.',
    category: 'Design System',
    status: 'publish',
    created_date: new Date(Date.now() - 3600000 * 6).toISOString(),
    updated_date: new Date(Date.now() - 3600000 * 6).toISOString(),
  }
];

const STORAGE_KEY = 'sv_articles_data';

// Local storage helper
const getLocalPosts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_POSTS));
      return INITIAL_DEMO_POSTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_POSTS;
  }
};

const saveLocalPosts = (posts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
};

let isBackendAvailable = null; // null = untested, true = online, false = offline

export const articleApi = {
  // Check backend health
  checkHealth: async () => {
    try {
      await apiClient.get('/health');
      isBackendAvailable = true;
      return true;
    } catch {
      isBackendAvailable = false;
      return false;
    }
  },

  isLiveBackend: () => isBackendAvailable,

  // 1. Create Article: POST /article/
  createArticle: async (data) => {
    try {
      const response = await apiClient.post('/article/', data);
      isBackendAvailable = true;
      return response.data;
    } catch (err) {
      // If network error, fallback to local demo mode
      if (!err.response) {
        isBackendAvailable = false;
        const posts = getLocalPosts();
        const newPost = {
          id: Date.now(),
          ...data,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString(),
        };
        posts.unshift(newPost);
        saveLocalPosts(posts);
        return {};
      }
      throw err;
    }
  },

  // 2. Get Articles with Pagination: GET /article/<limit>/<offset>
  getArticlesPaged: async (limit = 10, offset = 0, status = '') => {
    try {
      const params = {};
      if (status) params.status = status;
      const response = await apiClient.get(`/article/${limit}/${offset}`, { params });
      isBackendAvailable = true;
      return response.data;
    } catch (err) {
      if (!err.response) {
        isBackendAvailable = false;
        let posts = getLocalPosts();
        if (status) {
          posts = posts.filter((p) => p.status?.toLowerCase() === status.toLowerCase());
        }
        return posts.slice(offset, offset + limit);
      }
      throw err;
    }
  },

  // 3. Get Article by ID: GET /article/<id>
  getArticleById: async (id) => {
    try {
      const response = await apiClient.get(`/article/${id}`);
      isBackendAvailable = true;
      return response.data;
    } catch (err) {
      if (!err.response) {
        isBackendAvailable = false;
        const posts = getLocalPosts();
        const found = posts.find((p) => String(p.id) === String(id));
        if (found) return found;
      }
      throw err;
    }
  },

  // 4. Update Article: PUT /article/<id>
  updateArticle: async (id, data) => {
    try {
      const response = await apiClient.put(`/article/${id}`, data);
      isBackendAvailable = true;
      return response.data;
    } catch (err) {
      if (!err.response) {
        isBackendAvailable = false;
        const posts = getLocalPosts();
        const index = posts.findIndex((p) => String(p.id) === String(id));
        if (index !== -1) {
          posts[index] = {
            ...posts[index],
            ...data,
            updated_date: new Date().toISOString(),
          };
          saveLocalPosts(posts);
          return {};
        }
      }
      throw err;
    }
  },

  // 5. Delete Article: DELETE /article/<id>
  deleteArticle: async (id) => {
    try {
      const response = await apiClient.delete(`/article/${id}`);
      isBackendAvailable = true;
      return response.data;
    } catch (err) {
      if (!err.response) {
        isBackendAvailable = false;
        const posts = getLocalPosts().filter((p) => String(p.id) !== String(id));
        saveLocalPosts(posts);
        return {};
      }
      throw err;
    }
  },

  // Helper: Move to trash
  moveToTrash: async (id, currentArticle) => {
    return articleApi.updateArticle(id, {
      title: currentArticle.title,
      content: currentArticle.content,
      category: currentArticle.category,
      status: 'thrash',
    });
  },

  // Helper: Restore from trash
  restoreArticle: async (id, currentArticle, targetStatus = 'draft') => {
    return articleApi.updateArticle(id, {
      title: currentArticle.title,
      content: currentArticle.content,
      category: currentArticle.category,
      status: targetStatus,
    });
  },

  // Helper: Get counts for tabs
  getStatsCounts: async () => {
    try {
      const response = await apiClient.get('/article/stats/counts');
      isBackendAvailable = true;
      return response.data;
    } catch {
      // In offline/demo mode, compute from local posts
      const posts = getLocalPosts();
      const counts = { publish: 0, draft: 0, thrash: 0, total: posts.length };
      posts.forEach((p) => {
        const s = (p.status || '').toLowerCase();
        if (counts[s] !== undefined) counts[s]++;
      });
      return counts;
    }
  },
};

export default articleApi;
