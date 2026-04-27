import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://expense-tracking-mern.onrender.com/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Expense API functions
export const expenseAPI = {
  // Get all expenses with optional filters
  getExpenses: (params = {}) => {
    return apiClient.get('/expenses', { params });
  },

  // Get single expense
  getExpense: (id) => {
    return apiClient.get(`/expenses/${id}`);
  },

  // Create new expense
  createExpense: (data) => {
    return apiClient.post('/expenses', data);
  },

  // Update expense
  updateExpense: (id, data) => {
    return apiClient.put(`/expenses/${id}`, data);
  },

  // Delete expense
  deleteExpense: (id) => {
    return apiClient.delete(`/expenses/${id}`);
  },

  // Get expense statistics
  getStats: () => {
    return apiClient.get('/expenses/stats/summary');
  }
};

// Budget API functions
export const budgetAPI = {
  // Get all budgets for a month
  getBudgets: (params = {}) => {
    return apiClient.get('/budgets', { params });
  },

  // Get single budget
  getBudget: (id) => {
    return apiClient.get(`/budgets/${id}`);
  },

  // Create new budget
  createBudget: (data) => {
    return apiClient.post('/budgets', data);
  },

  // Update budget
  updateBudget: (id, data) => {
    return apiClient.put(`/budgets/${id}`, data);
  },

  // Delete budget
  deleteBudget: (id) => {
    return apiClient.delete(`/budgets/${id}`);
  }
};

// Analytics API functions
export const analyticsAPI = {
  // Get monthly analytics
  getMonthly: (month) => {
    return apiClient.get('/analytics/monthly', { params: { month } });
  },

  // Get spending trends (last 12 months)
  getTrends: () => {
    return apiClient.get('/analytics/trends');
  },

  // Get category breakdown
  getCategories: (month) => {
    return apiClient.get('/analytics/categories', { params: { month } });
  },

  // Get month comparison
  getComparison: () => {
    return apiClient.get('/analytics/comparison');
  },

  // Get spending forecast
  getForecast: (month) => {
    return apiClient.get('/analytics/forecast', { params: { month } });
  },

  // Get AI insights
  getInsights: () => {
    return apiClient.get('/insights');
  },

  // Get anomalies
  getAnomalies: () => {
    return apiClient.get('/insights/anomalies');
  },

  // Get category-specific insights
  getCategoryInsights: (category) => {
    return apiClient.get(`/insights/categories/${category}`);
  },

  // Chat with AI about expenses
  chatWithAI: (message) => {
    return apiClient.post('/insights/chat', { message });
  }
};

// Auth API functions
export const authAPI = {
  // Login
  login: (data) => {
    return apiClient.post('/auth/login', data);
  },

  // Register
  register: (data) => {
    return apiClient.post('/auth/register', data);
  },

  // Get profile
  getProfile: () => {
    return apiClient.get('/auth/profile');
  }
};

export default apiClient;