import { getBase64ChartInventory } from "@/util/chartUtils";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const formatDate = (date) => new Date(date).toLocaleDateString();

const createTable = (headers, data, widths) => ({
    table: { widths, body: [headers, ...data] },
    margin: [0, 10, 0, 10]
});

const generateInventoryContent = async (inventoryData) => {
    const productosMasVendidosImg = await getBase64ChartInventory(inventoryData.rotacionProductos.altaDemanda, "Productos Más Vendidos");
    const productosMenosVendidosImg = await getBase64ChartInventory(inventoryData.rotacionProductos.bajaDemanda, "Productos Menos Vendidos");
    const movimientosInventarioImg = await getBase64ChartInventory(inventoryData.registroMovimientos, "Movimientos de Inventario", "line");

    return [
        { text: "Informe de Inventario", style: "header", alignment: "center" },
        { text: "1. Resumen General", style: "sectionHeader" },
        createTable(["Total Productos", "Valor Total Compra", "Valor Total Venta"], [
            [inventoryData.resumenGeneral.total_productos, `${inventoryData.resumenGeneral.valor_total_compra} gs`, `${inventoryData.resumenGeneral.valor_total_venta} gs`]
        ], ["*", "*", "*"]),

        { text: "2. Stock Actual", style: "sectionHeader" },
        createTable(["Producto", "Stock", "Precio Compra", "Precio Venta"],
            inventoryData.stockActual.map(p => [p.nombre_producto, p.stock_disponible, `${p.precio_compra} gs`, `${p.precio_venta} gs`]),
            ["*", "*", "*", "*"]
        ),

        { text: "3. Productos Bajo Stock", style: "sectionHeader" },
        createTable(["Producto", "Stock Disponible", "Stock Mínimo"],
            inventoryData.productosBajoStock.map(p => [p.nombre_producto, p.stock_disponible, p.stock_minimo]),
            ["*", "*", "*"]
        ),

        { text: "4. Rotación de Productos", style: "sectionHeader", pageBreak: "before" },
        { text: "Productos Más Vendidos", style: "subheader" },
        createTable(["Producto", "Cantidad Vendida"],
            inventoryData.rotacionProductos.altaDemanda.map(p => [p.nombre_producto, p.cantidad_vendida]),
            ["*", "*"]
        ),
        productosMasVendidosImg ? { image: productosMasVendidosImg, width: 500, alignment: "center", margin: [0, 10, 0, 10] } : {},

        { text: "Productos Menos Vendidos", style: "subheader", pageBreak: "before" },
        createTable(["Producto", "Cantidad Vendida"],
            inventoryData.rotacionProductos.bajaDemanda.map(p => [p.nombre_producto, p.cantidad_vendida]),
            ["*", "*"]
        ),
        productosMenosVendidosImg ? { image: productosMenosVendidosImg, width: 500, alignment: "center", margin: [0, 10, 0, 10] } : {},

        { text: "5. Registro de Movimientos", style: "sectionHeader", pageBreak: "before" },
        createTable(["Fecha", "Tipo", "Producto", "Cantidad"],
            inventoryData.registroMovimientos.map(m => [formatDate(m.fecha), m.tipo, m.nombre_producto, m.cantidad]),
            ["*", "*", "*", "*"]
        ),
        movimientosInventarioImg ? { image: movimientosInventarioImg, width: 500, alignment: "center", margin: [0, 10, 0, 10] } : {},
    ];
};

export const generateInventoryReportPDF = async (inventoryData) => {
    if (!inventoryData) return;

    try {
        const content = await generateInventoryContent(inventoryData);

        const docDefinition = {
            content,
            styles: {
                header: { fontSize: 18, bold: true },
                sectionHeader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
                subheader: { fontSize: 14, bold: true, margin: [0, 5, 0, 5] }
            }
        };

        pdfMake.createPdf(docDefinition).open();
    } catch (error) {
        console.error("Error al generar el PDF:", error);
    }
};

