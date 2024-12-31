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

export const ProductoModal = ({ open, handleClose }) => {
	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			codigo_barras: "",
			nombre_producto: "",
			precio_venta: "",
			stock_disponible: "",
			stock_minimo: "",
		},
	});

	const [alert, setAlert] = useState({ type: "", message: "", visible: false });

	const handleFormSubmit = async (data) => {
		try {
			console.log("Datos del producto:", data); // Reemplaza esto con tu lógica para enviar los datos al backend.
			setAlert({
				type: "success",
				message: "Producto guardado exitosamente.",
				visible: true,
			});

			// Limpiar formulario y cerrar modal después de un tiempo
			setTimeout(() => {
				reset();
				setAlert({ type: "", message: "", visible: false });
				handleClose();
			}, 3000);
		} catch (error) {
			console.error("Error al guardar el producto:", error);
			setAlert({
				type: "error",
				message: "Hubo un problema al guardar el producto.",
				visible: true,
			});
			setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
		}
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Typography variant="h6">Agregar Producto</Typography>
					<IconButton onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent dividers>
				<form id="producto-form" onSubmit={handleSubmit(handleFormSubmit)}>
					<Box display="flex" flexDirection="column" gap={2}>
						<Controller
							name="codigo_barras"
							control={control}
							rules={{ required: "El código de barras es obligatorio." }}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Código de Barras"
									fullWidth
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
						<Controller
							name="nombre_producto"
							control={control}
							rules={{ required: "El nombre del producto es obligatorio." }}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Nombre del Producto"
									fullWidth
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
						<Controller
							name="precio_venta"
							control={control}
							rules={{
								required: "El precio de venta es obligatorio.",
								min: { value: 0, message: "El precio debe ser mayor o igual a 0." },
							}}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Precio de Venta"
									type="number"
									fullWidth
									inputProps={{ min: 0, step: "0.01" }}
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
						<Controller
							name="stock_disponible"
							control={control}
							rules={{
								required: "El stock disponible es obligatorio.",
								min: { value: 0, message: "El stock debe ser mayor o igual a 0." },
							}}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Stock Disponible"
									type="number"
									fullWidth
									inputProps={{ min: 0 }}
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
						<Controller
							name="stock_minimo"
							control={control}
							rules={{
								required: "El stock mínimo es obligatorio.",
								min: { value: 0, message: "El stock mínimo debe ser mayor o igual a 0." },
							}}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Stock Mínimo"
									type="number"
									fullWidth
									inputProps={{ min: 0 }}
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>
					</Box>
				</form>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleClose} color="inherit">
					Cerrar
				</Button>
				<Button form="producto-form" type="submit" variant="contained" color="primary">
					Guardar
				</Button>
			</DialogActions>

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
