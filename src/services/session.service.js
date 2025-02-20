import api from '@/services/api.access';

// Función de sesión
export const login = async (dataLogin) => {
  const { data } = await api.post(`/session/login`, dataLogin);
  return data;
};

export const getLoginUser = async () => {
  try {
    const { data } = await api.get(`/session/getLoginUser`);
    return data; // Retorna { nombre_usuario, role }
  } catch (error) {
    return null;
  }
};

export const passwordResetToken = async (params = {}) => {
  const { data } = await api.get(`/user/passwordReset`, { params });
  return data;
};

export const passwordReset = async (passwordResetData) => {
  const { data } = await api.patch(`/user/passwordReset`, passwordResetData);
  return data;
};
