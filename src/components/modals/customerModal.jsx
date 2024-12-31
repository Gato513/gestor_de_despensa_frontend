import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, Divider, Grid2, TextField, Alert, AlertTitle, } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createCustomer } from "@/services/customers.service";
import { useForm, Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import Image from "next/image";


export const CreateCustomerModal = ({ open, handleClose }) => {
	const { control, handleSubmit, reset } = useForm();
	const [alertVisible, setAlertVisible] = useState(false);
	const [errorAlert, setErrorAlert] = useState(false);

	const handleSubmitForm = async (data) => {
		try {
			await createCustomer(data);
			reset();
			setAlertVisible(true);


			setTimeout(() => setAlertVisible(false), 3000);
		} catch (error) {
			setErrorAlert(true);
			setTimeout(() => setErrorAlert(false), 3000);
		}
	};

	return (
		<Dialog
			onClose={handleClose}
			aria-labelledby="customized-dialog-title"
			open={open}
			maxWidth="md"
			fullWidth
		>
			<DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
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
					onClick={handleClose}
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

			<form id="customer-form" onSubmit={handleSubmit(handleSubmitForm)}>
				<DialogContent dividers>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<Box>
							<Box sx={{ border: "1px solid #E0E0E0", p: 2, borderRadius: "8px", mb: 2 }}>

								<Typography sx={{ fontWeight: 600, color: "#7055F5", m: "2" }}>
									Datos personales
								</Typography>

								<Divider sx={{ my: 2 }} />

								<Grid2 container spacing={2}>

									<Grid2 xs={12} sm={6} md={4}>
										<Controller
											name="nombreCliente"
											control={control}
											defaultValue=""
											rules={{ required: "El nombre es requerido" }}
											render={({ field, fieldState: { error } }) => (
												<TextField
													{...field}
													label="Nombre Cliente"
													error={!!error}
													helperText={error ? error.message : ""}
													required
													fullWidth
												/>
											)}
										/>
									</Grid2>

									<Grid2 xs={12} sm={6} md={4}>
										<Controller
											name="telefonoCliente"
											control={control}
											defaultValue=""
											render={({ field, fieldState: { error } }) => (
												<TextField
													{...field}
													label="Telefono Cliente"
													error={!!error}
													helperText={error ? error.message : ""}
													required
													fullWidth
												/>
											)}
										/>
									</Grid2>

									<Grid2 xs={12} sm={6} md={4}>
										<Controller
											name="direccionCliente"
											control={control}
											defaultValue=""
											render={({ field, fieldState: { error } }) => (
												<TextField
													{...field}
													label="Direccion del Cliente"
													error={!!error}
													helperText={error ? error.message : ""}
													required
													fullWidth
												/>
											)}
										/>
									</Grid2>

								</Grid2>

							</Box>
						</Box>

					</LocalizationProvider>
				</DialogContent>

				<DialogActions>

					<Button onClick={handleClose} color="inherit" sx={{ fontWeight: "600" }} variant="text">
						Cerrar
					</Button>

					<Button type="submit" variant="contained" sx={{ backgroundColor: "#5a3fd1", color: "white" }}>
						Guardar Cliente
					</Button>

				</DialogActions>
			</form>

			{/* Alertas */}
			{alertVisible && (
				<Alert severity="success">
					<AlertTitle sx={{ fontWeight: "600" }}>
						Cliente guardado exitosamente.
					</AlertTitle>
					El nuevo cliente ha sido agregado correctamente.
				</Alert>
			)}
			{errorAlert && (
				<Alert severity="error" sx={{ mb: 2 }}>
					<AlertTitle sx={{ fontWeight: "600" }}>Error al guardar cliente.</AlertTitle>
					Hubo un problema al guardar el cliente.
				</Alert>
			)}

		</Dialog>
	);
};
