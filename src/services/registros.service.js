import api from "./api.access";

//$ Registros de caja:
//@ Obtener todos los movimientos de caja:
export const fetchAllCajaData = async () => {
    const { data } = await api.get(`/registros/caja`);
    return data;
};

//$ Registro de Auditorias:
//& Obtener todos los registros de auditorias:
export const fetchAllAuditoriaData = async () => {
    const { data } = await api.get(`/registros/auditoria`);
    return data;
};

//& Obtener una auditoria por su ID:
export const fetchAllAuditoriaDataById = async (id) => {
    const { data } = await api.get(`/registros/auditorias/detail/${id}`);
    return data;
};

//$ Registro de Facturas:
//% Obtener todos los registros de facturas:
export const fetchAllFacturaData = async () => {
    const { data } = await api.get(`/registros/facturas`);
    return data;
};

//% Obtener una factura por su ID:
export const fetchAllFacturaDataById = async (id, facturaType) => {
    const { data } = await api.get(`/registros/facturas/detail/${id}/?facturaType=${facturaType}`);
    return data;
};