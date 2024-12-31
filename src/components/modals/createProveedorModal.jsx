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

export const ProveedorModal = ({ open, handleClose }) => {
	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			nombre_proveedor: "",
			telefono_proveedor: "",
			email_proveedor: "",
			direccion_proveedor: "",
		},
	});

	const [alert, setAlert] = useState({ type: "", message: "", visible: false });

	const handleFormSubmit = async (data) => {
		try {
			console.log("Datos del proveedor:", data); // Aquí puedes reemplazarlo con tu servicio de guardado.
			setAlert({
				type: "success",
				message: "Proveedor guardado exitosamente.",
				visible: true,
			});

			// Limpiar formulario y cerrar modal después de un tiempo
			setTimeout(() => {
				reset();
				setAlert({ type: "", message: "", visible: false });
				handleClose();
			}, 3000);
		} catch (error) {
			console.error("Error al guardar el proveedor:", error);
			setAlert({
				type: "error",
				message: "Hubo un problema al guardar el proveedor.",
				visible: true,
			});
			setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Typography variant="h6">Agregar Proveedor</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>
			<form id="proveedor-form" onSubmit={handleSubmit(handleFormSubmit)}>
				<DialogContent dividers>

					<Box display="flex" flexDirection="column" gap={2}>
						<Controller
							name="nombre_proveedor"
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
							name="telefono_proveedor"
							control={control}
							render={({ field }) => (
								<TextField {...field} label="Teléfono" fullWidth />
							)}
						/>
						<Controller
							name="email_proveedor"
							control={control}
							render={({ field }) => (
								<TextField {...field} label="Correo Electrónico" type="email" fullWidth />
							)}
						/>
						<Controller
							name="direccion_proveedor"
							control={control}
							render={({ field }) => (
								<TextField {...field} label="Dirección" fullWidth />
							)}
						/>
					</Box>

				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} color="inherit">
						Cerrar
					</Button>
					<Button form="proveedor-form" type="submit" variant="contained" color="primary">
						Guardar
					</Button>
				</DialogActions>
			</form>

			{alert.visible && (
				<Alert severity={alert.type} sx={{ m: 2 }}>
					<AlertTitle sx={{ fontWeight: 600 }}>
						{alert.type === "success" ? "Éxito" : "Error"}
					</AlertTitle>
					{alert.message}
				</Alert>
			)}
		</Dialog>
	);
};
