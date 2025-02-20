"use client"
import { Box, Button, DialogActions, DialogContent, DialogTitle, Typography, Divider, Grid2 } from "@mui/material";
import { DynamicTable } from "../tables/dynamicTable";
import { useFetchDataById } from "@/hooks/fetch_initial_data";
import { ProgressIndicator } from "../progressIndicator/progressIndicator";
import { capitalize } from "@/util/formatter";
import { fetchAllFacturaDataById } from "@/services/registros.service";
import { useState } from "react";
import { FacturationGenerateModal } from "../informes/facturationGenerateModal";

// Configuración para Tabla de Ventas:
const ventaAccessToRows = [
    "id_remito",
    "fecha_remito",
    "monto_original",
    "saldo_restante",
    "id_producto",
    "nombre_producto",
    "cantidad",
    "subtotal",
];

const ventaHeadOfColumns = [
    { id: 'id_remito', label: 'Número Remito' },
    { id: 'fecha_remito', label: 'Fecha Remito' },
    { id: 'monto_original', label: 'Monto Original' },
    { id: 'saldo_restante', label: 'Saldo Restante' },
    { id: 'id_producto', label: 'Id Producto' },
    { id: 'nombre_producto', label: 'Nombre Producto' },
    { id: 'cantidad', label: 'Cantidad' },
    { id: 'subtotal', label: 'Subtotal' },
];

// Configuración para Tabla de Compras
const compraAccessToRows = [
    "id_producto",
    "nombre_producto",
    "cantidad",
    "subtotal",
]

const compraHeadOfColumns = [
    { id: 'id_producto', label: 'Id Producto' },
    { id: 'nombre_producto', label: 'Nombre Producto' },
    { id: 'cantidad', label: 'Cantidad' },
    { id: 'subtotal', label: 'Subtotal' },
];

export const FacturaDetail = ({ targetId, facturaType, onClose }) => {

    const { rows, isLoaded } = useFetchDataById(fetchAllFacturaDataById, targetId, facturaType);

    const [openGenerateFactura, setOpenGenerateFactura] = useState(false);

    const handleCloseFacturaModal = () => {
        setOpenGenerateFactura(!openGenerateFactura)
    };

    // Desestructurar información del remito
    const {
        numero_factura,
        nombre_entidad,
        telefono_entidad,
        direccion_entidad,
        monto_facturado,
        fecha_factura,
        hora_factura,
        tipo_factura,
        detalles_productos
    } = rows;
    return (
        <>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Detalle del Remito</Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ overflow: "hidden" }}>
                {!isLoaded ? (
                    <ProgressIndicator />
                ) : (
                    <>
                        {/* Información general del remito */}
                        <Box mb={2}>
                            <Grid2 container spacing={2}>
                                <Grid2 size={4}>
                                    <Typography variant="body1"><strong>Número de Factura:</strong> {numero_factura}</Typography>
                                </Grid2>

                                <Grid2 size={4}>
                                    <Typography variant="body1"><strong>Cliente:</strong> {nombre_entidad}</Typography>
                                </Grid2>

                                <Grid2 size={4}>
                                    <Typography variant="body1"><strong>Teléfono:</strong> {telefono_entidad}</Typography>
                                </Grid2>

                                <Grid2 size={4}>
                                    <Typography variant="body1"><strong>Dirección:</strong> {direccion_entidad}</Typography>
                                </Grid2>

                                <Grid2 size={4}>
                                    <Typography variant="body1"><strong>Fecha:</strong> {new Date(fecha_factura).toLocaleDateString()}</Typography>
                                </Grid2>

                                <Grid2 size={4}>
                                    <Typography variant="body1"><strong>Monto Total:</strong> {monto_facturado} gs.</Typography>
                                </Grid2>

                                <Grid2 size={4}>
                                    {hora_factura && <Typography variant="body1"><strong>Hora de Pago:</strong> {hora_factura}</Typography>}
                                </Grid2>

                                <Grid2 size={4}>
                                    <Typography variant="body1"><strong>Tipo de Factura:</strong> {capitalize(tipo_factura)}</Typography>
                                </Grid2>
                            </Grid2>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Verifica que detalles_productos exista antes de renderizar */}
                        {
                            detalles_productos && detalles_productos.length > 0 && (
                                <DynamicTable
                                    rows={detalles_productos}
                                    headOfColumns={facturaType === "venta" ? ventaHeadOfColumns : compraHeadOfColumns}
                                    accessToRows={facturaType === "venta" ? ventaAccessToRows : compraAccessToRows}
                                />
                            )
                        }

                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cerrar
                </Button>
                <Button onClick={() => { setOpenGenerateFactura(true) }} variant="outlined" color="success">
                    Generar Factura
                </Button>
            </DialogActions>

            {
                openGenerateFactura && (
                    <FacturationGenerateModal
                        open={openGenerateFactura}
                        handleClose={handleCloseFacturaModal}
                        targetId={targetId}
                        facturaType={facturaType}
                    />
                )
            }
        </>
    );
};


