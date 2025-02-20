import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getBase64PurchaseReport } from "@/util/chartUtils";

pdfMake.vfs = pdfFonts.vfs;

/**
 * Formatea la fecha en formato legible
 */
const formatDate = (date) => new Date(date).toLocaleDateString();

/**
 * Crea una tabla con encabezados y datos
 */
const createTable = (headers, data, widths) => ({
    table: { widths, body: [headers, ...data] },
    margin: [0, 10, 0, 10]
});

/**
 * Genera el contenido del PDF basándose en los datos del reporte
 */
const generateContent = (reportData, charts) => [
    { text: "Informe de Compras", style: "header", alignment: "center" },

    //! Tablas 
    { text: "1. Historial de Compras", style: "sectionHeader" },
    createTable(
        ["ID Factura", "Proveedor", "Fecha", "Hora", "Monto Total"],
        reportData.historialCompras.map(c => [
            c.id_factura, c.nombre_proveedor, formatDate(c.fecha_compra), c.hora_compra, `${c.monto_total} gs`
        ]),
        ["*", "*", "*", "*", "*"]
    ),

    { text: "2. Productos Adquiridos", style: "sectionHeader" },
    createTable(
        ["Factura", "Producto", "Cantidad", "P. Compra", "P. Venta", "Subtotal", "Stock Disponible", "Estado Stock"],
        reportData.productosAdquiridos.map(p => [
            p.numero_factura, p.nombre_producto, p.cantidad, `${p.precio_compra} gs`, `${p.precio_venta} gs`,
            `${p.subtotal} gs`, p.stock_disponible, p.estado_stock
        ]),
        ["*", "*", "*", "*", "*", "*", "*", "*"]
    ),

    { text: "3. Comparación de Precios", style: "sectionHeader" },
    createTable(
        ["Producto", "Proveedor", "P. Compra", "P. Venta"],
        reportData.comparacionPrecios.map(p => [
            p.nombre_producto, p.nombre_proveedor, `${p.precio_compra} gs`, `${p.precio_venta} gs`
        ]),
        ["*", "*", "*", "*"]
    ),

    { text: "4. Gráficos e Indicadores", style: "sectionHeader" },
    charts.purchaseByPeriodChart ? { image: charts.purchaseByPeriodChart, width: 400, alignment: "center", margin: [0, 10, 0, 10] } : { text: "No hay datos para graficar.", alignment: "center" }
];

/**
 * Genera el informe de compras en PDF
 */
export const generatePurchaseReportPDF = async (reportData) => {
    if (!reportData) return;

    try {
        const charts = {
            purchaseByPeriodChart: await getBase64PurchaseReport(reportData.historialCompras, "Compras por Período", "line")
        };

        const docDefinition = {
            content: generateContent(reportData, charts),
            styles: {
                header: { fontSize: 18, bold: true },
                sectionHeader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] }
            }
        };

        pdfMake.createPdf(docDefinition).open();
    } catch (error) {
        console.error("Error al generar el PDF:", error);
    }
};
