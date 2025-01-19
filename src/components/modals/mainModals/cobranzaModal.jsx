"use client";

import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography,
	TextField,
	MenuItem,
	Alert,
	AlertTitle,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { fetchAllCustomers } from "@/services/customers.service";
import { collectionAndBilling } from "@/services/transactions.service";
import { searchAllCustomerRemitos } from "@/services/remitos.service";
import { capitalize } from "@/util/formatter";
import generateKey from "@/util/generateKey";

const renderClientes = (clientes) => {
	return clientes.map((cliente) => (
		<MenuItem key={generateKey(cliente.id_cliente)} value={cliente.id_cliente}>
			{cliente.nombre_cliente}
		</MenuItem>
	));
}

const renderRemitos = (remitos, seleccionados, handleSelectRemito) => {

	return remitos.length > 0 ? (
		remitos.map((remito) => (
			<TableRow key={generateKey(remito.id_remito)}>
				<TableCell>
					<Checkbox
						checked={seleccionados.includes(remito.id_remito)}
						onChange={() => handleSelectRemito(remito.id_remito)}
						aria-label={`Seleccionar remito ${remito.id_remito}`}
					/>
				</TableCell>
				<TableCell>{remito.id_remito}</TableCell>
				<TableCell>{remito.fecha_remito}</TableCell>
				<TableCell>{remito.saldo_restante}</TableCell>
				<TableCell>{remito.monto_total}</TableCell>
				<TableCell>{capitalize(remito.estado)}</TableCell>
			</TableRow>
		))
	) : (
		<TableRow>
			<TableCell colSpan={6} style={{ textAlign: "center" }}>
				No hay remitos asociados para este cliente.
			</TableCell>
		</TableRow>
	);
};

const renderAlert = (alert) => {
	if (!alert.visible) return null;
	return (
		<Alert severity={alert.type} sx={{ mb: 2 }}>
			<AlertTitle sx={{ fontWeight: 600 }}>
				{alert.type === "success" ? "Éxito" : "Error"}
			</AlertTitle>
			{alert.message}
		</Alert>
	);
};

// Custom hook para cargar datos iniciales
const useFetchDataClient = () => {
	const [clientes, setClientes] = useState([]);
	const [isClientsLoaded, setIsClientsLoaded] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchAllCustomers();
				setClientes(data);
				setIsClientsLoaded(true);
			} catch (error) {
				console.error("Error al cargar datos:", error);
			}
		};
		fetchData();
	}, []);

	return { clientes, isClientsLoaded };
};

