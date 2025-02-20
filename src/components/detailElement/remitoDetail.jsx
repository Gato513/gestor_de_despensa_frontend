import { Box, Button, DialogActions, DialogContent, DialogTitle, Typography, Divider, Grid2 } from "@mui/material";
import { DynamicTable } from "../tables/dynamicTable";
import { fetchRemitoById } from "@/services/remitos.service";
import { useFetchDataById } from "@/hooks/fetch_initial_data";
import { ProgressIndicator } from "../progressIndicator/progressIndicator";
import { capitalize } from "@/util/formatter";

// Configuración para Tabla:
export const accessToRows = [
    "nombre_producto", "cantidad", "precio_unitario", "subtotal",
];

export const headOfColumns = [
    { id: 'nombre_producto', label: 'Nombre de producto', },
    { id: 'cantidad', label: 'Cantidad', },
    { id: 'precio_unitario', label: 'Precio unitario', },
    { id: 'subtotal', label: 'Subtotal', },
];

export const RemitoDetail = ({ targetId, onClose }) => {
    const { rows, isLoaded } = useFetchDataById(fetchRemitoById, targetId);

    // Desestructurar información del remito
    const { num_remito, nombre_cliente, fecha_remito, monto_total, saldo_restante, estado, list_of_details } = rows;

    return (
        <>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Detalle del Remito</Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers >
                {
                    !isLoaded ? (
                        <ProgressIndicator />
                    ) : (
                        <>
                            {/* Información general del remito */}
                            <Box mb={2}>
                                <Grid2 container spacing={2}>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Número de Remito:</strong> {num_remito}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Cliente:</strong> {nombre_cliente}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Fecha:</strong> {new Date(fecha_remito).toLocaleDateString()}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Monto Total:</strong> {monto_total} gs.</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Saldo Restante:</strong> {saldo_restante} gs.</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Estado:</strong> {capitalize(estado)}</Typography>
                                    </Grid2>
                                </Grid2>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Tabla de detalles */}
                            <DynamicTable
                                rows={list_of_details}
                                headOfColumns={headOfColumns}
                                accessToRows={accessToRows}
                            />
                        </>
                    )
                }
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cerrar
                </Button>
            </DialogActions>
        </>
    );
};
