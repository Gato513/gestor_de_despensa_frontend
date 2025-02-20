"use client"
import { Box, Button, DialogActions, DialogContent, DialogTitle, Typography, Divider, Grid2 } from "@mui/material";
import { DynamicTable } from "../tables/dynamicTable";
import { ProgressIndicator } from "../progressIndicator/progressIndicator";
import { useFetchDataById } from "@/hooks/fetch_initial_data";
import { fetchProveedorById } from "@/services/proveedores.service";

// Configuración para la tabla de productos:
export const accessToRows = [
    "nombre_producto", "ultimo_precio_compra", "ultima_fecha_compra",
];

export const headOfColumns = [
    { id: 'nombre_producto', label: 'Nombre del Producto', },
    { id: 'ultimo_precio_compra', label: 'Último Precio de Compra', },
    { id: 'ultima_fecha_compra', label: 'Última Fecha de Compra', },
];

export const ProveedorDetail = ({ targetId, onClose }) => {

    const { rows, isLoaded } = useFetchDataById(fetchProveedorById, targetId);

    // Desestructurar datos del proveedor
    const {
        nombre_proveedor,
        telefono_proveedor,
        email_proveedor,
        direccion_proveedor,
        list_of_product
    } = rows;

    return (
        <>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Detalle del Proveedor</Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {
                    !isLoaded ? (
                        <ProgressIndicator />
                    ) : (
                        <>
                            <Box mb={2}>
                                <Grid2 container spacing={2}>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Nombre del Proveedor:</strong> {nombre_proveedor}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Teléfono:</strong> {telefono_proveedor}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Email:</strong> {email_proveedor}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Dirección:</strong> {direccion_proveedor}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Total de Productos:</strong> {list_of_product.length}</Typography>
                                    </Grid2>
                                </Grid2>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Tabla de productos */}
                            <DynamicTable
                                rows={list_of_product}
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
