import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getBase64DebtReport } from "@/util/chartUtils";

pdfMake.vfs = pdfFonts.vfs;

const createTable = (headers, data, widths) => ({
    table: { widths, body: [headers, ...data] },
    margin: [0, 10, 0, 10]
});

const generateContent = (reportData, charts) => [
    { text: "Informe de Deudas", style: "header", alignment: "center" },

    { text: "1. Resumen General", style: "sectionHeader" },
    createTable(["Clientes con Deuda", "Monto Total Deuda"], [
        [reportData.clientesConDeudas.length, `${reportData.clientesConDeudas.reduce((acc, c) => acc + parseFloat(c.total_adeudado), 0)} gs`]
    ], ["*", "*"]),

    { text: "2. Deuda por Cliente", style: "sectionHeader" },
    createTable(["Cliente", "Deuda Total", "Cantidad Remitos Pendientes"],
        reportData.clientesConDeudas.map(c => [c.nombre_cliente, `${c.total_adeudado} gs`, c.cantidad_remitos_pendientes]),
        ["*", "*", "*"]
    ),

    { text: "3. Historial de Pagos", style: "sectionHeader" },
    createTable(["Cliente", "Monto Pagado", "Fecha"],
        reportData.historialPagos.map(p => [p.nombre_cliente, `${p.monto} gs`, p.fecha_pago]),
        ["*", "*", "*"]
    ),

    { text: "4. Remitos Pendientes", style: "sectionHeader" },
    createTable(["Cliente", "Fecha Remito", "Monto Total", "Saldo Restante"],
        reportData.remitosPendientes.map(r => [r.nombre_cliente, r.fecha_remito, `${r.monto_total} gs`, `${r.saldo_restante} gs`]),
        ["*", "*", "*", "*"]
    ),

    { text: "5. Evolución de Deuda", style: "sectionHeader", pageBreak: "before" },
    createTable(["Fecha", "Deuda Total"],
        reportData.evolucionDeuda.map(e => [e.mes, `${e.total_adeudado} gs`]),
        ["*", "*"]
    ),
    charts.debtEvolutionChart ? { image: charts.debtEvolutionChart, width: 400, alignment: "center", margin: [0, 10, 0, 10] } : { text: "No hay datos para graficar.", alignment: "center" },

    { text: "6. Flujo de Pagos", style: "sectionHeader", pageBreak: "before" },
    createTable(["Fecha", "Monto Pagado"],
        reportData.flujoPagos.map(f => [f.mes, `${f.total_pagado} gs`]),
        ["*", "*"]
    ),
    charts.paymentFlowChart ? { image: charts.paymentFlowChart, width: 400, alignment: "center", margin: [0, 10, 0, 10] } : { text: "No hay datos para graficar.", alignment: "center" }
];

export const generateDebtReportPDF = async (reportData) => {
    if (!reportData) return;
    console.log(reportData);

    try {
        const charts = {
            debtEvolutionChart: await getBase64DebtReport(reportData.evolucionDeuda, "Evolución de Deuda", "line"),
            paymentFlowChart: await getBase64DebtReport(reportData.flujoPagos, "Flujo de Pagos", "line")
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
