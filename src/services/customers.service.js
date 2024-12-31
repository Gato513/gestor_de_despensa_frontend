import api from "./api.access";

//@ Obtener todos los clientes:
export const fetchAllCustomers = async () => {
    const response = await api.get(`/customer`);
    return response.data;
};

//( Obtener un cliente por su ID:
export const fetchCustomerById = async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
};

//$ Crear un cliente:
export const createCustomer = async (clientData) => {
    await api.post(`/customer`, clientData);
    return
};

//% Actualizar un cliente:
export const updateCustomer = async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
};

//! Eliminar un cliente:
export const deleteCustomer = async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
};