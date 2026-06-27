import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('paj_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = id => api.get(`/products/${id}`);
export const getCategories = () => api.get('/products/categories');
export const createProduct = data => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = id => api.delete(`/products/${id}`);

export const getOrders = () => api.get('/orders');
export const getOrder = id => api.get(`/orders/${id}`);
export const placeOrder = data => api.post('/orders', data);
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });

export const adminLogin = (email, password) => api.post('/auth/login', { email, password });

export const uploadImages = formData => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const sendContact = data => api.post('/contact', data);

export default api;
