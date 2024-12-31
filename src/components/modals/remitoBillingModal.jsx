import { useState, useEffect } from "react";
import {
	Modal,
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Checkbox,
	Button,
	Alert,
} from "@mui/material";

// Datos ficticios como ejemplo (en producción, se cargan desde la base de datos)
const remitosFicticios = [
	{ id: 1, fecha: "2024-01-01", montoRestante: 100, montoTotal: 100, estado: "Pendiente" },
	{ id: 2, fecha: "2024-01-05", montoRestante: 10, montoTotal: 10, estado: "Pendiente" },
	{ id: 3, fecha: "2024-01-10", montoRestante: 100, montoTotal: 100, estado: "Pendiente" },
	{ id: 4, fecha: "2024-01-11", montoRestante: 100, montoTotal: 100, estado: "Pendiente" },
];

export const RemitoBillingModal = ({ open, handleClose, cliente, montoAbonado }) => {
	const [remitos, setRemitos] = useState([]);
	const [seleccionados, setSeleccionados] = useState([]);
	const [alerta, setAlerta] = useState("");
	const [montoRestante, setMontoRestante] = useState(montoAbonado);
	const [pagosParciales, setPagosParciales] = useState({});

	// Carga inicial de los remitos del cliente
	useEffect(() => {
		if (cliente) {
			const remitosCliente = remitosFicticios
				.filter((remito) => remito.estado === "Pendiente")
				.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Orden FIFO
			setRemitos(remitosCliente);
			setMontoRestante(montoAbonado); // Reinicia el monto disponible
			setSeleccionados([]); // Reinicia los seleccionados
			setPagosParciales({}); // Limpia los pagos parciales
			setAlerta(""); // Limpia cualquier alerta previa
		}
	}, [cliente?.id, montoAbonado]);

	// Manejo de selección de remitos
	const handleSelectRemito = (id) => {
		const remito = remitos.find((r) => r.id === id);

		if (!remito) return;

		if (!seleccionados.includes(id)) {
			// Si no hay suficiente saldo, aplica pago parcial
			if (montoRestante < remito.montoRestante) {
				if (montoRestante > 0) {
					// Realiza el pago parcial
					setSeleccionados([...seleccionados, id]);
					const pagoParcial = montoRestante;
					setMontoRestante(0); // Se consume todo el saldo disponible
					setPagosParciales({ ...pagosParciales, [id]: pagoParcial });
					const remitosActualizados = remitos.map((r) =>
						r.id === id
							? {
									...r,
									montoRestante: r.montoRestante - pagoParcial,
									estado: "Parcial",
							}
							: r
					);
					setRemitos(remitosActualizados);
					setAlerta(
						`Pago parcial de $${pagoParcial.toFixed(2)} aplicado al remito ID: ${id}.`
					);
				} else {
					setAlerta(`No tienes saldo suficiente para pagar el remito ID: ${id}.`);
				}
			} else {
				// Si hay saldo suficiente, paga completo
				setSeleccionados([...seleccionados, id]);
				setMontoRestante(montoRestante - remito.montoRestante);
			}
		} else {
			// Quitar de seleccionados y revertir pagos
			setSeleccionados(seleccionados.filter((remitoId) => remitoId !== id));

			setMontoRestante((previousValue) => {
				return remito.estado === "Parcial"
					? montoRestante + remito.montoTotal - remito.montoRestante
					: montoRestante + remito.montoTotal;
			});

			const remitosActualizados = remitos.map((r) =>
				r.id === id ? { ...r, montoRestante: r.montoTotal, estado: "Pendiente" } : r
			);

			setRemitos(remitosActualizados);
			setAlerta("");
		}
	};

	// Procesar pagos según la estrategia FIFO
	const procesarFacturacion = () => {
		let montoDisponible = montoAbonado;

		const remitosActualizados = remitos.map((remito) => {
			if (!seleccionados.includes(remito.id)) return remito;

			const pagoParcial = pagosParciales[remito.id] || 0;

			if (pagoParcial > 0) {
				const restante = remito.montoRestante - pagoParcial;
				montoDisponible -= pagoParcial;
				return {
					...remito,
					montoRestante: restante,
					estado: restante > 0 ? "Parcial" : "Pagado",
				};
			}

			if (montoDisponible >= remito.montoRestante) {
				// Pago completo
				montoDisponible -= remito.montoRestante;
				return { ...remito, montoRestante: 0, estado: "Pagado" };
			} else if (montoDisponible > 0) {
				// Pago parcial
				const pagoParcial = montoDisponible;
				const restante = remito.montoRestante - pagoParcial;
				montoDisponible = 0;
				return { ...remito, montoRestante: restante, estado: "Parcial" };
			}
			return remito;
		});

		// Actualizar estado
		setRemitos(remitosActualizados);
		setSeleccionados([]);
		setMontoRestante(montoDisponible);
		setAlerta(
			`Facturación completada. Monto restante sin usar: $${montoDisponible.toFixed(2)}`
		);
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: 800,
					bgcolor: "background.paper",
					borderRadius: 2,
					boxShadow: 24,
					p: 4,
				}}
			>
				<Typography variant="h6" sx={{ mb: 2 }}>
					Facturación de Remitos
				</Typography>

				<Typography variant="subtitle1" sx={{ mb: 1 }}>
					Cliente: {cliente?.nombre || "No especificado"}
				</Typography>

				<Typography variant="subtitle1" sx={{ mb: 3 }}>
					Monto abonado: ${montoAbonado.toFixed(2)}
				</Typography>

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
								<TableRow key={remito.id}>
									<TableCell>
										<Checkbox
											checked={seleccionados.includes(remito.id)}
											onChange={() => handleSelectRemito(remito.id)}
										/>
									</TableCell>
									<TableCell>{remito.id}</TableCell>
									<TableCell>{remito.fecha}</TableCell>
									<TableCell>${remito.montoRestante.toFixed(2)}</TableCell>
									<TableCell>${remito.montoTotal.toFixed(2)}</TableCell>
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
					{alerta && (
						<Alert severity="warning" sx={{ mt: 2 }}>
							{alerta}
						</Alert>
					)}
				</Box>

				{/* Botones */}
				<Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
					<Button variant="contained" color="error" onClick={handleClose}>
						Cancelar
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={procesarFacturacion}
						disabled={seleccionados.length === 0}
					>
						Facturar
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};
