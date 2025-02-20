import { hideProduct, updateProduct } from "@/services/products.service";
import { formatAsOption } from "@/util/formatter";

// Inputs por defecto del filtro:
const defaulInput = [
    {
        name: "precio_compra",
        label: "Precio compra",
        required: false,
        type: "text",
        inputWidth: null,
    },
    {
        name: "ultima_actualizacion",
        label: "Ultima actualizacion",
        required: false,
        type: "date",
        inputWidth: null,
    },
]

// Configuración de filtros:
export const defaultFilterConfig = {
    defaultValues: {
        nombre_producto: "",
        precio_compra: "",
        ultima_actualizacion: "",
        have_stock: "",
    },
    accessFilterValues: ["nombre_producto", "have_stock", "precio_compra", "ultima_actualizacion"],
    inputs: [...defaulInput],
    filterName: "Lista de productos"
};

// Generacion dinamica de input para filtros:
export const generateDynamicInputs = (rows) => [
    { name: "nombre_producto", label: "Nombre de producto", options: formatAsOption(rows, "nombre_producto") },
    { name: "have_stock", label: "Nivel de stock", options: formatAsOption(rows, "have_stock") },
];

// Configuración para tabla:
export const accessToRows = [
    "nombre_producto", "precio_compra", "precio_venta", "stock_disponible", "stock_minimo", "ultima_actualizacion", "have_stock"
];

export const headOfColumns = [
    { id: 'nombre_producto', label: 'Nombre producto', },
    { id: 'precio_compra', label: 'Precio compra', },
    { id: 'precio_venta', label: 'Precio venta', },
    { id: 'stock_disponible', label: 'Stock disponible', },
    { id: 'stock_minimo', label: 'Stock minimo', },
    { id: 'ultima_actualizacion', label: 'Ultima reposicion', },
    { id: 'have_stock', label: 'Nivel de stock', },
    { id: '', label: 'Acciones', },
];

// Configuración botones de accion:
export const bottonActionConfig = {
    editConfigModal: {
        dialogTitle: "Editar Producto",
        actionFunction: updateProduct,
        type: "edit",
        fieldsToEdit: [
            "nombre_producto", "precio_compra", "precio_venta", "stock_minimo",
        ]
    },

    disguiseConfigModal: {
        dialogTitle: "Ocultar producto",
        dialogMessage: "¿Está seguro de querer ocultar este producto?",
        actionFunction: hideProduct,
        type: "disguise",
    },
    page: "product",
    allowedButtons: ["edit", "disguise"],
    accessId: "id_producto"
}