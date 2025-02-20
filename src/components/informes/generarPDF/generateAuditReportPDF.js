import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

const createTable = (headers, data, widths) => ({
    table: { widths, body: [headers, ...data] },
    margin: [0, 10, 0, 10]
});

const generateContent = (auditData) => {
    if (!auditData || !auditData.auditoria || !auditData.conteoModificaciones || !auditData.actividadUsuarios || !auditData.historialCambios || !auditData.usuariosSospechosos) {
        console.error("Datos incompletos para generar el informe.");
        return [];
    }

    return [
        { text: "Informe de Auditoría", style: "header", alignment: "center" },
        { text: `Periodo: ${auditData.startDate} - ${auditData.endDate}`, alignment: "center", margin: [0, 5, 0, 10] },

        { text: "1. Resumen General", style: "sectionHeader" },
        createTable(["Total Registros Auditados"], [[auditData.totalRegistros]], ["*"]),

        { text: "2. Registro de Auditoría", style: "sectionHeader" },
        createTable(
            ["Usuario", "Fecha", "Hora", "Tabla Afectada", "Registro Afectado", "Tipo de Cambio"],
            auditData.auditoria.map(a => [
                a.nombre_usuario,
                a.fecha_de_cambio,
                a.hora_de_cambio,
                a.tabla_afectada,
                a.id_registro_afectado,
                a.tipo_modificacion,
            ]),
            [80, 65, 50, 100, 55, 87] // Ajusta estos valores según necesites
        ),

        { text: "3. Resumen de Modificaciones", style: "sectionHeader" },
        createTable(
            ["Tipo de Modificación", "Cantidad"],
            auditData.conteoModificaciones.map(m => [m.tipo_modificacion, m.cantidad]),
            ["*", "*"]
        ),

        { text: "4. Actividad de Usuarios", style: "sectionHeader" },
        createTable(
            ["Usuario", "Rol", "Cambios Realizados"],
            auditData.actividadUsuarios.map(u => [u.nombre_usuario, u.rol_usuario, u.cambios_realizados]),
            ["*", "*", "*"]
        ),

        { text: "5. Historial de Cambios", style: "sectionHeader", pageBreak: "before" },
        createTable(
            ["Registro Afectado", "Tabla", "Veces Modificado"],
            auditData.historialCambios.map(h => [h.id_registro_afectado, h.tabla_afectada, h.veces_modificado]),
            ["*", "*", "*"]
        ),

        { text: "6. Usuarios Sospechosos", style: "sectionHeader" },
        createTable(
            ["Usuario", "Cambios Realizados"],
            auditData.usuariosSospechosos.map(u => [u.nombre_usuario, u.cambios_realizados]),
            ["*", "*"]
        ),
    ];
};

export const generateAuditReportPDF = (auditData) => {
    if (!auditData) return;
    console.log(auditData);

    try {
        const docDefinition = {
            content: generateContent(auditData),
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


