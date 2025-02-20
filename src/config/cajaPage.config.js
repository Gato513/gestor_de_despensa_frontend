import { formatAsOption } from "@/util/formatter";

// Configuración de filtros:
export const defaultFilterConfig = {
    defaultValues: {
        nombre_usuario: "",
        movimiento: "",
        fecha: "",
    },
    accessFilterValues: ["nombre_usuario", "movimiento", "fecha"],
    inputs: [
        {
            name: "fecha",
            label: "Fecha transacción",
            required: false,
            type: "date",
            inputWidth: null,
        },
        {
            name: "movimiento",
            label: "Tipo de movimiento",
            required: false,
            type: "dropdownMenu",
            inputWidth: null,
            options: [
                { value: "entrada", label: "Entrada" },
                { value: "salida", label: "Salida" },
            ],
        },
    ],
    filterName: "Registros del flujo de caja"
};

// Generacion dinamica de input para filtros:
export const generateDynamicInputs = (rows) => [
    { name: "nombre_usuario", label: "Nombre del Usuario", options: formatAsOption(rows, "nombre_usuario") },
];

// Configuración para columnas
export const accessToRows = [
    "nombre_usuario", "numero_de_factura", "fecha", "hora", "monto", "movimiento"
];

export const headOfColumns = [
    { id: 'nombre_usuario', label: 'Nombre del usuario' },
    { id: 'numero_de_factura', label: 'Numero de factura' },
    { id: 'fecha', label: 'Fecha transaccion' },
    { id: 'hora', label: 'Hora transaccion' },
    { id: 'monto', label: 'Monto de transaccion' },
    { id: 'movimiento', label: 'Tipo de transaccion' },

];

// Configuración botones de accion:
export const bottonActionConfig = {
    page: "caja",
    allowedButtons: [],
    accessId: "id"
}