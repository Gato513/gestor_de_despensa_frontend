import api from "./api.access";

//@ Obtener todos los remitos:
export const fetchAllRemitos = async () => {
    const response = await api.get(`/customer`);
    return response.data;
};

//@ Obtener un remito por su ID:
export const fetchRemitoById = async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};

//$ Crear un remito:
export const createRemito = async (remitoData) => {
    await api.post(`/remitos`, remitoData);
    return
};

//% Actualizar un remito:
export const updateRemito = async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
};

//! Eliminar un remito:
export const deleteRemito = async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
};