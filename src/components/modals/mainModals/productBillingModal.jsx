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
	Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useForm, Controller } from "react-hook-form";
import { fetchAllProducts } from "@/services/products.service";
import { PurchaseProduct } from "@/services/transactions.service";
import { fetchAllProveedores } from "@/services/proveedores.service";
import { CreateProductoModal } from "@/components/modals/mainModals/createProductModal";
import { CreateProveedorModal } from "@/components/modals/mainModals/createProveedorModal";
import generateKey from "@/util/generateKey";
import { FacturationGenerateModal } from "@/components/informes/facturationGenerateModal";

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

// Componentes auxiliares:
const RenderLossWarning = ({ precioCompra, precioVenta }) => {
	if (precioVenta >= precioCompra) return null;

	return (
		<Box mb={2} mt={2} p={1} border="1px solid red" borderRadius="8px" bgcolor="#ffe6e6">
			<Typography variant="h6" color="error">
				Advertencia: Precio de Venta inferior al Precio de Compra
			</Typography>

			<Typography variant="body1">
				Esto genera una pérdida de{" "}
				<strong>
					{`${(precioCompra - precioVenta).toFixed(0)} gs`}
				</strong>. Por favor, revisa los precios para evitar pérdidas económicas.
			</Typography>
		</Box>
	);
};

const TablaProductosSeleccionados = ({ productosSeleccionados, calcularTotal, deleteListItem }) => {
	if (productosSeleccionados.length === 0) {
		return null; // Si no hay productos seleccionados, no se muestra nada
	}

	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Accion</TableCell>
						<TableCell>Producto</TableCell>
						<TableCell>Cantidad</TableCell>
						<TableCell>Stock Actual</TableCell>
						<TableCell>Precio Unitario</TableCell>
						<TableCell>Subtotal</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{productosSeleccionados.map((producto, index) => (
						<TableRow key={generateKey(index)}>
							<TableCell>
								<Tooltip title={"Eliminar"}>
									<IconButton color={"error"} onClick={() => deleteListItem(producto.id_producto)}>
										<DeleteIcon />
									</IconButton>
								</Tooltip>
							</TableCell>
							<TableCell>{producto.nombre_producto}</TableCell>
							<TableCell>{producto.cantidad}</TableCell>
							<TableCell>{producto.stock_disponible + producto.cantidad}</TableCell>
							<TableCell>{producto.precio_compra.toFixed(0)} gs</TableCell>
							<TableCell>{producto.subtotal.toFixed(0)} gs</TableCell>
						</TableRow>
					))}
					<TableRow>
						<TableCell colSpan={5} align="right">
							<Typography sx={{ fontWeight: 1000 }}>Total:</Typography>
						</TableCell>
						<TableCell>
							<Typography sx={{ fontWeight: 1000 }}>{calcularTotal(productosSeleccionados).toFixed(0)} gs</Typography>
						</TableCell>
					</TableRow>

				</TableBody>
			</Table>
		</TableContainer>
	);
};

