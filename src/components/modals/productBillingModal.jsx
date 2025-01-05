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
import { PurchaseProduct, fetchAllProducts } from "@/services/products.service";
import { fetchAllProveedores } from "@/services/proveedores.service";
import { CreateProductoModal } from "@/components/modals/createProductModal";
import { CreateProveedorModal } from "@/components/modals/createProveedorModal";

// Función auxiliar para calcular el total de productos seleccionados
const calcularTotal = (productos) => {
	return productos.reduce((total, producto) => total + producto.subtotal, 0);
};

// Custom hook para cargar datos iniciales
const useFetchData = () => {
	const [proveedores, setProveedores] = useState([]);
	const [productos, setProductos] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [dataProveedores, dataProducts] = await Promise.all([
					fetchAllProveedores(),
					fetchAllProducts(),
				]);
				setProveedores(dataProveedores);
				setProductos(dataProducts);
				setIsLoaded(true);
			} catch (error) {
				console.error("Error al cargar datos:", error);
			}
		};
		fetchData();
	}, []);

	return { proveedores, setProveedores, productos, setProductos, isLoaded };
};

// Agregar un nuevo ítem a la lista de productos o proveedores
const handleAddingNewItem = (newData, setItemList) => {
	setItemList((prevData) => [...prevData, newData]);
};

