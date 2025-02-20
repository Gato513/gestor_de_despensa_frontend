import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

/**
 * Crea una tabla con encabezados y datos
 */
const createTable = (headers, data, widths) => ({
    table: { headerRows: 1, widths, body: [headers, ...data] },
    layout: "lightHorizontalLines",
    margin: [0, 10, 0, 10]
});

/**
 * Genera el contenido detallado del PDF basado en los datos de la factura
 */
const generateContent = (factura) => {
    // Validar que los detalles de productos existan y sean un array
    const detallesProductos = Array.isArray(factura.detalles_productos) ? factura.detalles_productos : [];

    // Total de la deuda Original:
    const montoOriginal = detallesProductos.reduce((acc, p) => acc + (parseFloat(p.subtotal) || 0), 0);

    // Calcular saldo restante total
    const montoFacturado = parseFloat(factura.monto_facturado) || 0;

    // Agrupar saldos por remito (solo se toma el primer saldo encontrado para cada remito)
    const saldosPorRemito = detallesProductos.reduce((acc, p) => {
        const id = p.id_remito;
        if (!acc[id]) {
            acc[id] = parseFloat(p.saldo_restante) || 0;
        }
        return acc;
    }, {});

    // Sumar los saldos únicos de cada remito
    const saldoRestanteTotal = Object.values(saldosPorRemito).reduce((acc, saldo) => acc + saldo, 0);

    return [
        { text: `FACTURA N° ${factura.numero_factura}`, style: "header", alignment: "center" },
        { text: `Fecha: ${factura.fecha_factura} - Hora: ${factura.hora_factura}`, style: "subHeader" },
        { text: `Tipo: ${factura.tipo_factura}`, style: "subHeader" },
        { text: `Cliente: ${factura.nombre_entidad}`, style: "subHeader" },
        { text: `Teléfono: ${factura.telefono_entidad}`, style: "subHeader" },
        { text: `Dirección: ${factura.direccion_entidad}`, style: "subHeader", margin: [0, 0, 0, 10] },

        { text: "DETALLES DE PRODUCTOS", style: "sectionHeader" },
        createTable(
            ["ID Remito", "Fecha Remito", "Producto", "Cantidad", "Subtotal (Gs)"],
            detallesProductos.map(p => [
                p.id_remito || "-", p.fecha_remito || "-", p.nombre_producto || "-",
                p.cantidad || 0, p.subtotal || "0"
            ]),
            ["auto", "auto", "*", "auto", "auto"]
        ),


        { text: "RESUMEN DE PAGO", style: "sectionHeader" },
        createTable(
            ["Monto Facturado (Gs)", "Saldo Restante Total (Gs)"],
            [[montoFacturado.toFixed(0), saldoRestanteTotal.toFixed(0)]],
            ["50%", "50%"] // Mantén 2 valores para 2 columnas
        ),


        { text: `Saldo Original: ${montoOriginal.toFixed(0)} Gs`, style: "total", alignment: "right", margin: [0, 10, 0, 0] },
        { text: `Monto Facturado: ${montoFacturado.toFixed(0)} Gs`, style: "total", alignment: "right", margin: [0, 10, 0, 0]},
        { text: `Saldo Restante: ${saldoRestanteTotal.toFixed(0)} Gs`, style: "total", alignment: "right", margin: [0, 2, 0, 0], color: saldoRestanteTotal > 0 ? "red" : "green" }
    ];
};

/**
 * Genera la factura en PDF
 */
export const generateFacturaVentaPDF = (factura) => {
    if (!factura) return;

    try {
        const docDefinition = {
            content: generateContent(factura),
            styles: {
                header: { fontSize: 18, bold: true },
                subHeader: { fontSize: 12, bold: true },
                sectionHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                total: { fontSize: 14, bold: true }
            }
        };

        pdfMake.createPdf(docDefinition).open();
    } catch (error) {
        console.error("Error al generar el PDF:", error);
    }
};
