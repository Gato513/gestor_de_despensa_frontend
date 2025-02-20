"use client"
import { Box, Button, DialogActions, DialogContent, DialogTitle, Typography, Divider, Grid2 } from "@mui/material";
import { DynamicTable } from "../tables/dynamicTable";
import { ProgressIndicator } from "../progressIndicator/progressIndicator";
import { fetchCustomerById } from "@/services/customers.service";
import { useFetchDataById } from "@/hooks/fetch_initial_data";
import { CobranzaModal } from "../modals/mainModals/cobranzaModal";
import { useState } from "react";

// Configuración para Tabla:
export const accessToRows = [
    "num_remito", "fecha_remito", "monto_original", "saldo_restante", "estado",
];

export const headOfColumns = [
    { id: 'num_remito', label: 'Número de Remito', },
    { id: 'fecha_remito', label: 'Fecha', },
    { id: 'monto_original', label: 'Monto Original', },
    { id: 'saldo_restante', label: 'Saldo Restante', },
    { id: 'estado', label: 'Estado', },
];

export const ClientDetail = ({ targetId, onClose }) => {

    const { rows, isLoaded } = useFetchDataById(fetchCustomerById, targetId);
    const [openModal, setOpenModal] = useState(false);

    const handleModal = () => {
        setOpenModal(prevState => !prevState);
        if (openModal) onClose();
    };

    // Desestructurar datos del cliente
    const {
        nombre_cliente,
        telefono_cliente,
        direccion_cliente,
        cantidad_remitos,
        deuda_total,
        list_of_remitos
    } = rows;

    return (
        <>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Detalle del Cliente</Typography>
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
                                        <Typography variant="body1"><strong>Nombre del Cliente:</strong> {nombre_cliente}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Teléfono:</strong> {telefono_cliente}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Dirección:</strong> {direccion_cliente}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Remitos Pendientes:</strong> {list_of_remitos.length}</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Deuda Total:</strong> {deuda_total} gs.</Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                        <Typography variant="body1"><strong>Remitos Pagados:</strong> {(cantidad_remitos - list_of_remitos.length)}</Typography>
                                    </Grid2>
                                </Grid2>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Tabla de remitos */}
                            <DynamicTable
                                rows={list_of_remitos}
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
                <Button onClick={handleModal} variant="outlined" color="success">
                    Facturar Cliente
                </Button>
            </DialogActions>

            <CobranzaModal clientId={targetId} open={openModal} handleClose={handleModal} />
        </>
    );
};