import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getBase64CashFlowReport } from "@/util/chartUtils";

pdfMake.vfs = pdfFonts.vfs;

// Formatea la fecha en formato legible
const formatDate = (date) => new Date(date).toLocaleDateString();

// Crea una tabla con encabezados y datos
const createTable = (headers, data, widths) => ({
    table: { widths, body: [headers, ...data] },
    margin: [0, 10, 0, 10]
});

// Genera el contenido del PDF basándose en los datos del reporte
const generateContent = (reportData, charts) => [
    { text: "Informe Financiero", style: "header", alignment: "center" },

    { text: "1. Resumen General", style: "sectionHeader" },
    createTable(["Saldo Inicial", "Total Entradas", "Total Salidas", "Saldo Final"], [
        [`${reportData.saldoInicial} gs`, `${reportData.totalEntradas} gs`, `${reportData.totalSalidas} gs`, `${reportData.saldoFinal} gs`]
    ], ["*", "*", "*", "*"]),

    { text: "2. Movimientos", style: "sectionHeader" },
    createTable(["Fecha", "Usuario", "Tipo", "N° Factura", "Monto"],
        reportData.movimientos.map(m => [
            formatDate(m.fecha_movimiento), m.nombre_usuario, m.tipo_movimiento, m.numero_de_factura, `${m.monto} gs`
        ]), ["*", "*", "*", "*", "*"]
    ),

    { text: "3. Compras", style: "sectionHeader" },
    createTable(["Proveedor", "Fecha", "Hora", "Monto Total"],
        reportData.compras.map(c => [
            c.nombre_proveedor, formatDate(c.fecha_compra), c.hora_compra, `${c.monto_total} gs`
        ]), ["*", "*", "*", "*"]
    ),

    { text: "4. Cobranzas", style: "sectionHeader" },
    createTable(["Cliente", "Fecha", "Hora", "Monto"],
        reportData.cobranzas.map(c => [
            c.nombre_cliente, formatDate(c.fecha_pago), c.hora_pago, `${c.monto} gs`
        ]), ["*", "*", "*", "*"]
    ),

    { text: "5. Gráficos e Indicadores", style: "sectionHeader" },
    charts.movementsChart ? { image: charts.movementsChart, width: 400, alignment: "center", margin: [0, 10, 0, 10] } : { text: "No hay datos para graficar.", alignment: "center" }
];

// Genera el informe financiero en PDF
export const generateFinancialReportPDF = async (reportData, date, periodo) => {
    if (!reportData) return;

    try {
        const charts = {
            movementsChart: await getBase64CashFlowReport(reportData.movimientos, "Movimientos Financieros", "line")
        };

        const docDefinition = {
            content: generateContent(reportData, charts),
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
