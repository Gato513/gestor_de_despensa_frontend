"use client";

import React, { useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	Typography,
	Alert,
	AlertTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { createProveedor } from "@/services/proveedores.service";

export const CreateProveedorModal = ({ open, handleClose }) => {
	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			nombreProveedor: "",
			telefonoProveedor: "",
			emailProveedor: "",
			direccionProveedor: "",
		},
	});

	const [alert, setAlert] = useState({ type: "", message: "", visible: false });

	// Mostrar alerta con un tiempo de expiración
	const showAlert = (type, message) => {
		setAlert({ type, message, visible: true });
		setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
	};

	const renderAlert = () => {
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

	// Manejo del envío del formulario
	const handleFormSubmit = async (data) => {
		try {
			const newProveedor = await createProveedor(data);
			showAlert("success", "Proveedor guardado exitosamente.");

			// Limpiar formulario y cerrar modal después de un tiempo
			setTimeout(() => {
				reset();
				handleClose(newProveedor);
			}, 3000);
		} catch (error) {
			console.error("Error al guardar el proveedor:", error);
			showAlert("error", "Hubo un problema al guardar el proveedor.");
		}
	};

	return (
		<Dialog open={open} onClose={() => handleClose()} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Typography variant="h6">Agregar Proveedor</Typography>
					<IconButton onClick={() => handleClose()}>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<form id="proveedor-form" onSubmit={handleSubmit(handleFormSubmit)}>
				<DialogContent dividers>
					<Box display="flex" flexDirection="column" gap={2}>
						<Controller
							name="nombreProveedor"
							control={control}
							rules={{ required: "El nombre es obligatorio." }}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Nombre del Proveedor"
									fullWidth
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
						<Controller
							name="telefonoProveedor"
							control={control}
							render={({ field }) => (
								<TextField {...field} label="Teléfono" fullWidth />
							)}
						/>
						<Controller
							name="emailProveedor"
							control={control}
							render={({ field }) => (
								<TextField {...field} label="Correo Electrónico" type="email" fullWidth />
							)}
						/>
						<Controller
							name="direccionProveedor"
							control={control}
							render={({ field }) => (
								<TextField {...field} label="Dirección" fullWidth />
							)}
						/>
					</Box>
				</DialogContent>

				{renderAlert()}

				<DialogActions>
					<Button onClick={() => handleClose()} color="inherit">
						Cerrar
					</Button>
					<Button form="proveedor-form" type="submit" variant="contained" color="primary">
						Guardar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};
