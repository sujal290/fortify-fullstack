import api from './api';

// multipart/form-data upload — axios sets the correct boundary header
// automatically when the body is a FormData instance.
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData).then((r) => r.data); // { url, publicId }
};
