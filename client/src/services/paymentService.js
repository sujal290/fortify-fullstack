import api from './api';

export const createRazorpayOrder = (orderId) => api.post('/payments/create-order', { orderId }).then((r) => r.data);
export const verifyPayment = (data) => api.post('/payments/verify', data).then((r) => r.data);
