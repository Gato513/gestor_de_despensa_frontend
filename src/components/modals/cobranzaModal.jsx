"use client";

import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
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
import { useForm, Controller } from "react-hook-form";
import { fetchAllCustomers } from "@/services/customers.service";
import { searchAllCustomerRemitos } from "@/services/remitos.service";




const useFetchDataClient = () => {
	const [clientes, setClientes] = useState([]);
	const [isClientsLoaded, setIsClientsLoaded] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const dataClients = await fetchAllCustomers();
				setClientes(dataClients);
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
	const monto = parseFloat(watch("monto")) || 0;
	const montoRestante = parseFloat(watch("montoRestante")) || 0;


	useEffect(() => { // $ Cargar los remitos de un cliente cuando se selecciones:
		const fetchRemitaForClient = async (clientId) => {
			try {
				const remitosData = await searchAllCustomerRemitos(clientId);
				setRemitos(remitosData)
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

	const renderAlert = () => {
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

	const showAlert = (type, message) => {
		setAlert({ type, message, visible: true });
		setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
	};

	const handleSelectRemito = (id_remito) => {
		const remito = remitos.find((r) => r.id_remito === id_remito);

		if (!remito) return;

		if (!seleccionados.includes(id_remito)) {
			// Agregar el remito a seleccionados
			if (montoRestante < remito.saldo_restante) {
				if (montoRestante > 0) {
					// Pago parcial
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
									nuevoEstado: "Parcial"
								}]);

							return {
								...r,
								saldo_restante,
								estado: "Parcial",
							}
						}
						return r
					}
					);

					setRemitos(remitosActualizados);

					showAlert("success", `Pago parcial de $${pagoParcial.toFixed(2)} aplicado al remito ID: ${id_remito}.`);
				} else {
					showAlert("warning", `No tienes saldo suficiente para pagar el remito ID: ${id_remito}.`);
				}
			} else {
				// Pago completo
				setValue("seleccionados", [...seleccionados, id_remito]);
				setValue("montoRestante", montoRestante - remito.saldo_restante);
				
				setValue("billingRemito", [
					...billingRemito,
					{
						remitoId: id_remito,
						montoDescontad: remito.saldo_restante,
						montoRestante: 0,
						nuevoEstado: "Pagado"
					}]);

				const remitosActualizados = remitos.map((r) =>
					r.id_remito === id_remito ? { ...r, saldo_restante: 0, estado: "Pagado" } : r
				);

				setRemitos(remitosActualizados);
			}
		} else {
			// Quitar el remito de seleccionados y revertir pagos
			setValue("seleccionados", seleccionados.filter((remitoId) => remitoId !== id_remito));

			setValue("billingRemito", billingRemito.filter((remitoData) => remitoData.remitoId !== id_remito));


			if (pagosParciales[id_remito]) {
				// Caso de pago parcial
				const pagoParcial = pagosParciales[id_remito];
				setValue("montoRestante", montoRestante + pagoParcial);

				// Actualizar remito a estado parcial previo
				const remitosActualizados = remitos.map((r) =>
					r.id_remito === id_remito
						? { ...r, saldo_restante: r.saldo_restante + pagoParcial, estado: "Pendiente" }
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
						? { ...r, saldo_restante: r.monto_total, estado: "Pendiente" }
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

	const onSubmit = ({ cliente, monto, billingRemito }) => {
		if (!cliente || monto <= 0) {
			showAlert("warning", "Por favor, complete todos los campos correctamente.");
			return;
		}
		console.log({ cliente, monto, billingRemito })
	};

	return (
		isClientsLoaded && (
			<Dialog open={open} maxWidth="lg" fullWidth>
				<DialogTitle>
					<Typography sx={styles.DialogTitle}>
						Registro Cobranza y Facturación de Remitos
					</Typography>
				</DialogTitle>

				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogContent dividers>
						{/* Selector de cliente */}
						<Box mb={2}>
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
									>
										{clientes.map((cliente) => (
											<MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
												{cliente.nombre_cliente}
											</MenuItem>
										))}
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
									/>

								)}
							/>
						</Box>


						{
							isRemitoLoaded && (
								<Box>
									{/* Tabla de remitos */}
									<TableContainer>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell>Seleccionar</TableCell>
													<TableCell>ID Remito</TableCell>
													<TableCell>Fecha</TableCell>
													<TableCell>Monto Restante</TableCell>
													<TableCell>Monto Total</TableCell>
													<TableCell>Estado</TableCell>
												</TableRow>
											</TableHead>

											<TableBody>
												{remitos.map((remito) => (
													<TableRow key={remito.id_remito}>
														<TableCell>
															<Checkbox
																checked={seleccionados.includes(remito.id_remito)}
																onChange={() => handleSelectRemito(remito.id_remito)}
															/>
														</TableCell>
														<TableCell>{remito.id_remito}</TableCell>
														<TableCell>{remito.fecha_remito}</TableCell>
														<TableCell>${remito.saldo_restante.toFixed(2)}</TableCell>
														<TableCell>${remito.monto_total.toFixed(2)}</TableCell>
														<TableCell>{remito.estado}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>

									{/* Resumen */}
									<Box sx={{ mt: 2 }}>
										<Typography variant="subtitle1">
											Monto restante sin usar: ${montoRestante.toFixed(2)}
										</Typography>
										{renderAlert()}
									</Box>
								</Box>
							)
						}
					</DialogContent>

					<DialogActions>
						<Button onClick={handleModalClosure} color="inherit">
							Cancelar
						</Button>
						<Button type="submit" variant="contained" color="primary">
							Registrar
						</Button>
					</DialogActions>
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