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
import { createProduct } from "@/services/products.service";

export const CreateProductoModal = ({ open, handleClose }) => {
	const { control, handleSubmit, reset, watch } = useForm({
		defaultValues: {
			codigoBarras: "",
			nombreProducto: "",
			precioVenta: 0,
			precioCompra: 0,
			stockMinimo: "",
		},
	});

	const precioVenta = parseInt(watch("precioVenta"));
	const precioCompra = parseInt(watch("precioCompra"));

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

	const handleFormSubmit = async (data) => {

		if (precioVenta < precioCompra){
			showAlert("error", "El precio venta no puede se menor al precio compra.");
			return
		}

		try {
				const newProduct = await createProduct(data);
				showAlert("success", "Producto guardado exitosamente.");

				// Limpiar formulario y cerrar modal después de un tiempo
				setTimeout(() => {
					reset();
					handleClose(newProduct);
				}, 3000);
			} catch (error) {
				console.error("Error al guardar el producto:", error);
				showAlert("error", "Hubo un problema al guardar el producto.");
			}
	};

	return (
		<Dialog open={open} onClose={() => handleClose()} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					<Typography variant="h6">Agregar Producto</Typography>
					<IconButton onClick={() => handleClose()}>
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>

			<form id="producto-form" onSubmit={handleSubmit(handleFormSubmit)}>
				<DialogContent dividers>
					<Box display="flex" flexDirection="column" gap={2}>
						<Controller
							name="codigoBarras"
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
							name="nombreProducto"
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
							name="precioVenta"
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
									inputProps={{ min: 0, step: 1 }}
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>

						<Controller
							name="precioCompra"
							control={control}
							rules={{
								required: "El precio de compra es obligatorio.",
								min: { value: 0, message: "El precio debe ser mayor o igual a 0." },
							}}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Precio de Compra"
									type="number"
									fullWidth
									inputProps={{ min: 0, step: 1 }}
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
								/>
							)}
						/>

						<Controller
							name="stockMinimo"
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
				</DialogContent>

				{renderAlert()}

				<DialogActions>
					<Button onClick={() => handleClose()} color="inherit">
						Cerrar
					</Button>
					<Button form="producto-form" type="submit" variant="contained" color="primary">
						Guardar
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};
