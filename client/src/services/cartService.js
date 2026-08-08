// PATH: client/src/services/cartService.js  (REPLACES existing file)
import api from './api';

export const fetchCart = () => api.get('/cart').then((r) => r.data);
export const addToCart = (productId, variantId, qty = 1) => api.post('/cart', { productId, variantId, qty }).then((r) => r.data);
export const updateCartItem = (productId, qty, variantId) => api.put(`/cart/${productId}`, { qty, variantId }).then((r) => r.data);
export const removeCartItem = (productId, variantId) => api.delete(`/cart/${productId}`, { params: variantId ? { variantId } : {} }).then((r) => r.data);