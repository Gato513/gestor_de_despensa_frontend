"use client";

import React, { useState, Fragment } from "react";
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { createUser } from "@/services/systemUser.service";
import generateKey from "@/util/generateKey";

const renderUserFields = (control) => (
	<Box sx={{ border: "1px solid #E0E0E0", p: 2, borderRadius: "8px", mb: 2 }}>
		<Grid2 container spacing={2}>
			{[
				{ name: "nombre_usuario", label: "Nombre del Usuario", required: true },
				{ name: "telefono_usuario", label: "Teléfono del Usuario", required: true },
				{ name: "email_user", label: "Email", required: true },
				{ name: "user_password", label: "Contraseña", required: true, type: "password" },
			].map(({ name, label, required, type }) => (
				<Fragment key={generateKey(name)}>
					<Controller
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
								type={type || "text"}
							/>
						)}
					/>
				</Fragment>
			))}
		</Grid2>
	</Box>
);

export const CreateSystemUserModal = ({ open, handleClose }) => {
	const { control, handleSubmit, reset } = useForm({
		defaultValues: {
			nombre_usuario: "",
			telefono_usuario: "",
			email_user: "",
			user_password: "",
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
				{alert.type === "success" ? "Usuario creado exitosamente." : "Error al crear usuario."}
				{alert.message}
			</Alert>
		);
	};

	const handleFormSubmit = async (data) => {
		try {
			const newUser = await createUser(data);
			showAlert("success", "El nuevo usuario ha sido agregado correctamente.");
			setTimeout(() => {
				reset();
				handleClose(newUser);
			}, 3000);
		} catch (error) {
			console.error("Error al crear el usuario:", error);
			showAlert("error", "Hubo un problema al crear el usuario.");
		}
	};

	return (
		<Dialog
			aria-labelledby="create-user-modal-title"
			open={open}
			maxWidth="md"
			fullWidth
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id="create-user-modal-title">

				<Typography sx={styles.DialogTitle}>
					Nuevo usuario
				</Typography>

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


			<form id="user-form" onSubmit={handleSubmit(handleFormSubmit)}>
				<DialogContent dividers>
					{renderUserFields(control)}
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} color="inherit" sx={{ fontWeight: "600" }} variant="text">
						Cerrar
					</Button>
					<Button type="submit" variant="contained" sx={{ backgroundColor: "#5a3fd1", color: "white" }}>
						Guardar Usuario
					</Button>
				</DialogActions>
			</form>

			{renderAlert()}
		</Dialog>
	);
};

const styles = {
	DialogTitle: {
		fontSize: "1.3rem",
		color: "#7055F5",
		fontWeight: 600
	},
};