import api from "./api.access";

//@ Obtener todos los remitos:
export const fetchAllRemitos = async () => {
    const { data } = await api.get(`/remitos`);
    return data;
};

//@ Obtener todos los remitos de un cliente:
export const searchAllCustomerRemitos = async (clientId) => {
    const { data } = await api.get(`/remitos/byClient/${clientId}`);
    return data;
}

//@ Obtener un remito por su ID:
export const fetchRemitoById = async (id) => {
    const { data } = await api.get(`/remitos/${id}`);
    return data;
};

//$ Crear un remito:
export const createRemito = async (remitoData) => {
    await api.post(`/remitos`, remitoData);
    return
};

//! Eliminar un remito:
export const deleteRemito = async (id) => {
    const { data } = await api.delete(`/remitos/${id}`);
    return data;
};

//& Cobranza y Facturacion de Remitos:
export const remittanceBilling = async (billingData) => {
    await api.post(`/remitos/billing`, billingData);
    return
}