export const ProductBillingModal = ({ open, handleClose }) => {
	const { proveedores, setProveedores, productos, setProductos, isLoaded } = useFetchData();
	const { control, handleSubmit, watch, reset, setValue } = useForm({
		defaultValues: {
			proveedor: "",
			producto: "",
			cantidad: 1,
			productosSeleccionados: [],
		},
	});

	const productosSeleccionados = watch("productosSeleccionados");
	const productoActualID = watch("producto");
	const cantidad = parseInt(watch("cantidad"), 10) || 1;

	const [alert, setAlert] = useState({ type: "", message: "", visible: false });
	const [openProveedorModal, setOpenProveedorModal] = useState(false);
	const [openProductModal, setOpenProductModal] = useState(false);

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

	const toggleProductModal = (newProduct = null) => {
		if (newProduct) {
			handleAddingNewItem(newProduct, setProductos);
			setValue("producto", newProduct.id_producto);
		}
		setOpenProductModal(!openProductModal);
	};

	const toggleProveedorModal = (newProveedor = null) => {
		if (newProveedor) {
			handleAddingNewItem(newProveedor, setProveedores);
			setValue("proveedor", newProveedor.id_proveedor);
		}
		setOpenProveedorModal(!openProveedorModal);
	};

	// Agregar producto a la lista de productos seleccionados
	const addProductToList = () => {
		const productoActual = productos.find((producto) => producto.id_producto === productoActualID);

		if (!productoActual || cantidad <= 0) {
			showAlert("warning", "Selecciona un producto válido y una cantidad mayor a 0.");
			return;
		}

		const subtotal = productoActual.precio_venta * cantidad;
		const index = productosSeleccionados.findIndex((p) => p.id_producto === productoActual.id_producto);

		if (index === -1) {
			// Agregar nuevo producto
			setValue("productosSeleccionados", [
				...productosSeleccionados,
				{ ...productoActual, cantidad, subtotal },
			]);
		} else {
			// Actualizar producto existente
			const updatedProductos = [...productosSeleccionados];
			updatedProductos[index] = {
				...updatedProductos[index],
				cantidad: updatedProductos[index].cantidad + cantidad,
				subtotal: (updatedProductos[index].cantidad + cantidad) * productoActual.precio_venta,
			};
			setValue("productosSeleccionados", updatedProductos);
		}

		// Reiniciar campos
		setValue("producto", "");
		setValue("cantidad", 1);
	};

	// Manejo del envío del formulario
	const handleSubmitForm = async ({ proveedor, productosSeleccionados }) => {
		if (!proveedor || productosSeleccionados.length === 0) {
			showAlert("warning", "Debes seleccionar un proveedor y agregar al menos un producto.");
			return;
		}

		const purchaseData = {
			proveedor,
			productosComprados: productosSeleccionados.map(({ id_producto, stock_disponible, cantidad, subtotal }) => ({
				id_producto,
				stockActual: stock_disponible,
				cantidad,
				subtotal,
			})),
			montoDeCompra: calcularTotal(productosSeleccionados),
		};

		try {
			await PurchaseProduct(purchaseData);
			showAlert("success", "La factura se ha creado correctamente.");
			setTimeout(() => {
				reset();
				handleClose();
			}, 3000);
		} catch (error) {
			console.error("Error al guardar factura:", error);
			showAlert("error", "Hubo un problema al crear la factura.");
		}
	};

	return (
		isLoaded && (
			<>
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

							{/* Selector de proveedor */}
							<Box display="flex" gap={1} mb={2}>
								<Controller
									name="proveedor"
									control={control}
									render={({ field }) => (
										<TextField {...field} label="Proveedor" select fullWidth>
											{proveedores.length === 0 ? (
												<MenuItem disabled>
													No hay proveedores disponibles. Crea uno nuevo.
												</MenuItem>
											) : (
												proveedores.map((proveedor) => (
													<MenuItem key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
														{proveedor.nombre_proveedor}
													</MenuItem>
												))
											)}
										</TextField>
									)}
								/>
								<Button variant="contained" color="success" onClick={() => toggleProveedorModal()}>
									+
								</Button>
							</Box>

							{/* Selector de productos */}
							<Box display="flex" gap={1} mb={2}>
								<Controller
									name="producto"
									control={control}
									render={({ field }) => (
										<TextField {...field} label="Producto" select fullWidth>
											{productos.length === 0 ? (
												<MenuItem disabled>
													No hay productos disponibles. Crea uno nuevo.
												</MenuItem>
											) : (
												productos.map((producto) => (
													<MenuItem key={producto.id_producto} value={producto.id_producto}>
														{producto.nombre_producto}
													</MenuItem>
												))
											)}
										</TextField>
									)}
								/>
								<Button variant="contained" color="success" onClick={() => toggleProductModal()}>
									+
								</Button>
							</Box>


							{/* Campo de cantidad y botón para agregar */}
							<Box display="flex" gap={1} mb={2}>
								<Controller
									name="cantidad"
									control={control}
									render={({ field }) => (
										<TextField {...field} label="Cantidad" type="number" fullWidth />
									)}
								/>
								<Button
									variant="contained"
									color="primary"
									onClick={addProductToList}
									disabled={!productoActualID || cantidad <= 0}
								>
									Agregar
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
												<TableCell>Stock Actual</TableCell>
												<TableCell>Precio Unitario</TableCell>
												<TableCell>Subtotal</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{productosSeleccionados.map((producto, index) => (
												<TableRow key={index}>
													<TableCell>{producto.nombre_producto}</TableCell>
													<TableCell>{producto.cantidad}</TableCell>
													<TableCell>{producto.stock_disponible + producto.cantidad}</TableCell>
													<TableCell>{producto.precio_venta.toFixed(2)} gs</TableCell>
													<TableCell>{producto.subtotal.toFixed(2)} gs</TableCell>
												</TableRow>
											))}
											<TableRow>
												<TableCell colSpan={4} align="right">
													<Typography fontWeight="bold">Total</Typography>
												</TableCell>
												<TableCell>{calcularTotal(productosSeleccionados).toFixed(2)} gs</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</TableContainer>
							)}

						</DialogContent>

						{renderAlert()}

						<DialogActions>
							<Button onClick={handleClose} color="inherit">
								Cerrar
							</Button>
							<Button type="submit" variant="contained" color="primary">
								Finalizar Compra
							</Button>
						</DialogActions>
					</form>
				</Dialog>

				{/* Modales */}
				{openProductModal && <CreateProductoModal open={openProductModal} handleClose={toggleProductModal} />}
				{openProveedorModal && <CreateProveedorModal open={openProveedorModal} handleClose={toggleProveedorModal} />}
			</>
		)
	);
};
