import { formatAsOption } from "@/util/formatter";

// Inputs por defecto del filtro:
const defaulInput = [
    {
        name: "fecha_remito",
        label: "Fecha remito",
        required: false,
        type: "date",
        inputWidth: null,
    },
]

// Configuración de filtros:
export const defaultFilterConfig = {
    defaultValues: {
        cliente: "",
        fecha_remito: "",
        estado: "",
    },
    accessFilterValues: ["cliente", "fecha_remito", "estado"],
    inputs: [...defaulInput],
    filterName: "Lista de Remitos"
};

// Generacion dinamica de input para filtros:
export const generateDynamicInputs = (rows) => [
    { name: "cliente", label: "Nombre cliente", options: formatAsOption(rows, "cliente") },
    { name: "estado", label: "Estado", options: formatAsOption(rows, "estado") },
];


// Configuración para Tabla:
export const accessToRows = [
    "id", "cliente", "fecha_remito", "monto_total", "saldo_restante", "estado"
];

export const headOfColumns = [
    { id: 'id', label: 'Nº Remito', },
    { id: 'cliente', label: 'Nombre cliente', },
    { id: 'fecha_remito', label: 'Fecha remito', },
    { id: 'monto_total', label: 'Monto total', },
    { id: 'saldo_restante', label: 'Saldo restante', },
    { id: 'estado', label: 'Estado', },
    { id: '', label: 'Acciones', },
];


// Configuración botones de accion:
export const bottonActionConfig = {
    allowedButtons: ["details",],
    accessId: "id",
    page: "remito"
}
