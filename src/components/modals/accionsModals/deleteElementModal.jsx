"use client";

import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, } from "@mui/material";
import { DialogTitle, IconButton, Typography, Alert, AlertTitle, } from "@mui/material";

const renderAlert = (alert) => {
    if (!alert.visible) return null;
    return (
        <Alert severity={alert.type} sx={{ m: 2 }}>
            <AlertTitle sx={{ fontWeight: 600 }}>
                {alert.type === "success" ? "Éxito" : "Error"}
            </AlertTitle>
            {alert.message}
        </Alert>
    );
};

export const CreateProductoModal = ({ open, handleClose, elementId }) => {

    const [alert, setAlert] = useState({ type: "", message: "", visible: false });

    // Mostrar alerta con un tiempo de expiración
    const showAlert = (type, message) => {
        setAlert({ type, message, visible: true });
        setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
    };

    const deleteElement = async () => {
        console.log(elementId);
    };

    return (
        <Dialog open={open} onClose={() => handleClose()} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Eliminar elemento</Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" alignItems={"center"}>
                    <Typography variant="h6">Esta seguro de querer eliminar este elemento de manera permanente</Typography>
                </Box>
            </DialogContent>

            {renderAlert()}

            <DialogActions>
                <Button onClick={() => handleClose()} color="inherit">
                    Canselar
                </Button>
                <Button variant="contained" color="primary" onClick={deleteElement}>
                    Eliminar
                </Button>
            </DialogActions>
        </Dialog>
    );
};
