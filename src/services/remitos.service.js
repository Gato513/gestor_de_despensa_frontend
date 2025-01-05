import api from "./api.access";

//@ Obtener todos los remitos:
export const fetchAllRemitos = async () => {
    const { data } = await api.get(`/remitos`);
    return data;
};

export const searchAllCustomerRemitos = async (clientId) => {
    // const { data } = await api.get(`/remitos/byClient/${clientId}`);
    return [
        { id_remito: 1, fecha_remito: "2024-01-01", saldo_restante: 100, monto_total: 100, estado: "Pendiente" },
        { id_remito: 2, fecha_remito: "2024-01-05", saldo_restante: 10,  monto_total: 10, estado: "Pendiente" },
        { id_remito: 3, fecha_remito: "2024-01-10", saldo_restante: 100, monto_total: 100, estado: "Pendiente" },
        { id_remito: 4, fecha_remito: "2024-01-11", saldo_restante: 100, monto_total: 100, estado: "Pendiente" },
    ];
}

//@ Obtener un remito por su ID:
export const fetchRemitoById = async (id) => {
    const response = await api.get(`/remitos/${id}`);
    return response.data;
};

//$ Crear un remito:
export const createRemito = async (remitoData) => {
    await api.post(`/remitos`, remitoData);
    return
};

//% Actualizar un remito:
export const updateRemito = async (id, data) => {
    const response = await api.put(`/remitos/${id}`, data);
    return response.data;
};

//! Eliminar un remito:
export const deleteRemito = async (id) => {
    const response = await api.delete(`/remitos/${id}`);
    return response.data;
};

//& Cobranza y Facturacion de Remitos:
export const remittanceBilling = async (billingData) => {
    await api.post(`/remitos/billing`, billingData);
    return
}