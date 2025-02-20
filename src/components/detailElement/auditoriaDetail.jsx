"use client";

import { Box, Button, DialogActions, DialogContent, DialogTitle, Typography, Divider, Grid2 } from "@mui/material";
import { DynamicTable } from "../tables/dynamicTable";
import { ProgressIndicator } from "../progressIndicator/progressIndicator";
import { useFetchDataById } from "@/hooks/fetch_initial_data";
import { useState } from "react";
import { fetchAllAuditoriaDataById } from "@/services/registros.service";

const generateColumnHead = (fields) => {
    const head = fields.map(field => ({ id: field, label: field.replace("_", " ") }));
    return head
};

export const AuditoriaDetail = ({ targetId, onClose }) => {
    const { rows, isLoaded } = useFetchDataById(fetchAllAuditoriaDataById, targetId);
    const [openModal, setOpenModal] = useState(false);

    const handleModal = () => {
        setOpenModal(prevState => !prevState);
        if (openModal) onClose();
    };

    if (!isLoaded) return <ProgressIndicator />;

    const { auditoria, data_after_access, data_before_access } = rows;

    console.log(auditoria.lista_de_cambios.data_before_modification)

    return (
        <>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Detalle de Auditoría</Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Box mb={2}>
                    <Grid2 container spacing={2}>
                        <Grid2 size={6}>
                            <Typography variant="body1"><strong>Número de Auditoría:</strong> {auditoria.numero_auditoria}</Typography>
                        </Grid2>
                        <Grid2 size={6}>
                            <Typography variant="body1"><strong>Responsable:</strong> {auditoria.responsable}</Typography>
                        </Grid2>
                        <Grid2 size={6}>
                            <Typography variant="body1"><strong>Fecha de Cambio:</strong> {auditoria.fecha_de_cambio}</Typography>
                        </Grid2>
                        <Grid2 size={6}>
                            <Typography variant="body1"><strong>Hora de Cambio:</strong> {auditoria.hora_de_cambio}</Typography>
                        </Grid2>
                        <Grid2 size={6}>
                            <Typography variant="body1"><strong>Tabla Afectada:</strong> {auditoria.tabla_afectada}</Typography>
                        </Grid2>
                        <Grid2 size={6}>
                            <Typography variant="body1"><strong>Registro Afectado (ID):</strong> {auditoria.registro_afectado}</Typography>
                        </Grid2>
                    </Grid2>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Cambios Antes de la Modificación</Typography>
                <DynamicTable
                    rows={[auditoria.lista_de_cambios.data_before_modification]}
                    headOfColumns={generateColumnHead(data_before_access)}
                    accessToRows={data_before_access}
                    numberOfRows={1}
                />

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Cambios Después de la Modificación</Typography>
                <DynamicTable
                    rows={[auditoria.lista_de_cambios.data_after_modification]}
                    headOfColumns={generateColumnHead(data_after_access)}
                    accessToRows={data_after_access}
                    numberOfRows={1}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="inherit">
                    Cerrar
                </Button>
            </DialogActions>
        </>
    );
};
