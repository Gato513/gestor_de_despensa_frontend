"use client"
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Alert, AlertTitle } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { fetchAuditReport } from "@/services/informes.service";
import { generateAuditReportPDF } from "./generarPDF/generateAuditReportPDF";
import dayjs from "dayjs";

const renderAlert = (alert) => {
    if (!alert.visible) return null;
    return (
        <Alert severity={alert.type} sx={{ m: 2 }}>
            <AlertTitle>{alert.type === "success" ? "Éxito" : "Error"}</AlertTitle>
            {alert.message}
        </Alert>
    );
};

export const AuditReportModal = ({ open, handleClose }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });

    const showAlert = (type, message) => {
        setAlert({ type, message, visible: true });
        setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
    };

    const handleFetchReport = async () => {
        if (!startDate || !endDate) {
            showAlert("warning", "Ingrese un rango de fechas");
            return
        };

        const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
        const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

        try {
            const reportData = await fetchAuditReport(formattedStartDate, formattedEndDate);
            await generateAuditReportPDF(reportData, formattedStartDate, formattedEndDate)
            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (error) {
            console.error("Error al octener los datos:", error);
            showAlert("error", "Hubo un problema al octener los datos.");
        }
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>Generar Informe de Auditorias</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box display="flex" flexDirection="column" gap={2} p={1}>
                        <DatePicker
                            label="Fecha Inicial"
                            value={startDate}
                            onChange={setStartDate}
                            format="YYYY-MM-DD"
                        />
                        <DatePicker
                            label="Fecha Final"
                            value={endDate}
                            onChange={setEndDate}
                            format="YYYY-MM-DD"
                        />
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            {renderAlert(alert)}
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cerrar</Button>
                <Button onClick={handleFetchReport} variant="contained" color="primary">Generar</Button>
            </DialogActions>
        </Dialog>
    );
};