const renderAlert = (alert) => {
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

export const ProductBillingModal = ({ open, handleClose }) => {
	const { proveedores, setProveedores, productos, setProductos, isLoaded } = useFetchData();
	const { control, handleSubmit, watch, reset, setValue } = useForm({
		defaultValues: {
			proveedor: "",
			producto: "",
			precioVenta: "",
			precioCompra: "",
			cantidad: 1,
			productosSeleccionados: [],
		},
	});

	const productosSeleccionados = watch("productosSeleccionados");
	const productoActualID = watch("producto");
	const cantidad = parseInt(watch("cantidad"), 10) || 1;

	const precioVenta = parseInt(watch("precioVenta"));
	const precioCompra = parseInt(watch("precioCompra"));

	const [alert, setAlert] = useState({ type: "", message: "", visible: false });
	const [editable, setEditable] = useState(false);

	const [openProveedorModal, setOpenProveedorModal] = useState(false);
	const [openProductModal, setOpenProductModal] = useState(false);
	const [openGenerateFactura, setOpenGenerateFactura] = useState(false);

	const [newFacturaId, setNewFacturaId] = useState(null);

	useEffect(() => {
		if (!productoActualID) return;

		const productoActual = productos.find((producto) => producto.id_producto === productoActualID);

		const { precio_venta, precio_compra } = productoActual;

		setValue("precioCompra", precio_compra);
		setValue("precioVenta", precio_venta);
	}, [productoActualID])

	// Mostrar alerta con un tiempo de expiración
	const showAlert = (type, message) => {
		setAlert({ type, message, visible: true });
		setTimeout(() => setAlert({ type: "", message: "", visible: false }), 3000);
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

	const toggleFacturaModal = () => {
		setOpenGenerateFactura(!openGenerateFactura)
		handleClose()
		// Refrescar la página
		window.location.reload();
	};

	// Agregar producto a la lista de productos seleccionados
	const addProductToList = () => {
		const productoActual = productos.find((producto) => producto.id_producto === productoActualID);

		// Validar producto y cantidad
		if (!productoActual || cantidad <= 0) {
			showAlert("warning", "Selecciona un producto válido y una cantidad mayor a 0.");
			return;
		}

		// Calcular subtotal
		const subtotal = precioCompra * cantidad;

		// Actualizar lista de productos seleccionados
		const updatedProductosSeleccionados = productosSeleccionados.map((producto) =>
			producto.id_producto === productoActual.id_producto
				? {
					...producto,
					cantidad: producto.cantidad + cantidad,
					subtotal: (producto.cantidad + cantidad) * precioCompra,
				}
				: producto
		);

		// Si el producto no está en la lista, agregarlo
		const isProductoNuevo = !productosSeleccionados.some(
			(producto) => producto.id_producto === productoActual.id_producto
		);

		if (isProductoNuevo) {
			updatedProductosSeleccionados.push({
				...productoActual,
				precio_compra: precioCompra,
				precio_venta: precioVenta,
				cantidad,
				subtotal,
			});
		}

		// Actualizar estado de productos seleccionados
		setValue("productosSeleccionados", updatedProductosSeleccionados);

		// Actualizar detalles del producto en la lista principal de productos
		const updatedProductos = productos.map((producto) =>
			producto.id_producto === productoActualID
				? { ...producto, precio_venta: precioVenta, precio_compra: precioCompra }
				: producto
		);
		setProductos(updatedProductos);

		// Reiniciar campos
		setValue("producto", "");
		setValue("cantidad", 1);
		setEditable(false);
	};

	const deleteListItem = (idElement) => {
		// Filtrar el producto a eliminar de la lista de productos seleccionados
		const updatedProductosSeleccionados = productosSeleccionados.filter(
			(producto) => producto.id_producto !== idElement
		);
		// Actualizar el estado del formulario con la nueva lista
		setValue("productosSeleccionados", updatedProductosSeleccionados);
	};

	// Manejo del envío del formulario
	const handleSubmitForm = async ({ proveedor, productosSeleccionados }) => {
		if (!proveedor || productosSeleccionados.length === 0) {
			showAlert("warning", "Debes seleccionar un proveedor y agregar al menos un producto.");
			return;
		}

		const purchaseData = {
			proveedorId: proveedor,
			productosComprados: productosSeleccionados.map(({ id_producto, stock_disponible, precio_compra, precio_venta, cantidad, subtotal }) => ({
				id_producto,
				stockActual: stock_disponible,
				precio_compra,
				precio_venta,
				cantidad,
				subtotal,
			})),
			montoDeCompra: calcularTotal(productosSeleccionados),
		};

		try {
			const facturaId = await PurchaseProduct(purchaseData);
			setNewFacturaId(facturaId);
			setOpenGenerateFactura(true);
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

	const handleModalClosure = () => {
		reset();
		setEditable(false);
		handleClose();
	}

	return (
		isLoaded && (
			<>
				<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
					<DialogTitle>
						<Box display="flex" justifyContent="space-between" alignItems="center">
							<Typography variant="h6">Compra de Productos</Typography>
							<IconButton onClick={handleModalClosure}>
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
													<MenuItem key={generateKey(proveedor.id_proveedor)} value={proveedor.id_proveedor}>
														{proveedor.nombre_proveedor}
													</MenuItem>
												))
											)}
										</TextField>
									)}
								/>
								<Button variant="contained" color="success" onClick={() => toggleProveedorModal()}>
									<AddIcon />
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
													<MenuItem key={generateKey(producto.id_producto)} value={producto.id_producto}>
														{producto.nombre_producto}
													</MenuItem>
												))
											)}
										</TextField>
									)}
								/>
								<Button variant="contained" color="success" onClick={() => toggleProductModal()}>
									<AddIcon />
								</Button>
							</Box>

							{/* precio venta, precio venta y Campo de cantidad */}
							{productoActualID && (
								<>
									<Box display={"flex"} gap={1}>
										<Box flex={1}>
											<Box mb={2}>
												<Controller
													name="precioCompra"
													control={control}
													rules={{
														required: "El precio de compra es obligatorio.",
														min: { value: 0, message: "El precio debe ser mayor o igual a 0." },
													}}
													render={({ field, fieldState }) => (
														<TextField
															{...field}
															label="Precio de Compra"
															type="number"
															fullWidth
															inputProps={{ min: 0, step: 1 }}
															error={!!fieldState.error}
															helperText={fieldState.error?.message}
															disabled={!editable} // Bloqueado si no está en modo editable
														/>
													)}
												/>

											</Box>

											<Box>
												<Controller
													name="precioVenta"
													control={control}
													rules={{
														required: "El precio de venta es obligatorio.",
														min: { value: 0, message: "El precio debe ser mayor o igual a 0." },
													}}
													render={({ field, fieldState }) => (
														<TextField
															{...field}
															label="Precio de Venta"
															type="number"
															fullWidth
															inputProps={{ min: 0, step: 1 }}
															error={!!fieldState.error}
															helperText={fieldState.error?.message}
															disabled={!editable} // Bloqueado si no está en modo editable
														/>
													)}
												/>
											</Box>
										</Box>

										<Button
											variant="contained"
											color={editable ? "secondary" : "warning"}
											onClick={() => setEditable(!editable)}
										>
											{editable ? <SaveIcon /> : <EditIcon />}
										</Button>
									</Box>

									{<RenderLossWarning precioCompra={precioCompra} precioVenta={precioVenta} />}

									<Box display="flex" gap={1} mb={2} mt={2}>
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
											<AddShoppingCartIcon />
										</Button>
									</Box>
								</>
							)}

							{/* Tabla de productos seleccionados */}
							<TablaProductosSeleccionados productosSeleccionados={productosSeleccionados} calcularTotal={calcularTotal} deleteListItem={deleteListItem} />

						</DialogContent>

						{renderAlert(alert)}

						<DialogActions>
							<Button onClick={handleModalClosure} color="inherit">
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

				{
					openGenerateFactura && (
						<FacturationGenerateModal
							open={openGenerateFactura}
							handleClose={toggleFacturaModal}
							targetId={newFacturaId}
							facturaType={"compra"}
						/>
					)
				}
			</>
		)
	);
};
