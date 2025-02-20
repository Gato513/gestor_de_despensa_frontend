import { hideProveedor, updateProveedor } from "@/services/proveedores.service";
import { formatAsOption } from "@/util/formatter";


// Configuración de filtros:
export const defaultFilterConfig = {
    defaultValues: {
        nombre_proveedor: "",
        telefono_proveedor: "",
        email_proveedor: "",
        direccion_proveedor: ""
    },
    accessFilterValues: ["nombre_proveedor", "telefono_proveedor", "email_proveedor", "direccion_proveedor"],
    inputs: [],
    filterName: "Lista de proveedores"
};

// Generacion dinamica de input para filtros:
export const generateDynamicInputs = (rows) => [
    { name: "nombre_proveedor", label: "Nombre del proveedor", options: formatAsOption(rows, "nombre_proveedor") },
    { name: "telefono_proveedor", label: "Teléfono del proveedor", options: formatAsOption(rows, "telefono_proveedor") },
    { name: "email_proveedor", label: "Email del proveedor", options: formatAsOption(rows, "email_proveedor") },
    { name: "direccion_proveedor", label: "Dirección del proveedor", options: formatAsOption(rows, "direccion_proveedor") },
];

// Configuración para columnas
export const accessToRows = [
    "nombre_proveedor", "telefono_proveedor", "email_proveedor", "direccion_proveedor"
];

export const headOfColumns = [
    { id: 'nombre_proveedor', label: 'Nombre del proveedor', },
    { id: 'telefono_proveedor', label: 'Telefono del proveedor', },
    { id: 'email_proveedor', label: 'Email del proveedor', },
    { id: 'direccion_proveedor', label: 'Direccion proveedor', },
    { id: '', label: 'Acciones', },
];

// Configuración botones de accion:
export const bottonActionConfig = {

    editConfigModal: {
        dialogTitle: "Editar Proveedor",
        actionFunction: updateProveedor,
        type: "edit",
        fieldsToEdit: [
            "nombre_proveedor", "telefono_proveedor", "email_proveedor", "direccion_proveedor"
        ]
    },

    disguiseConfigModal: {
        dialogTitle: "Ocultar Proveedor",
        dialogMessage: "¿Está seguro de querer ocultar este Proveedor?",
        actionFunction: hideProveedor,
        type: "disguise",
    },

    page: "proveedor",
    allowedButtons: ["details", "edit", "disguise"],
    accessId: "id_proveedor"
}