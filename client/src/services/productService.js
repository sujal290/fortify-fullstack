import api from './api';

export const fetchProducts = (params) => api.get('/products', { params }).then((r) => r.data);
export const fetchProductTags = () => api.get('/products/tags').then((r) => r.data);
export const fetchProductById = (id, admin = false) => api.get(`/products/${id}`, { params: admin ? { admin: 'true' } : {} }).then((r) => r.data);
export const createProduct = (data) => api.post('/products', data).then((r) => r.data.product ?? r.data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data).then((r) => r.data.product ?? r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
export const restoreProduct = (id) => api.put(`/products/${id}/restore`).then((r) => r.data);