import api from "./api.access";

//@ Obtener todos los movimientos de caja:
export const fetchAllCajaData = async () => {
    const { data } = await api.get(`/caja`);
    return data;
};





