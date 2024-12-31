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
	MenuItem,
	Grid,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	Alert,
	AlertTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { createRemito } from "@/services/remitos.service";
import { fetchAllCustomers } from "@/services/customers.service";
import { fetchAllProducts } from "@/services/products.service";

const stockCalculation = (stock_disponible, cantidad) => stock_disponible - cantidad;

// Componente: ProductoSeleccionado
const ProductoSeleccionado = ({ producto, cantidad, agregarProducto }) => {

	const stockActual = stockCalculation(producto.stock_disponible, cantidad);

	return (
		<Box sx={{ border: "1px solid #E0E0E0", p: 2, borderRadius: "8px", mb: 2 }}>

			<Typography sx={{ fontWeight: 600, color: "#7055F5" }}>
				Información del Producto Seleccionado
			</Typography>

			<Divider sx={{ my: 2 }} />

			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Box sx={{ display: "flex", gap: 2 }}>

						<Typography>
							Producto: {producto.nombre_producto}
						</Typography>

						<Typography>
							Precio Unitario: {producto.precio_venta.toFixed(2)} gs
						</Typography>

						<Typography>
							Stock Disponible: {stockActual >= 0 ? stockActual : 0}
						</Typography>

					</Box>
					<Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={agregarProducto}>
						Agregar Producto
					</Button>
				</Grid>
			</Grid>
		</Box>
	)
};

// Componente: ResumenProductos
const ResumenProductos = ({ productos, calcularTotal }) => (
	<Box sx={{ border: "1px solid #E0E0E0", p: 2, borderRadius: "8px", mb: 2 }}>
		<Typography sx={{ fontWeight: 600, color: "#7055F5" }}>Resumen de Productos</Typography>
		<Divider sx={{ my: 2 }} />
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Producto</TableCell>
						<TableCell>Cantidad</TableCell>
						<TableCell>Subtotal</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{productos.map((producto, index) => (
						<TableRow key={index}>
							<TableCell>{producto.nombre_producto}</TableCell>
							<TableCell>{producto.cantidad}</TableCell>
							<TableCell>${producto.subtotal.toFixed(2)}</TableCell>
						</TableRow>
					))}
					<TableRow>
						<TableCell colSpan={2} align="right">
							<Typography sx={{ fontWeight: 600 }}>Total</Typography>
						</TableCell>
						<TableCell>
							<Typography sx={{ fontWeight: 600 }}>${calcularTotal().toFixed(2)}</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	</Box>
);

// Utilidad: Cargar datos
const useFetchData = () => {
	const [clientes, setClientes] = useState([]);
	const [productos, setProductos] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [dataClients, dataProducts] = await Promise.all([fetchAllCustomers(), fetchAllProducts()]);
				setClientes(dataClients);
				setProductos(dataProducts);
				setIsLoaded(true);
			} catch (error) {
				console.error("Error al cargar datos:", error);
			}
		};
		fetchData();
	}, []);

	return { clientes, productos, setProductos, isLoaded };
};

