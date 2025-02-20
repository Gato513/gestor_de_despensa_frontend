import api from "./api.access";

//@ Obtener todos los Usuarios:
export const fetchAllUsers = async () => {
    const { data } = await api.get(`/user`);
    return data;
};

//( Obtener un Usuario por su ID:
export const fetchUserById = async (id) => {
    const { data } = await api.get(`/user/${id}`);
    return data;
};

//$ Crear un Usuario:
export const createUser = async (clientData) => {
    const { data } = await api.post(`/user`, clientData);
    return data;
};

//% Actualizar un Usuario:
export const updateUser = async (id, data) => {
    await api.put(`/user/${id}`, data);
};

//() Ocultar un Usuario:
export const hideUser = async (id) => {
    await api.patch(`/user/${id}`);
};