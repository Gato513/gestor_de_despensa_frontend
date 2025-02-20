"use client";

import { useState } from "react";
import { Box, Button, DialogActions, DialogContent } from "@mui/material";
import { DialogTitle, Typography, Alert, AlertTitle } from "@mui/material";

const renderFeedbackAlert = (feedback) => {
    if (!feedback.visible) return null;
    return (
        <Alert severity={feedback.type} sx={{ m: 2 }}>
            <AlertTitle sx={{ fontWeight: 600 }}>
                {feedback.type === "success" ? "Éxito" : "Error"}
            </AlertTitle>
            {feedback.message}
        </Alert>
    );
};

export const ConfirmationDialog = ({ onClose, targetId, actionConfig, handleModifyRows }) => {
    const [feedback, setFeedback] = useState({ type: "", message: "", visible: false });
    const [isProcessing, setIsProcessing] = useState(false);

    const displayFeedback = (type, message) => {
        setFeedback({ type, message, visible: true });
        setTimeout(() => setFeedback({ type: "", message: "", visible: false }), 3000);
    };

    const handleAction = async () => {
        const { actionFunction, type } = actionConfig;
        const modificationData = { rowElementId: targetId, typeOfAction: type }

        setIsProcessing(true);
        try {
            await actionFunction(targetId);
            displayFeedback("success", "Operación realizada con éxito.");
            handleModifyRows(modificationData);

            onClose();
        } catch (error) {
            console.log(error)
            displayFeedback("error", "Ocurrió un error al realizar la operación.");
        } finally {
            setIsProcessing(false);
        }
    };

    const actionText = actionConfig.type === "disguise" ? "Ocultar" : "Eliminar";
    const processingText = actionConfig.type === "disguise" ? "Ocultando..." : "Eliminando...";

    return (
        <>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{actionConfig.dialogTitle}</Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" alignItems={"center"}>
                    <Typography variant="h6">{actionConfig.dialogMessage}</Typography>
                </Box>
            </DialogContent>

            {renderFeedbackAlert(feedback)}

            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={isProcessing}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAction}
                    disabled={isProcessing}
                >
                    {isProcessing ? processingText : actionText}
                </Button>
            </DialogActions>
        </>
    );
};
