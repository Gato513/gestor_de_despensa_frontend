"use client";

import { useState, useCallback } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Alert, AlertTitle, Box, Typography } from "@mui/material";
import { generateDebtReportPDF } from "./generarPDF/generateDebtReportPDF";
import { fetchDebtReport } from "@/services/informes.service";

const renderAlert = (alert) => {
    if (!alert.visible) return null;
    return (
        <Alert severity={alert.type} sx={{ m: 2 }}>
            <AlertTitle>{alert.type === "success" ? "Éxito" : "Error"}</AlertTitle>
            {alert.message}
        </Alert>
    );
};

export const DebtReportModal = ({ open, handleClose }) => {
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });
    const [loading, setLoading] = useState(false);

    const showAlert = useCallback((type, message) => {
        setAlert({ type, message, visible: true });
        setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
    }, []);

    const handleFetchReport = async () => {
        setLoading(true);
        try {
            const reportData = await fetchDebtReport();
            await generateDebtReportPDF(reportData);
            showAlert("success", "Informe generado con éxito.");
            setTimeout(() => handleClose(), 1000);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            showAlert("error", "Hubo un problema al obtener los datos.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 500, fontSize: '1.2rem' }}>Generar Informe de Deudas</DialogTitle>
            <DialogContent sx={{ paddingTop: 2 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    ¿Desea generar el informe de deudas?
                </Typography>
                {renderAlert(alert)}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', padding: 2 }}>
                <Button
                    onClick={handleClose}
                    color="secondary"
                    disabled={loading}
                    sx={{ borderRadius: 1, padding: '6px 16px' }}
                >
                    Cerrar
                </Button>
                <Button
                    onClick={handleFetchReport}
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{
                        borderRadius: 1,
                        padding: '6px 16px',
                        backgroundColor: loading ? 'gray' : '#1976d2',
                        '&:hover': { backgroundColor: loading ? 'gray' : '#1565c0' }
                    }}
                >
                    {loading ? "Generando..." : "Generar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};



