import { hideCliente, updateCustomer } from "@/services/customers.service";
import { formatAsOption } from "@/util/formatter";

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

// Configuración para columnas
export const accessToRows = [
    "nombre_cliente", "telefono_cliente", "direccion_cliente"
];

export const headOfColumns = [
    { id: 'nombre_cliente', label: 'Nombre del cliente', },
    { id: 'telefono_cliente', label: 'Telefono del cliente', },
    { id: 'direccion_cliente', label: 'Direccion del cliente', },
    { id: '', label: 'Acciones', },
];

// Configuración botones de accion:
export const bottonActionConfig = {

    editConfigModal: {
        dialogTitle: "Editar Cliente",
        actionFunction: updateCustomer,
        type: "edit",
        fieldsToEdit: [
            "nombre_cliente", "telefono_cliente", "direccion_cliente"
        ]
    },

    disguiseConfigModal: {
        dialogTitle: "Ocultar cliente",
        dialogMessage: "¿Está seguro de querer ocultar este cliente?",
        actionFunction: hideCliente,
        type: "disguise",
    },
    page: "client",
    allowedButtons: ["details", "edit", "disguise"],
    accessId: "id_cliente"
}