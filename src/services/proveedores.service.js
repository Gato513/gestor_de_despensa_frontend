import api from "./api.access";

//@ Obtener todos los proveedores:
export const fetchAllProveedores = async () => {
    const { data } = await api.get(`/proveedor`);
    return data
};

// //( Obtener un proveedor por su ID:
// export const fetchProveedorById = async (id) => {
//     const { data } = await api.get(`/proveedor/${id}`);
//     return data;
// };

// //$ Crear un proveedor:
// export const createProveedor = async (clientData) => {
//     await api.post(`/proveedor`, clientData);
//     return
// };

// //% Actualizar un proveedor:
// export const updateProveedor = async (id, data) => {
//     const { data } = await api.put(`/proveedor/${id}`, data);
//     return data;
// };

// //! Eliminar un proveedor:
// export const deleteProveedor = async (id) => {
//     const { data } = await api.delete(`/proveedor/${id}`);
//     return data;
// };