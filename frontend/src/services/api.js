import axios from 'axios';
import { getToken, removeTokens } from '../utils/auth';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized (token expired or invalid)
      if (error.response.status === 401) {
        // Remove tokens and redirect to login
        removeTokens();
        window.location.href = '/login';
      }
      
      // Handle other errors
      const errorMessage = error.response.data?.error || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(error);
    }
  }
);

// Auth API
export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/me', userData),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/change-password', { currentPassword, newPassword }),
};

// Users API
export const usersApi = {
  getUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Events API
export const eventsApi = {
  getEvents: (params) => api.get('/events', { params }),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  uploadEventCover: (eventId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/events/${eventId}/upload-cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Venues API
export const venuesApi = {
  getVenues: (params) => api.get('/venues', { params }),
  getVenueById: (id) => api.get(`/venues/${id}`),
  createVenue: (venueData) => api.post('/venues', venueData),
  updateVenue: (id, venueData) => api.put(`/venues/${id}`, venueData),
  deleteVenue: (id) => api.delete(`/venues/${id}`),
};

// Tasks API
export const tasksApi = {
  getTasks: (params) => api.get('/tasks', { params }),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post('/tasks', taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  completeTask: (id) => api.post(`/tasks/${id}/complete`),
};

// Budgets API
export const budgetsApi = {
  getBudgets: (params) => api.get('/budgets', { params }),
  getBudgetById: (id) => api.get(`/budgets/${id}`),
  createBudget: (budgetData) => api.post('/budgets', budgetData),
  updateBudget: (id, budgetData) => api.put(`/budgets/${id}`, budgetData),
  deleteBudget: (id) => api.delete(`/budgets/${id}`),
  
  // Budget Items
  getBudgetItems: (budgetId) => api.get(`/budgets/${budgetId}/items`),
  createBudgetItem: (budgetId, itemData) => 
    api.post(`/budgets/${budgetId}/items`, itemData),
  updateBudgetItem: (itemId, itemData) => 
    api.put(`/budgets/items/${itemId}`, itemData),
  deleteBudgetItem: (itemId) => 
    api.delete(`/budgets/items/${itemId}`),
};

export default api;
