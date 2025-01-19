import api from "./api.access";

//$ Compra de productos:
export const PurchaseProduct = async (purchaseData) => {
    const { data } = await api.post('/transactions/purchase', purchaseData);
    return data;
}

//% Cobranza y facturaxion de remitos:
export const collectionAndBilling = async (billingData) => {
    await api.post(`/transactions/collectionAndBilling`, billingData);
    return
}