import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getBase64ChartSales } from "@/util/chartUtils";

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
const generateContent = (reportData, startDate, endDate, charts) => [
    { text: "Informe de Ventas", style: "header", alignment: "center" },
    { text: `Rango de Fechas: ${formatDate(startDate)} - ${formatDate(endDate)}`, style: "subheader", alignment: "center" },

    //! Tablas 
    { text: "1. Resumen General", style: "sectionHeader" },
    createTable(["Total Ventas", "Monto Total", "Saldo Pendiente"], [
        [reportData.resumenGeneral.total_ventas, `${reportData.resumenGeneral.monto_total_ventas} gs`, `${reportData.resumenGeneral.saldo_pendiente} gs`]
    ], ["*", "*", "*"]),


    { text: "2. Ventas por Período", style: "sectionHeader" },
    createTable(["Fecha", "Total Ventas"], reportData.ventasPorPeriodo.map(v => [v.fecha, `${v.total_ventas} gs`]), ["*", "*"]),

    { text: "3. Ventas por Producto", style: "sectionHeader" },
    createTable(["Producto", "Cantidad Vendida", "Total Ventas"], reportData.ventasPorProducto.map(p => [
        p.nombre_producto, p.cantidad_vendida, `${p.total_ventas} gs`
    ]), ["*", "*", "*"]),

    { text: "4. Ventas por Cliente", style: "sectionHeader" },
    createTable(["Cliente", "Total Compras", "Monto Total"], reportData.ventasPorCliente.map(c => [
        c.nombre_cliente, c.total_compras, `${c.monto_total_compras} gs`
    ]), ["*", "*", "*"]),

    { text: "5. Datos Financieros", style: "sectionHeader" },
    createTable(["Pagos Recibidos", "Descuentos a Remitos"], [
        [`${reportData.datosFinancieros.pagos_recibidos} gs`, `${reportData.datosFinancieros.descuentos} gs`]
    ], ["*", "*"]),

    { text: "6. Comparación con Período Anterior", style: "sectionHeader" },
    createTable(["Total Ventas Período Anterior", "Total Ventas Actual"], [
        [`${reportData.comparacionPeriodoAnterior.total_ventas_anterior ?? "No disponible"} gs`, `${reportData.resumenGeneral.monto_total_ventas} gs`]
    ], ["*", "*"]),

    { text: "7. Gráficos e Indicadores", style: "sectionHeader" },
    charts.salesByPeriodChart ? { image: charts.salesByPeriodChart, width: 400, alignment: "center", margin: [0, 10, 0, 10] } : { text: "No hay datos para graficar.", alignment: "center" },
    charts.salesByProductChart ? { image: charts.salesByProductChart, width: 400, alignment: "center", margin: [0, 10, 0, 10] } : { text: "No hay datos para graficar.", alignment: "center" }
];

/**
 * Genera el informe de ventas en PDF
 */
export const generateSalesReportPDF = async (reportData, startDate, endDate) => {
    if (!reportData) return;

    try {
        const charts = {
            salesByPeriodChart: await getBase64ChartSales(reportData.ventasPorPeriodo, "Ventas por Período"),
            salesByProductChart: await getBase64ChartSales(reportData.ventasPorProducto, "Ventas por Producto")
        };

        const docDefinition = {
            content: generateContent(reportData, startDate, endDate, charts),
            styles: {
                header: { fontSize: 18, bold: true },
                subheader: { fontSize: 14, bold: true },
                sectionHeader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] }
            }
        };

        pdfMake.createPdf(docDefinition).open();
    } catch (error) {
        console.error("Error al generar el PDF:", error);
    }
};
