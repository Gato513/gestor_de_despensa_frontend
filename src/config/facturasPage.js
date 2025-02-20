import { formatAsOption } from "@/util/formatter";

// Configuración de filtros:
export const defaultFilterConfig = {
    defaultValues: {
        nombre_entidad: "",
        tipo_factura: "",
        tipo_entida: "",
        fecha_facturacion: "",
    },
    accessFilterValues: ["nombre_entidad", "tipo_entida", "tipo_factura", "fecha_facturacion"],
    inputs: [
        {
            name: "fecha_facturacion",
            label: "Fecha Facturacion",
            required: false,
            type: "date",
            inputWidth: null,
        },
    ],
    filterName: "Registros de facturas"
};

// Generacion dinamica de input para filtros:
export const generateDynamicInputs = (rows) => [
    { name: "nombre_entidad", label: "Nombre_Entidad", options: formatAsOption(rows, "nombre_entidad") },
    { name: "tipo_entida", label: "Tipo Entida", options: formatAsOption(rows, "tipo_entida") },
    { name: "tipo_factura", label: "Tipo Factura", options: formatAsOption(rows, "tipo_factura") },
];

// Configuración para columnas
export const accessToRows = [
    "numero_factura", "tipo_factura", "nombre_entidad", "tipo_entida", "fecha_facturacion", "hora_facturacion", "monto_facturado"
];

export const headOfColumns = [
    { id: 'numero_factura', label: 'Numero Factura' },
    { id: 'tipo_factura', label: 'Tipo Factura' },
    { id: 'nombre_entidad', label: 'Nombre Entidad' },
    { id: 'tipo_entida', label: 'Tipo Entidad' },
    { id: 'fecha_facturacion', label: 'Fecha Facturacion' },
    { id: 'hora_facturacion', label: 'Hora Facturacion' },
    { id: 'monto_facturado', label: 'Monto_Facturado' },
    { id: '', label: 'Accion', },
];

// Configuración botones de accion:
export const bottonActionConfig = {
    allowedButtons: ["details",],
    accessId: "numero_factura",
    page: "facturas"
}