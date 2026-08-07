// PATH: client/src/services/userService.js  (NEW FILE)
import api from './api';

export const fetchAddresses = () => api.get('/users/addresses').then((r) => r.data);
export const addAddress = (data) => api.post('/users/addresses', data).then((r) => r.data);
export const updateAddress = (id, data) => api.put(`/users/addresses/${id}`, data).then((r) => r.data);
export const deleteAddress = (id) => api.delete(`/users/addresses/${id}`).then((r) => r.data);
export const setDefaultAddress = (id) => api.put(`/users/addresses/${id}/default`).then((r) => r.data);