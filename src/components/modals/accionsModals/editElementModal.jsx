"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, TextField, Typography, IconButton, Alert, AlertTitle, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";

const renderAlert = (alert) => {
    if (!alert.visible) return null;
    return (
        <Alert severity={alert.type} sx={{ m: 2 }}>
            <AlertTitle>{alert.type === "success" ? "Éxito" : "Error"}</AlertTitle>
            {alert.message}
        </Alert>
    );
};

export const EditElementModal = ({ isOpen, onClose, row, fieldsToEdit, config, targetId, handleModifyRows }) => {
    const { control, handleSubmit, reset, setValue } = useForm();
    const [alert, setAlert] = useState({ type: "", message: "", visible: false });

    //$ Inicializa los valores del formulario con los datos de la fila
    useEffect(() => {
        if (row && fieldsToEdit.length > 0) {
            fieldsToEdit.forEach((key) => {
                setValue(key, row[key] || "");
            });
        }
    }, [row, fieldsToEdit, setValue]);

    const showAlert = (type, message) => {
        setAlert({ type, message, visible: true });
        setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
    };

    const onSubmit = async (formData) => {
        const { actionFunction, type } = config;

        try {
            const dataUpdate = {
                typeOfAction: type,
                rowElementId: targetId,
                objetoToEdit: formData,
            };

            await await actionFunction(targetId, formData);

            handleModifyRows(dataUpdate);
            showAlert("success", "Cambios guardados exitosamente.");
            setTimeout(() => {
                reset
                onClose();
            }, 3000);
        } catch (error) {
            console.error("Error al modificar la fila:", error);
            showAlert("error", "Hubo un problema al guardar los cambios.");
        }
    };

    const handleAction = async () => {

        try {
            ;
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

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{config.dialogTitle}</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {fieldsToEdit.map((key) => (
                            <Controller
                                key={key}
                                name={key}
                                control={control}
                                defaultValue=""
                                rules={{ required: `${key} es obligatorio.` }}
                                render={({ field, fieldState }) => (
                                    <TextField
                                        {...field}
                                        label={key}
                                        fullWidth
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        ))}
                    </Box>
                </DialogContent>

                {renderAlert(alert)}

                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Cancelar
                    </Button>
                    <Button form="edit-form" type="submit" variant="contained" color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
