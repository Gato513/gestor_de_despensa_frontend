import { formatAsOption } from "@/util/formatter";

// Configuración para columnas
export const accessToRows = [
    "id_cliente", "nombre_cliente", "telefono_cliente", "direccion_cliente"
];

export const headOfColumns = [
    { id: 'id_cliente', label: 'Id' },
    { id: 'nombre_cliente', label: 'Nombre del cliente', },
    { id: 'telefono_cliente', label: 'Telefono del cliente', },
    { id: 'direccion_cliente', label: 'Direccion del cliente', },
];

// Configuración de filtros:
export const defaultFilterConfig = {
    defaultValues: {
        nombre_cliente: "",
        telefono_cliente: "",
        direccion_cliente: "",
    },
    accessFilterValues: ["nombre_cliente", "telefono_cliente", "direccion_cliente"],
    inputs: [],
    filterName: "Lista de clientes"
};

// Generacion dinamica de input para filtros:
export const generateDynamicInputs = (rows) => [
    { name: "nombre_cliente", label: "Nombre del cliente", options: formatAsOption(rows, "nombre_cliente") },
    { name: "telefono_cliente", label: "Telefono del cliente", options: formatAsOption(rows, "telefono_cliente") },
    { name: "direccion_cliente", label: "Direccion del cliente", options: formatAsOption(rows, "direccion_cliente") },
];