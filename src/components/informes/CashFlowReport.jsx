"use client"
import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, Alert, AlertTitle, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { fetchCashFlowReport } from "@/services/informes.service";
import { generateFinancialReportPDF } from "./generarPDF/generateCashFlowReportPDF";
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

export const CashFlowReportModal = ({ open, handleClose }) => {
    const [date, setDate] = useState(null);
    const [periodo, setPeriodo] = useState("dia"); // Predeterminado a "día"
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });

    const showAlert = (type, message) => {
        setAlert({ type, message, visible: true });
        setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
    };

    const handleFetchReport = async () => {
        if (!date) {
            showAlert("error", "Por favor, selecciona una fecha.");
            return;
        }

        const formattedDate = dayjs(date).format("YYYY-MM-DD");

        try {
            const reportData = await fetchCashFlowReport(formattedDate, periodo);
            await generateFinancialReportPDF(reportData, formattedDate, periodo);

            setTimeout(() => {
                handleClose();
            }, 3000);
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            showAlert("error", "Hubo un problema al obtener los datos.");
        }
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>Generar Informe de Flujo de Caja</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box display="flex" flexDirection="column" gap={2} p={1}>
                        <DatePicker
                            label="Fecha Inicial"
                            value={date}
                            onChange={setDate}
                            format="YYYY-MM-DD"
                        />
                        <FormControl fullWidth>
                            <InputLabel>Periodo</InputLabel>
                            <Select
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value)}
                            >
                                <MenuItem value="dia">Día</MenuItem>
                                <MenuItem value="mes">Mes</MenuItem>
                                <MenuItem value="año">Año</MenuItem>
                            </Select>
                        </FormControl>
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

