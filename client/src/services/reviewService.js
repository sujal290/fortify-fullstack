import api from './api';

export const fetchProductReviews = (productId) => api.get(`/products/${productId}/reviews`).then((r) => r.data);
export const createReview = (productId, data) => api.post(`/products/${productId}/reviews`, data).then((r) => r.data);
export const deleteReview = (productId, id) => api.delete(`/products/${productId}/reviews/${id}`).then((r) => r.data);
