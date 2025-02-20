import api from "./api.access";

//@ Obtener todos los proveedores:
export const fetchAllProveedores = async () => {
    const { data } = await api.get(`/proveedor`);
    return data
};

//@ Obtener un proveedor por su ID:
export const fetchProveedorById = async (id) => {
    const { data } = await api.get(`/proveedor/${id}`);
    return data;
};

//$ Crear un proveedor:
export const createProveedor = async (clientData) => {
    const { data } = await api.post(`/proveedor`, clientData)
    return data;
};

//% Actualizar un proveedor:
export const updateProveedor = async (id, data) => {
    await api.put(`/proveedor/${id}`, data);
};

//() Ocultar un proveedor:
export const hideProveedor = async (id) => {
    await api.patch(`/proveedor/${id}`);
};

