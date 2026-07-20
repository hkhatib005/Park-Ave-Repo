import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

const adminHeaders = () => {
  const token = localStorage.getItem('paj_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const customerHeaders = () => {
  const token = localStorage.getItem('paj_customer_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Products — public reads, admin writes
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = id => api.get(`/products/${id}`);
export const getCategories = () => api.get('/products/categories');
export const createProduct = data => api.post('/products', data, { headers: adminHeaders() });
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, { headers: adminHeaders() });
export const deleteProduct = id => api.delete(`/products/${id}`, { headers: adminHeaders() });

// Orders — admin only (order creation happens via /checkout)
export const getOrders = () => api.get('/orders', { headers: adminHeaders() });
export const getOrder = id => api.get(`/orders/${id}`, { headers: adminHeaders() });
export const updateOrderStatus = (id, status, extra = {}) => api.patch(`/orders/${id}/status`, { status, ...extra }, { headers: adminHeaders() });
export const updateOrderPayment = (id, payment_status, payment_method) =>
  api.patch(`/orders/${id}/payment`, { payment_status, payment_method }, { headers: adminHeaders() });

// Checkout — creates the order + a Stripe Checkout session
export const createCheckoutSession = data => api.post('/checkout/create-session', data, { headers: customerHeaders() });

// Admin auth
export const adminLogin = (email, password) => api.post('/auth/login', { email, password });

// Customer accounts
export const registerCustomer = (name, email, password) => api.post('/account/register', { name, email, password });
export const loginCustomer = (email, password) => api.post('/account/login', { email, password });
export const googleLogin = credential => api.post('/account/google', { credential });
export const forgotPassword = email => api.post('/account/forgot-password', { email });
export const resetPassword = (token, password) => api.post('/account/reset-password', { token, password });
export const getMe = () => api.get('/account/me', { headers: customerHeaders() });
export const getMyOrders = () => api.get('/account/orders', { headers: customerHeaders() });
export const deleteMyAccount = password => api.delete('/account/me', { data: { password }, headers: customerHeaders() });

// Admin — customer accounts view
export const getCustomers = () => api.get('/admin/customers', { headers: adminHeaders() });
export const getCustomer = id => api.get(`/admin/customers/${id}`, { headers: adminHeaders() });

export const uploadImages = formData => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data', ...adminHeaders() }
});

export const sendContact = data => api.post('/contact', data);
export const getContacts = () => api.get('/contact', { headers: adminHeaders() });
export const markContactRead = id => api.patch(`/contact/${id}/read`, {}, { headers: adminHeaders() });

export const subscribeNewsletter = email => api.post('/newsletter', { email });
export const getNewsletterSubscribers = () => api.get('/newsletter', { headers: adminHeaders() });

export default api;
