import { formatAsOption } from "@/util/formatter";

// Configuración para columnas
export const accessToRows = [
    "id_usuario", "nombre_usuario", "telefono_usuario", "email_user", "userRole"
];

export const headOfColumns = [
    { id: 'id_usuario',         label: 'Id' },
    { id: 'nombre_usuario',     label: 'Nombre del usuario', },
    { id: 'telefono_usuario',   label: 'Telefono del usuario', },
    { id: 'email_user',         label: 'Email del usuario', },
    { id: 'userRole',           label: 'Rol de Usuario', },
];

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