import { formatAsOption } from "@/util/formatter";

// Configuración de filtros:

// Inputs por defecto del filtro:
const defaulInput = [
    {
        name: "registro_afectado",
        label: "Numero Registro",
        required: false,
        type: "text",
        inputWidth: null,
    },
    {
        name: "fecha_de_cambio",
        label: "Fecha de Cambio",
        required: false,
        type: "date",
        inputWidth: null,
    },
]

export const defaultFilterConfig = {
    defaultValues: {
        responsable: "",
        tabla_afectada: "",
        registro_afectado: "",
        fecha_de_cambio: "",
    },
    accessFilterValues: ["responsable", "tabla_afectada", "registro_afectado", "fecha_de_cambio"],
    inputs: [...defaulInput],
    filterName: "Registros de Auditorias"
};

// Generacion dinamica de input para filtros:
export const generateDynamicInputs = (rows) => [
    { name: "responsable", label: "Nombre del Responsable", options: formatAsOption(rows, "responsable") },
    { name: "tabla_afectada", label: "Tabla Afectada", options: formatAsOption(rows, "tabla_afectada") },
];

// Configuración para columnas
export const accessToRows = [
    "numero_auditoria", "responsable", "tabla_afectada", "registro_afectado", "fecha_de_cambio", "hora_de_cambio"
];

export const headOfColumns = [
    { id: 'numero_auditoria', label: 'Numero de auditoria' },
    { id: 'responsable', label: 'Responsable' },
    { id: 'tabla_afectada', label: 'Tabla Afectada' },
    { id: 'registro_afectado', label: 'ID Registro Afectado' },
    { id: 'fecha_de_cambio', label: 'Fecha de Cambio' },
    { id: 'hora_de_cambio', label: 'Hora de Cambio' },
    { id: '', label: 'Accion', },
];

// Configuración botones de accion:
export const bottonActionConfig = {
    allowedButtons: ["details",],
    accessId: "numero_auditoria",
    page: "auditoria"
}