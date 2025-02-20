import api from "./api.access";

//@ Obtener todos los clientes:
export const fetchAllCustomers = async () => {
    const { data } = await api.get(`/customer`);
    return data;
};

//@ Obtener un cliente por su ID:
export const fetchCustomerById = async (id) => {
    const { data } = await api.get(`/customer/${id}`);
    return data;
};

//$ Crear un cliente:
export const createCustomer = async (clientData) => {
    const { data } = await api.post(`/customer`, clientData);
    return data;
};

//% Actualizar un cliente:
export const updateCustomer = async (id, data) => {
    await api.put(`/customer/${id}`, data);
};

//() Ocultar un cliente:
export const hideCliente = async (id) => {
    await api.patch(`/customer/${id}`);
};