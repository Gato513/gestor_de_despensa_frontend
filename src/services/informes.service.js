import api from "./api.access";

//@ Obtener todos los datos para el informe de ventas:
export const fetchSalesReport = async (startDate, endDate) => {
    const { data } = await api.get(`/report/sales_report/?startDate=${startDate}&endDate=${endDate}`); 
    return data;
};

//@ Obtener todos los datos para el informe de inventario:
export const fetchInventoryReport = async (startDate, endDate) => {
    const { data } = await api.get(`/report/inventory_report/?startDate=${startDate}&endDate=${endDate}`);
    return data;
};

//@ Obtener todos los datos para el informe de deudas:
export const fetchDebtReport = async () => {
    const { data } = await api.get(`/report/debt_report`);
    return data;
};

//@ Obtener todos los datos para el informe de Compras a proveedores:
export const fetchPurchaseReport = async () => {
    const { data } = await api.get(`/report/purchase_report`);
    return data;
};

//@ Obtener todos los datos para el informe de flujo de caja:
export const fetchCashFlowReport = async(fecha, periodo) => {
    const { data } = await api.get(`/report/cash_flow_report/?fecha=${fecha}&periodo=${periodo}`);
    return data;
};

//@ Obtener todos los datos para el informe de Auditoria:
export const fetchAuditReport = async (startDate, endDate) => {
    const { data } = await api.get(`/report/audit_report/?startDate=${startDate}&endDate=${endDate}`);
    return data;
};
