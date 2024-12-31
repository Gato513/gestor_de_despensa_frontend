"use client"
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
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Alert,
	AlertTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { PurchaseProduct } from "@/services/products.service";
import { fetchAllProducts } from "@/services/products.service";
import { fetchAllProveedores } from "@/services/proveedores.service";


const calcularTotal = (productos) => {
	return productos.reduce((total, producto) => total + producto.subtotal, 0);
}

// Cargar datos
const useFetchData = () => {
	const [proveedores, setProveedores] = useState([]);
	const [productos, setProductos] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [dataProveedores, dataProducts] = await Promise.all([fetchAllProveedores(), fetchAllProducts()]);
				setProveedores(dataProveedores);
				setProductos(dataProducts);
				setIsLoaded(true);
			} catch (error) {
				console.error("Error al cargar datos:", error);
			}
		};
		fetchData();
	}, []);

	return { proveedores, productos, isLoaded };
};

export const ProductBillingModal = ({ open, handleClose }) => {

	const { proveedores, productos, isLoaded } = useFetchData();

	const { control, handleSubmit, watch, reset, setValue } = useForm({
		defaultValues: {
			proveedor: "",
			producto: "",
			cantidad: 1,
			productosSeleccionados: [],
		},
	});

	const productosSeleccionados = watch("productosSeleccionados");
	const productoActual = watch("producto");
	const cantidad = parseInt(watch("cantidad"));

	const [alert, setAlert] = useState({ type: "", message: "", visible: false });

	// Agregar producto a la lista
	const agregarProducto = () => {
		const productoActualID = watch("producto");

		const productoActual = productos.find(
			(producto) => producto.id_producto === productoActualID
		);

		if (!productoActual || cantidad <= 0) {
			setAlert({
				type: "warning",
				message: "Por favor selecciona un producto válido o una cantidad mayor a 0.",
				visible: true
			});
			setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
			return;
		}

		console.log(productoActual.precio_venta)
		console.log(typeof (productoActual.precio_venta))

		const subtotal = productoActual.precio_venta * cantidad;
		const index = productosSeleccionados.findIndex((p) => p.id_producto === productoActual.id_producto);

		if (index === -1) {
			// Agregar nuevo producto a la lista
			setValue("productosSeleccionados", [
				...productosSeleccionados,
				{ ...productoActual, cantidad, subtotal },
			]);
		} else {
			const updatedProductos = [...productosSeleccionados];
			const productoExistente = updatedProductos[index];

			// Actualizar cantidad y subtotal del producto existente
			productoExistente.cantidad += cantidad;
			productoExistente.subtotal = productoExistente.cantidad * productoActual.precio_venta;
			setValue("productosSeleccionados", updatedProductos);
		}

		// Reiniciar campos
		setValue("producto", "");
		setValue("cantidad", 1);
	};

	// Envío del formulario
	const handleSubmitForm = async ({ cantidad, proveedor, productosSeleccionados }) => {

		const purchaseData = {
			proveedor,
			productosComprados: productosSeleccionados.map(({ id_producto, cantidad, subtotal }) => {
				return { id_producto, cantidad, subtotal }
			}),
			montoDeCompra: calcularTotal(productosSeleccionados)
		};

		try {
			await PurchaseProduct(purchaseData);

			setAlert({ type: "success", message: "La factura se ha creado correctamente.", visible: true });
			setTimeout(() => {
				setAlert({ type: "", message: "", visible: false });
				reset();
				handleClose();
			}, 3000);
		} catch (error) {
			console.error("Error al guardar remito:", error);
			setAlert({ type: "error", message: "Hubo un problema al crear la factura.", visible: true });
			setTimeout(() => setAlert({ type: "", visible: false }), 3000);
		}
	};

	return (
		isLoaded && (
			<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
				<DialogTitle>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="h6">Compra de Productos</Typography>
						<IconButton onClick={handleClose}>
							<CloseIcon />
						</IconButton>
					</Box>
				</DialogTitle>
				<form id="facturacion-form" onSubmit={handleSubmit(handleSubmitForm)}>
					<DialogContent dividers>

						<Box sx={{ p: 2 }}>
							{/* Selector de proveedor */}
							<Box mb={2}>
								<Controller
									name="proveedor"
									control={control}
									render={({ field }) => (
										<TextField {...field} label="Proveedor" select fullWidth>
											{proveedores.map((proveedor) => (
												<MenuItem
													key={proveedor.id_proveedor}
													value={proveedor.id_proveedor}
												>
													{proveedor.nombre_proveedor}
												</MenuItem>
											))}
										</TextField>
									)}
								/>
							</Box>

							{/* Selector de productos */}
							<Box display="flex" gap={2} flexWrap="wrap" mb={2}>
								<Controller
									name="producto"
									control={control}
									render={({ field }) => (
										<TextField {...field} label="Producto" select fullWidth>
											{productos.map((producto) => (
												<MenuItem
													key={producto.id_producto}
													value={producto.id_producto}
												>
													{producto.nombre_producto}
												</MenuItem>
											))}
										</TextField>
									)}
								/>

								{productoActual && (
									<Controller
										name="cantidad"
										control={control}
										render={({ field }) => (
											<TextField
												{...field}
												label="Cantidad"
												type="number"
												fullWidth
												inputProps={{ min: 1 }}
											/>
										)}
									/>
								)}

								<Button
									variant="contained"
									color="primary"
									onClick={agregarProducto}
									disabled={!productoActual || cantidad <= 0}
								>
									Agregar Producto
								</Button>
							</Box>

							{/* Tabla de productos seleccionados */}
							{productosSeleccionados.length > 0 && (
								<TableContainer component={Paper}>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Producto</TableCell>
												<TableCell>Cantidad</TableCell>
												<TableCell>Precio Unitario</TableCell>
												<TableCell>Subtotal</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{productosSeleccionados.map((producto, index) => (
												<TableRow key={index}>
													<TableCell>{producto.nombre_producto}</TableCell>
													<TableCell>{producto.cantidad}</TableCell>
													<TableCell>{producto.precio_venta.toFixed(2)}gs</TableCell>
													<TableCell>{producto.subtotal.toFixed(2)}gs</TableCell>
												</TableRow>
											))}
											<TableRow>
												<TableCell colSpan={3} align="right">
													<Typography fontWeight="bold">Total</Typography>
												</TableCell>
												<TableCell>
													${calcularTotal(productosSeleccionados).toFixed(2)}
												</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</Box>

					</DialogContent>

					<DialogActions>

						<Button onClick={handleClose} color="inherit">
							Cerrar
						</Button>

						<Button form="facturacion-form" type="submit" variant="contained" color="primary">
							Finalizar Compra
						</Button>

					</DialogActions>
				</form>

				{/* Alertas */}
				{alert.visible && (
					<Alert severity={alert.type}>
						<AlertTitle sx={{ fontWeight: 600 }}>{alert.type === "success" ? "Éxito" : "Error"}</AlertTitle>
						{
							alert.message
						}


					</Alert>
				)}
			</Dialog>
		)
	);
};