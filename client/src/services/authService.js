import api from './api';

export const registerUser = (data) => api.post('/auth/register', data).then((r) => r.data);
export const loginUser = (data) => api.post('/auth/login', data).then((r) => r.data);
export const getMe = () => api.get('/auth/me').then((r) => r.data);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email }).then((r) => r.data);
export const resetPassword = (payload) => api.post('/auth/reset-password', payload).then((r) => r.data);

// Redirect the browser to the API's Google OAuth entrypoint
export const googleLoginUrl = () => `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
