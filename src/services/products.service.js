import api from "./api.access";

//@ Obtener todos los productos:
export const fetchAllProducts = async () => {
    const response = await api.get(`/products`);
    return response.data;
};

//( Obtener un producto por su ID:
export const fetchProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};

//$ Crear un producto:
export const createProduct = async (clientData) => {
    await api.post(`/products`, clientData);
    return
};

//% Actualizar un producto:
export const updateProduct = async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
};

//! Eliminar un producto:
export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};

// & Compra de productos:
export const PurchaseProduct = async (purchaseData) => {
    const { data } = await api.post('/products/purchase', purchaseData);
    return data;
}