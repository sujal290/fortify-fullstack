import api from './api';

export const fetchCart = () => api.get('/cart').then((r) => r.data);
export const addToCart = (productId, qty = 1) => api.post('/cart', { productId, qty }).then((r) => r.data);
export const updateCartItem = (productId, qty) => api.put(`/cart/${productId}`, { qty }).then((r) => r.data);
export const removeCartItem = (productId) => api.delete(`/cart/${productId}`).then((r) => r.data);
