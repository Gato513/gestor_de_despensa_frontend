import api from '@/services/api.access';

// Función de sesión
export const login = async (data) => {
  const response = await api.post(`/session/login`, data);
  return response.data;
};

export const passwordResetToken = async (params = {}) => {
  const response = await api.get(`/user/passwordReset`, { params });
  return response.data;
};

export const passwordReset = async (data) => {
  const response = await api.patch(`/user/passwordReset`, data);
  return response.data;
};
