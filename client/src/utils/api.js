import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth
export const signup = (email, password, username) =>
  api.post('/auth/signup', { email, password, username });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const verifyToken = () => api.post('/auth/verify');

// User
export const getDashboard = () => api.get('/user/dashboard');

// Earnings
export const logEarning = (amount, ad_type) =>
  api.post('/earnings/log', { amount, ad_type });

export const getEarningsHistory = () => api.get('/earnings/history');

// Payouts
export const requestPayout = (amount, payment_method, payment_details) =>
  api.post('/payouts/request', { amount, payment_method, payment_details });

export const getPayoutRequests = () => api.get('/payouts/requests');

// Admin
export const getAdminOverview = () => api.get('/admin/overview');

export const getAdminPayouts = (status) =>
  api.get('/admin/payouts', { params: { status } });

export const updatePayoutStatus = (id, status, admin_note) =>
  api.patch(`/admin/payouts/${id}`, { status, admin_note });

export const getAdminUsers = (search) =>
  api.get('/admin/users', { params: { search } });

export const getAdminUser = (id) => api.get(`/admin/users/${id}`);

export const getAdminSettings = () => api.get('/admin/settings');

export const updateAdminSetting = (setting_key, setting_value) =>
  api.put('/admin/settings', { setting_key, setting_value });

export const getVideoAdValue = () => api.get('/admin/settings/video-ad-value');

export default api;