// Componente principal: CreateRemitoModal
export const CreateRemitoModal = ({ open, handleClose }) => {
	const { control, handleSubmit, reset } = useForm();
	const { clientes, productos, setProductos, isLoaded } = useFetchData();
	const [productosSeleccionados, setProductosSeleccionados] = useState([]);
	const [productoActual, setProductoActual] = useState(null);
	const [cantidad, setCantidad] = useState(0);

	const [alert, setAlert] = useState({ type: "", message: "", visible: false });

	// Lógica: Agregar producto
	const agregarProducto = () => {
		if (!productoActual || cantidad <= 0) {
			setAlert({
				type: "error",
				message: "Selecciona un producto válido y una cantidad mayor a 0.",
				visible: true,
			});
			resetAlert();
			return;
		}

		const indexProducto = productos.findIndex((p) => p.id_producto === productoActual.id_producto);

		if (indexProducto === -1 || cantidad > productos[indexProducto].stock_disponible) {
			setAlert({
				type: "warning",
				message: `Stock insuficiente para "${productoActual.nombre_producto}". Disponible: ${productos[indexProducto]?.stock_disponible || 0} unidades.`,
				visible: true,
			});
			resetAlert();
			return;
		}

		const subtotal = productoActual.precio_venta * cantidad;
		const productoExistenteIndex = productosSeleccionados.findIndex((p) => p.id_producto === productoActual.id_producto);

		if (productoExistenteIndex === -1) {
			setProductosSeleccionados((prev) => [...prev, { ...productoActual, cantidad, subtotal }]);
		} else {
			const updatedProductos = [...productosSeleccionados];
			updatedProductos[productoExistenteIndex].cantidad += cantidad;
			updatedProductos[productoExistenteIndex].subtotal = updatedProductos[productoExistenteIndex].cantidad * productoActual.precio_venta;
			setProductosSeleccionados(updatedProductos);
		}

		const updatedProductos = [...productos];
		updatedProductos[indexProducto].stock_disponible -= cantidad;
		setProductos(updatedProductos);

		setProductoActual(null);
		setCantidad(0);
	};

	// Lógica: Calcular total
	const calcularTotal = () => productosSeleccionados.reduce((total, p) => total + p.subtotal, 0);

	// Enviar formulario
	const handleSubmitForm = async ({ cliente }) => {
		const remitoData = {
			clientId: cliente,
			productosVendidos: productosSeleccionados.map(({ id_producto, cantidad, subtotal }) => ({
				id: id_producto,
				cantidad,
				subtotal,
			})),
			montoTotal: calcularTotal(),
		};

		try {
			await createRemito(remitoData);
			setAlert({ visible: true, type: "success", message: "El remito ha sido creado correctamente." });
			resetModal();
			resetAlert()
		} catch (error) {
			console.error("Error al crear remito:", error);
			setAlert({ visible: true, type: "error", message: "Hubo un error al crear el remito." });
			resetModal();
			resetAlert()
		}
	};

	// Resetear Alertas:
	const resetAlert = () => {
		setTimeout(() => setAlert({ visible: false, type: "", message: "" }), 3000);
	}

	// Resetear modal
	const resetModal = () => {
		setProductoActual(null);
		setCantidad(0);
		setProductosSeleccionados([]);
		reset();
	};

	const handleModalClosure = () => {
		resetModal()
		handleClose()
	}

	return (
		<Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
			<DialogTitle sx={{ m: 0, p: 2 }}>
				<Box display="flex" alignItems="center" gap={1}>
					<Image src="/assets/referir.png" alt="Nuevo Remito" width={24} height={24} />
					<Typography variant="h6">Formulario de Creación de Remitos</Typography>
				</Box>
				<IconButton aria-label="close" onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<form id="remito-form" onSubmit={handleSubmit(handleSubmitForm)}>
				<DialogContent dividers>
					{isLoaded && (
						<Box sx={{ p: 2 }}>
							{/* Sección: Datos del remito */}
							<Box sx={{ border: "1px solid #E0E0E0", p: 2, borderRadius: "8px", mb: 2 }}>
								<Typography sx={{ fontWeight: 600, color: "#7055F5" }}>Datos del Remito</Typography>
								<Divider sx={{ my: 2 }} />
								<Grid container spacing={2}>
									<Grid item xs={4}>
										<Controller
											name="cliente"
											control={control}
											defaultValue=""
											rules={{ required: "El cliente es obligatorio." }}
											render={({ field, fieldState: { error } }) => (
												<TextField
													label="Cliente"
													select
													fullWidth
													{...field}
													error={!!error}
													helperText={error?.message}
												>
													{clientes.map((c) => (
														<MenuItem key={c.id_cliente} value={c.id_cliente}>
															{c.nombre_cliente}
														</MenuItem>
													))}
												</TextField>
											)}
										/>
									</Grid>
									<Grid item xs={4}>
										<TextField
											label="Seleccionar Producto"
											select
											fullWidth
											value={productoActual?.id_producto || ""}
											onChange={(e) => {
												const prod = productos.find((p) => p.id_producto === +e.target.value);
												setProductoActual({ ...prod, precio_venta: Number(prod.precio_venta) || 0 });
											}}
										>
											{productos.map((p) => (
												<MenuItem key={p.id_producto} value={p.id_producto}>
													{p.nombre_producto}
												</MenuItem>
											))}
										</TextField>
									</Grid>
									{productoActual && (
										<Grid item xs={4}>
											<TextField
												label="Cantidad"
												type="number"
												fullWidth
												value={cantidad}
												onChange={(e) => setCantidad(Math.max(1, +e.target.value || 1))}
											/>
										</Grid>
									)}
								</Grid>
							</Box>
							{/* Sección: Producto seleccionado */}
							{productoActual && (
								<ProductoSeleccionado
									producto={productoActual}
									cantidad={cantidad}
									agregarProducto={agregarProducto}
								/>
							)}
							{alert.visible && (
								<Alert severity={alert.type} sx={{ mb: 2 }}>
									<AlertTitle sx={{ fontWeight: 600 }}>{alert.type === "success" ? "Éxito" : "Error"}</AlertTitle>
									{alert.message}
								</Alert>
							)}
							{/* Sección: Resumen productos */}
							{productosSeleccionados.length > 0 && (
								<ResumenProductos productos={productosSeleccionados} calcularTotal={calcularTotal} />
							)}
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleModalClosure} color="inherit" sx={{ fontWeight: 600 }}>
						Cerrar
					</Button>
					<Button type="submit" variant="contained" sx={{ backgroundColor: "#5a3fd1", color: "white" }}>
						Generar Remito
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};