export const CobranzaModal = ({ open, handleClose }) => {
	const { clientes, isClientsLoaded } = useFetchDataClient();
	const [isRemitoLoaded, setIsRemitoLoaded] = useState(false);

	const [remitos, setRemitos] = useState([]);
	const [totalDebt, setTotalDebt] = useState(0)

	const [alert, setAlert] = useState({ type: "", message: "", visible: false });

	const { control, handleSubmit, reset, watch, setValue } = useForm({
		defaultValues: {
			cliente: "",
			seleccionados: [],
			pagosParciales: [],
			billingRemito: [],
			monto: "",
			montoRestante: "",
		},
	});

	const clienteSeleccionado = watch("cliente");
	const seleccionados = watch("seleccionados");
	const pagosParciales = watch("pagosParciales");
	const billingRemito = watch("billingRemito");
	const monto = parseInt(watch("monto")) || 0;
	const montoRestante = parseInt(watch("montoRestante")) || 0;

	useEffect(() => { // $ Cargar los remitos de un cliente cuando se seleccione:
		const fetchRemitaForClient = async (clientId) => {
			try {
				const { remitosData, totalClientDebt } = await searchAllCustomerRemitos(clientId); //! Si no existe remito para cliente se devulve []
				setRemitos(remitosData)
				setTotalDebt(totalClientDebt)
				setIsRemitoLoaded(true);
			} catch (error) {
				console.error("Error al cargar datos:", error);
			}
		}
		clienteSeleccionado && (fetchRemitaForClient(clienteSeleccionado))
	}, [clienteSeleccionado])

	useEffect(() => { // $ Modificar el valor de montoRestante:
		if (seleccionados.length === 0) {
			setValue("montoRestante", monto);
			return
		}
	}, [monto])

	const showAlert = (type, message) => {
		setAlert({ type, message, visible: true });
		setTimeout(() => setAlert({ type: "", message: "", visible: false }), 4000);
	};

	const handleSelectRemito = (id_remito) => {

		if (!monto) {
			showAlert("warning", "Ingrese un monto a pagar antes de seleccionar remitos");
			return;
		}

		const remito = remitos.find((r) => r.id_remito === id_remito); //$ Recuperar objeto remito de lista de remitos.
		if (!remito) return;

		if (!seleccionados.includes(id_remito)) { 		 //$ Si en la lista de seleccionados no esta el id_remito Agregarlo si existe quitar de la lista.
			if (montoRestante < remito.saldo_restante) { //$ Si el montoRestante < remito.saldo_restante se paga parcialmente si no se paga todo el remito.
				//? Pago Parcial:
				if (montoRestante > 0) { 				 //$ Si el moto restante es mayo a 0 realoza el pago parcial si no renderiza una alerta.
					setValue("seleccionados", [...seleccionados, id_remito]);
					const pagoParcial = montoRestante;
					setValue("montoRestante", 0);
					setValue("pagosParciales", { ...pagosParciales, [id_remito]: pagoParcial });

					const remitosActualizados = remitos.map((r) => {
						if (r.id_remito === id_remito) {
							const saldo_restante = r.saldo_restante - pagoParcial

							setValue("billingRemito", [
								...billingRemito,
								{
									remitoId: id_remito,
									montoDescontado: pagoParcial,
									montoRestante: saldo_restante,
									nuevoEstado: 2
								}]);

							return {
								...r,
								saldo_restante,
								estado: "parcialmente",
							}
						}
						return r
					}
					);

					setRemitos(remitosActualizados);
					showAlert("success", `Pago parcial de $${pagoParcial.toFixed(2)} aplicado al remito Nº: ${id_remito}.`);

				} else { showAlert("warning", `No tienes saldo suficiente para pagar el remito Nº: ${id_remito}.`); }
			} else {

				//% Pago completo:
				setValue("seleccionados", [...seleccionados, id_remito]);
				setValue("montoRestante", montoRestante - remito.saldo_restante);

				setValue("billingRemito", [
					...billingRemito,
					{
						remitoId: id_remito,
						montoDescontado: remito.saldo_restante,
						montoRestante: 0,
						nuevoEstado: 3
					}]);

				const remitosActualizados = remitos.map((r) =>
					r.id_remito === id_remito ? { ...r, saldo_restante: 0, estado: "pagado" } : r
				);

				setRemitos(remitosActualizados);
			}
		} else {
			// Quitar el remito de seleccionados:
			setValue("seleccionados", seleccionados.filter((remitoId) => remitoId !== id_remito));
			setValue("billingRemito", billingRemito.filter((remitoData) => remitoData.remitoId !== id_remito));

			// Revertir pago de remitos:
			if (pagosParciales[id_remito]) { //$ Determina si el pago realizado en el remito es parcial o completo para devolver el valor original.
				// Caso de pago parcial
				const pagoParcial = pagosParciales[id_remito];
				setValue("montoRestante", montoRestante + pagoParcial);

				// Actualizar remito a estado parcial previo
				const remitosActualizados = remitos.map((r) =>
					r.id_remito === id_remito
						? { ...r, saldo_restante: r.saldo_restante + pagoParcial, estado: "pendiente" }
						: r
				);

				setRemitos(remitosActualizados);

				// Quitar el remito de pagos parciales
				const { [id_remito]: _, ...nuevosPagosParciales } = pagosParciales;
				setValue("pagosParciales", nuevosPagosParciales);
			} else {
				// Caso de pago completo
				setValue("montoRestante", montoRestante + remito.monto_total);

				// Actualizar remito a estado pendiente
				const remitosActualizados = remitos.map((r) =>
					r.id_remito === id_remito
						? { ...r, saldo_restante: r.monto_total, estado: "pendiente" }
						: r
				);

				setRemitos(remitosActualizados);
			}
		}
	};

	const handleModalClosure = () => {
		reset();
		setRemitos([]);
		setIsRemitoLoaded(false);
		setAlert({ type: "", message: "", visible: false });
		handleClose();
	}

	const handleClickOnInputs = () => {
		if (billingRemito.length > 0) {
			showAlert(
				"warning",
				"No se puede modificar el valor mientras haya remitos seleccionados. Por favor, deseleccione todos los remitos para continuar."
			);
			return;
		}
	}

	const handleFormSubmit = async ({ cliente, monto, billingRemito }) => {
		if (!cliente || monto <= 0) {
			showAlert("warning", "Por favor, complete todos los campos correctamente.");
			return;
		}
		if (billingRemito.length === 0) {
			showAlert("warning", "Debes seleccionar al menos un remito para pagar.");
			return;
		}

		const billingData = { cliente, monto, billingRemito }

		try {
			const newClient = await collectionAndBilling(billingData);
			showAlert("success", "El nuevo cliente ha sido agregado correctamente.");

			// Limpiar formulario y cerrar modal después de un tiempo
			setTimeout(() => {
				reset();
				setIsRemitoLoaded(false);
				setRemitos([]);
				setTotalDebt(0);
				handleClose(newClient);
			}, 3000);
		} catch (error) {
			console.error("Error al realizar la operacion:", error);
			showAlert("error", "Hubo un problema al guardar el cliente.");
		}
	};

	return (
		isClientsLoaded && (
			<Dialog open={open} maxWidth="lg" fullWidth>
				<DialogTitle>
					<Typography sx={styles.DialogTitle}>
						Registro Cobranza y Facturación de Remitos
					</Typography>
					<IconButton aria-label="close" onClick={handleModalClosure} sx={{ position: "absolute", right: 8, top: 8 }}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<DialogContent dividers>

						{/* Selector de cliente */}
						<Box display="flex" gap={1} mb={2}>
							<Controller
								name="cliente"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Cliente"
										select
										fullWidth
										slotProps={{
											input: { readOnly: seleccionados.length === 0 ? false : true },
										}}
										onClick={handleClickOnInputs}
									>
										{clientes.length === 0 ? (
											<MenuItem disabled>
												No hay clientes disponibles. Crea uno nuevo.
											</MenuItem>
										) : (
											renderClientes(clientes)
										)}

									</TextField>
								)}
							/>
						</Box>

						{/* Campo de monto */}
						<Box mb={2}>
							<Controller
								name="monto"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Monto a pagar"
										type="number"
										fullWidth
										slotProps={{
											input: { readOnly: seleccionados.length === 0 ? false : true },
											htmlInput: { min: 0 },
										}}
										onClick={handleClickOnInputs}
									/>
								)}
							/>
						</Box>

						{isRemitoLoaded && (
							<Box>
								{/* Tabla de remitos */}
								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Seleccionar</TableCell>
												<TableCell>Nº Remito</TableCell>
												<TableCell>Fecha</TableCell>
												<TableCell>Monto Restante</TableCell>
												<TableCell>Monto Total</TableCell>
												<TableCell>Estado</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>{renderRemitos(remitos, seleccionados, handleSelectRemito)}</TableBody>
									</Table>
								</TableContainer>

								{/* Resumen */}
								{
									remitos.length > 0 && (
										!alert.visible ? (
											<Box display="flex" gap={2} mt={2}>
												<Typography variant="subtitle1">
													Deuda Total: {totalDebt} ₲
												</Typography>
												<Typography variant="subtitle1">
													Deuda Restante: {(totalDebt - (monto - montoRestante))} ₲
												</Typography>
												<Typography variant="subtitle1">
													Monto Abonado Restante: {montoRestante} ₲
												</Typography>
											</Box>
										) : (
											renderAlert(alert)
										)
									)
								}
							</Box>
						)}
					</DialogContent>

					{(!alert.visible && remitos.length > 0) && (
						<DialogActions>
							<Button onClick={handleModalClosure} color="inherit">
								Cancelar
							</Button>
							<Button type="submit" variant="contained" color="primary">
								Registrar
							</Button>
						</DialogActions>
					)}
				</form>
			</Dialog>
		)
	);
};

const styles = {
	DialogTitle: {
		fontSize: "1.3rem",
		color: "#2090E9",
		fontWeight: 600
	},
};