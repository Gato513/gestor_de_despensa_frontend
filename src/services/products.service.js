import api from "./api.access";

//@ Obtener productos con filtro opcional por estado:
export const fetchAllProducts = async (estado = "") => {
    const url = estado ? `/products?estado=${estado}` : `/products`;
    const { data } = await api.get(url);
    return data;
};

//@ Obtener productos filtrados:
export const fetchFilteredProducts = async (filters) => {
    const { data } = await api.get(`/products/filter`, filters);
    return data;
};

//@ Obtener comprobacion de stock minimo:
export const minimumStockControl = async () => {
    const { data } = await api.get("/products/minimumStockControl");
    return data;
};

//@ Obtener un producto por su ID:
export const fetchProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

//$ Crear un producto:
export const createProduct = async (productData) => {
    const { data } = await api.post(`/products`, productData);
    return data;
};

//% Actualizar un producto:
export const updateProduct = async (id, updateData) => {
    await api.put(`/products/${id}`, updateData);
};

//() Ocultar un producto:
export const hideProduct = async (id) => {
    await api.patch(`/products/${id}`);
};