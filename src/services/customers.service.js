import api from "./api.access";

//@ Obtener todos los clientes:
export const fetchAllCustomers = async () => {
    const { data } = await api.get(`/customer`);
    return data;
};

//( Obtener un cliente por su ID:
export const fetchCustomerById = async (id) => {
    const { data } = await api.get(`/customers/${id}`);
    return data;
};

//$ Crear un cliente:
export const createCustomer = async (clientData) => {
    const { data } = await api.post(`/customer`, clientData);
    return data;
};

//% Actualizar un cliente:
export const updateCustomer = async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
};

//! Eliminar un cliente:
export const deleteCustomer = async (id) => {
    const { data } = await api.delete(`/customers/${id}`);
    return data;
};