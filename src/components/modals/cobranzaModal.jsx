"use client";

import { useState } from "react";
import {
	Modal,
	Box,
	Typography,
	TextField,
	MenuItem,
	Button,
	Alert,
	AlertTitle,
} from "@mui/material";
import { RemitoBillingModal } from "@/components/modals/remitoBillingModal";

// Datos ficticios como ejemplo (en producción, se cargan desde la base de datos)
const clientesFicticios = [
	{ id_cliente: 1, nombre: "Juan Pérez" },
	{ id_cliente: 2, nombre: "Ana López" },
	{ id_cliente: 3, nombre: "Carlos García" },
];

export const CobranzaModal = ({ open, handleClose }) => {
	const [clienteSeleccionado, setClienteSeleccionado] = useState("");
	const [monto, setMonto] = useState("");
	const [alerta, setAlerta] = useState({ visible: false, tipo: "", mensaje: "" });
	const [openRemitoBillingModal, setRemitoBillingModal] = useState(false);

	const handleCloseModal = () => {
		setRemitoBillingModal(false);
	};

	// Maneja el registro de la cobranza
	const manejarCobranza = async () => {

		if (!clienteSeleccionado || !monto || parseFloat(monto) <= 0) {
			setAlerta({
				visible: true,
				tipo: "error",
				mensaje: "Por favor, complete todos los campos correctamente.",
			});
			return;
		}

		try {
			console.log("Registrando cobranza para:", { clienteSeleccionado, monto });

			// Aquí iría la lógica para guardar en la base de datos usando Axios.
			// await registrarCobranza({ id_cliente: clienteSeleccionado, monto });

			// Simulación de éxito
			setAlerta({ visible: false, tipo: "", mensaje: "" }); // Oculta alerta antes de abrir el modal
			setRemitoBillingModal(true);

			// Cierra el modal principal
			setTimeout(() => {
				handleClose();
			}, 1500);
		} catch (error) {
			console.error("Error al registrar el pago:", error);
			setAlerta({
				visible: true,
				tipo: "error",
				mensaje: "Error al registrar el pago. Intente nuevamente.",
			});
		}
	};

	return (
		<>
			<Modal
				open={open}
				onClose={() => handleClose()}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						bgcolor: "background.paper",
						borderRadius: 2,
						boxShadow: 24,
						p: 4,
					}}
				>
					<Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
						Registrar Cobranza
					</Typography>

					{/* Selección de cliente */}
					<TextField
						label="Cliente"
						select
						fullWidth
						value={clienteSeleccionado}
						onChange={(e) => setClienteSeleccionado(e.target.value)}
						sx={{ mb: 2 }}
					>
						{clientesFicticios.map((cliente) => (
							<MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
								{cliente.nombre}
							</MenuItem>
						))}
					</TextField>

					{/* Campo de monto */}
					<TextField
						label="Monto a pagar"
						type="number"
						fullWidth
						value={monto}
						onChange={(e) => setMonto(e.target.value.replace(/[^\d.]/g, ""))}
						sx={{ mb: 2 }}
					/>

					{/* Alerta de validación */}
					{alerta.visible && (
						<Alert severity={alerta.tipo} sx={{ mb: 2 }}>
							<AlertTitle>{alerta.tipo === "success" ? "Éxito" : "Error"}</AlertTitle>
							{alerta.mensaje}
						</Alert>
					)}

					{/* Botones */}
					<Box display="flex" justifyContent="space-between">
						<Button variant="contained" color="error" onClick={() => handleClose()}>
							Cancelar
						</Button>
						<Button variant="contained" color="primary" onClick={manejarCobranza}>
							Registrar
						</Button>
					</Box>
				</Box>
			</Modal>

			{/* Modal secundario */}
			{openRemitoBillingModal && (
				<RemitoBillingModal
					open={openRemitoBillingModal}
					handleClose={handleCloseModal}
					cliente={clientesFicticios.find((c) => c.id_cliente === clienteSeleccionado)}
					montoAbonado={parseFloat(monto) || 0}
				/>

			)}
		</>
	);
};
