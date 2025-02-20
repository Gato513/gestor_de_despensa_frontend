import { formatAsOption } from "@/util/formatter";
import { hideUser, updateUser } from "@/services/systemUser.service";

// Configuración de filtros:
export const defaultFilterConfig = {
    defaultValues: {
        nombre_usuario: "",
        telefono_usuario: "",
        email_user: "",
        userRole: ""
    },
    accessFilterValues: ["nombre_usuario", "telefono_usuario", "email_user", "userRole"],
    inputs: [],
    filterName: "Lista de Personal"
};

// Generacion dinamica de input para filtros:
export const generateDynamicInputs = (rows) => [
    { name: "nombre_usuario", label: "Nombre del usuario", options: formatAsOption(rows, "nombre_usuario") },
    { name: "telefono_usuario", label: "Telefono del usuario", options: formatAsOption(rows, "telefono_usuario") },
    { name: "email_user", label: "Email del usuario", options: formatAsOption(rows, "email_user") },
    { name: "userRole", label: "Rol de Usuario", options: formatAsOption(rows, "userRole") },
];

// Configuración para columnas
export const accessToRows = [
    "nombre_usuario", "telefono_usuario", "email_user", "userRole"
];

export const headOfColumns = [
    { id: 'nombre_usuario', label: 'Nombre del usuario', },
    { id: 'telefono_usuario', label: 'Telefono del usuario', },
    { id: 'email_user', label: 'Email del usuario', },
    { id: 'userRole', label: 'Rol de Usuario', },
    { id: '', label: 'Acciones', },
];

// Configuración botones de accion:
export const bottonActionConfig = {
    editConfigModal: {
        dialogTitle: "Editar Usuario",
        actionFunction: updateUser,
        type: "edit",
        fieldsToEdit: [
            "nombre_usuario", "telefono_usuario", "email_user",
        ]
    },

    disguiseConfigModal: {
        dialogTitle: "Ocultar Usuario",
        dialogMessage: "¿Está seguro de querer ocultar este usuario?",
        actionFunction: hideUser,
        type: "disguise",
    },
    page: "user",
    allowedButtons: [ "edit", "disguise"],
    accessId: "id_usuario"
}

