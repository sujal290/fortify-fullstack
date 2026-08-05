import api from './api';

export const placeOrder = (data) => api.post('/orders', data).then((r) => r.data);
export const fetchMyOrders = () => api.get('/orders/mine').then((r) => r.data);
export const fetchAllOrders = () => api.get('/orders').then((r) => r.data);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status }).then((r) => r.data);
