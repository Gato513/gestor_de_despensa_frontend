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
    const detallesProductos = Array.isArray(factura.detalles_productos) ? factura.detalles_productos : [];

    // Calcular monto total
    const montoFacturado = parseFloat(factura.monto_facturado) || 0;

    return [
        { text: `FACTURA N° ${factura.numero_factura}`, style: "header", alignment: "center" },
        { text: `Fecha: ${factura.fecha_factura} - Hora: ${factura.hora_factura}`, style: "subHeader" },
        { text: `Tipo: ${factura.tipo_factura}`, style: "subHeader" },
        { text: `Cliente: ${factura.nombre_entidad}`, style: "subHeader" },
        { text: `Teléfono: ${factura.telefono_entidad}`, style: "subHeader" },
        { text: `Dirección: ${factura.direccion_entidad}`, style: "subHeader", margin: [0, 0, 0, 10] },

        { text: "DETALLES DE PRODUCTOS", style: "sectionHeader" },
        createTable(
            ["ID Producto", "Producto", "Cantidad", "Subtotal (Gs)"],
            detallesProductos.map(p => [
                p.id_producto || "-", p.nombre_producto || "-", p.cantidad || 0, p.subtotal || "0"
            ]),
            ["auto", "*", "auto", "auto"]
        ),

        { text: `Monto Total: ${montoFacturado.toFixed(0)} Gs`, style: "total", alignment: "right", margin: [0, 10, 0, 0] }
    ];
};

/**
 * Genera la factura en PDF
 */
export const generateFacturaCompraPDF = (factura) => {
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
