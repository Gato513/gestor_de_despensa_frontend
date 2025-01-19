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
	Typography,
	Divider,
	TextField,
	Alert,
	Grid2,
	AlertTitle,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createCustomer } from "@/services/customers.service";
import { useForm, Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import generateKey from "@/util/generateKey";

const renderCustomerFields = (control) => (
	<Box sx={{ border: "1px solid #E0E0E0", p: 2, borderRadius: "8px", mb: 2 }}>
		<Typography sx={{ fontWeight: 600, color: "#7055F5", mb: 2 }}>Datos personales</Typography>
		<Divider sx={{ my: 2 }} />
		<Grid2 container spacing={2}>
			{[
				{ name: "nombreCliente", label: "Nombre Cliente", required: true },
				{ name: "telefonoCliente", label: "Teléfono Cliente", required: true },
				{ name: "direccionCliente", label: "Dirección del Cliente", required: true },
			].map(({ name, label, required }) => (
				<Controller
					key={generateKey(name)}
					name={name}
					control={control}
					rules={required ? { required: `${label} es obligatorio.` } : {}}
					render={({ field, fieldState: { error } }) => (
						<TextField
							{...field}
							label={label}
							error={!!error}
							helperText={error?.message || ""}
							required={required}
							fullWidth
						/>
					)}
				/>
			))}
		</Grid2>
	</Box>
);

export const CreateCustomerModal = ({ open, handleClose }) => {
	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			nombreCliente: "",
			telefonoCliente: "",
			direccionCliente: "",
		},
	});

	const [alert, setAlert] = useState({ type: "", message: "", visible: false });

	const showAlert = (type, message) => {
		setAlert({ type, message, visible: true });
		setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
	};

	const renderAlert = () => {
		if (!alert.visible) return null;
		return (
			<Alert severity={alert.type} sx={{ mb: 2 }}>
				<AlertTitle sx={{ fontWeight: "600" }}>
					{alert.type === "success" ? "Cliente guardado exitosamente." : "Error al guardar cliente."}
				</AlertTitle>
				{alert.message}
			</Alert>
		);
	};

	// Manejo del envío del formulario
	const handleFormSubmit = async (data) => {
		try {
			const newClient = await createCustomer(data);
			showAlert("success", "El nuevo cliente ha sido agregado correctamente.");

			// Limpiar formulario y cerrar modal después de un tiempo
			setTimeout(() => {
				reset();
				handleClose(newClient);
			}, 3000);
		} catch (error) {
			console.error("Error al guardar el cliente:", error);
			showAlert("error", "Hubo un problema al guardar el cliente.");
		}
	};

	return (
		<Dialog
			aria-labelledby="create-customer-modal-title"
			open={open}
			maxWidth="md"
			fullWidth
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id="create-customer-modal-title">
				<Box display="flex" alignItems="center" gap={1}>
					<Image
						src="/assets/icon-new-client.svg"
						alt="Nuevo cliente"
						width={24}
						height={24}
					/>
					<Typography variant="h6">Nuevo cliente</Typography>
				</Box>
				<IconButton
					aria-label="close"
					onClick={() => { handleClose() }}
					sx={(theme) => ({
						position: "absolute",
						right: 8,
						top: 8,
						color: theme.palette.grey[500],
					})}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<form id="customer-form" onSubmit={handleSubmit(handleFormSubmit)}>
				<DialogContent dividers>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						{renderCustomerFields(control)}
					</LocalizationProvider>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => { handleClose() }}
						color="inherit"
						sx={{ fontWeight: "600" }}
						variant="text"
					>
						Cerrar
					</Button>

					<Button
						type="submit"
						variant="contained"
						sx={{ backgroundColor: "#5a3fd1", color: "white" }}
					>
						Guardar Cliente
					</Button>
				</DialogActions>
			</form>

			{renderAlert()}
		</Dialog>
	);
};
