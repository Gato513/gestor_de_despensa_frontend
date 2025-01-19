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
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { createRemito } from "@/services/remitos.service";
import { fetchAllCustomers } from "@/services/customers.service";
import { fetchAllProducts } from "@/services/products.service";
import { CreateCustomerModal } from "./customerModal";
import generateKey from "@/util/generateKey";

// Funciónes para calcular el total y el stock de productos seleccionados:
const calculateStock = (available, quantity) => available - quantity;
const calcularTotal = (productos) => productos.reduce((total, producto) => total + producto.subtotal, 0);

// Filtrar el objeto producto que esta seleccionado actualmente:
const getCurrentProduct = (productos, productoActualID) => productos.find((producto) => producto.id_producto === productoActualID)

// Componentes auxiliares:
const ProductoSeleccionado = ({ producto, cantidad, addProductToList }) => {
	const stockActual = calculateStock(producto.stock_disponible, cantidad);

	return (
		<Box sx={{ border: "1px solid #E0E0E0", p: 2, borderRadius: "8px", mb: 2 }}>
			<Typography sx={{ fontWeight: 600, color: "#7055F5" }}>
				Información del Producto Seleccionado
			</Typography>
			<Divider sx={{ my: 2 }} />

			<Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
				<Typography>Producto: {producto.nombre_producto}</Typography>
				<Typography>Precio: {producto.precio_venta.toFixed(2)} gs</Typography>
				<Typography>Stock Disponible: {Math.max(stockActual, 0)}</Typography>
			</Box>

		</Box>
	);
};

const ResumenProductos = ({ productos, montoTotal }) => (
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
						<TableRow key={generateKey(index)}>
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
							<Typography sx={{ fontWeight: 600 }}>${montoTotal.toFixed(2)}</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	</Box>
);

// Custom hook para cargar datos iniciales
const useFetchData = () => {
	const [clientes, setClientes] = useState([]);
	const [productos, setProductos] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [dataClients, dataProducts] = await Promise.all(
					[
						fetchAllCustomers(),
						fetchAllProducts("readyProducts") //! readyProducts trae los productos listos para la venta evitando los que no tienen STOCK.
					]
				);
				setClientes(dataClients);
				setProductos(dataProducts);
				setIsLoaded(true);
			} catch (error) {
				console.error("Error al cargar datos:", error);
			}
		};
		fetchData();
	}, []);

	return { clientes, setClientes, productos, setProductos, isLoaded };
};

// Agregar un nuevo ítem a la lista de clientes:
const handleAddingNewItem = (newData, setItemList) => {
	setItemList((prevData) => [...prevData, newData]);
};

export const CreateRemitoModal = ({ open, handleClose }) => {

	const { control, handleSubmit, watch, reset, setValue } = useForm({
		defaultValues: {
			cliente: "",
			producto: "",
			cantidad: 1,
			productosSeleccionados: [],
		},
	});

	const productosSeleccionados = watch("productosSeleccionados");
	const productoActualID = watch("producto");
	const cantidad = parseInt(watch("cantidad"), 10) || 1;

	const { clientes, setClientes, productos, setProductos, isLoaded } = useFetchData();
	const [alert, setAlert] = useState({ type: "", message: "", visible: false });
	const [openClientModal, setOpenClientModal] = useState(false);

	// Mostrar alerta con un tiempo de expiración
	const showAlert = (type, message) => {
		setAlert({ type, message, visible: true });
		setTimeout(() => {
			setAlert({ type: "", message: "", visible: false });
		}, 3000);
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

	const toggleClientModal = (newClient = null) => {
		if (newClient) {
			handleAddingNewItem(newClient, setClientes);
			setValue("cliente", newClient.id_cliente);
		}
		setOpenClientModal(!openClientModal);
	};

	const addProductToList = () => {
		const productoActual = getCurrentProduct(productos, productoActualID);
		const { stock_disponible, precio_venta } = productoActual;

		if (!productoActual || cantidad <= 0) {
			showAlert("error", "Selecciona un producto válido y una cantidad mayor a 0.");
			return;
		}

		const productIndexInOriginalList = productos.findIndex((p) => p.id_producto === productoActualID);

		if (productIndexInOriginalList === -1 || cantidad > stock_disponible) {
			showAlert(
				"warning",
				`Stock insuficiente para "${productoActual.nombre_producto}". Disponible: ${productos[productIndexInOriginalList]?.stock_disponible || 0} unidades.`
			);
			return;
		}

		const subtotal = productoActual.precio_venta * cantidad;
		const existingProductIndex = productosSeleccionados.findIndex((p) => p.id_producto === productoActualID);

		if (existingProductIndex === -1) { // Agregar nuevo producto
			setValue("productosSeleccionados", [
				...productosSeleccionados,
				{ ...productoActual, cantidad, subtotal },
			]);
		} else { // Actualizar producto existente

			const updateSelectedProducts = [...productosSeleccionados];

			updateSelectedProducts[existingProductIndex] = {
				...updateSelectedProducts[existingProductIndex],
				cantidad: updateSelectedProducts[existingProductIndex].cantidad + cantidad,
				subtotal: (updateSelectedProducts[existingProductIndex].cantidad + cantidad) * precio_venta,
			};
			setValue("productosSeleccionados", updateSelectedProducts);
		}

		const updateOriginalProductList = [...productos];
		updateOriginalProductList[productIndexInOriginalList].stock_disponible -= cantidad;
		setProductos(updateOriginalProductList);

		// Reiniciar campos
		setValue("producto", "");
		setValue("cantidad", 1);
	};

	const handleModalClosure = () => {
		reset();
		handleClose();
	}

	const handleSubmitForm = async ({ cliente, productosSeleccionados }) => {
		if (!cliente || productosSeleccionados.length === 0) {
			showAlert("warning", "Debes seleccionar un Cliente y agregar al menos un producto.");
			return;
		}

		const remitoData = {
			clientId: cliente,
			productosVendidos: productosSeleccionados.map(({ id_producto, cantidad, subtotal, stock_disponible }) => ({
				productId: id_producto,
				cantidad,
				subtotal,
				stockActual: stock_disponible
			})),
			montoTotal: calcularTotal(productosSeleccionados),
		};

		try {
			await createRemito(remitoData);
			showAlert("success", "El remito ha sido creado correctamente.");
			reset();

		} catch (error) {
			console.error("Error al crear remito:", error);
			showAlert("error", "Hubo un error al crear el remito.");
		}
	};

	return isLoaded && (
		<>
			<Dialog open={open} maxWidth="md" fullWidth>
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
						<Box sx={{ p: 2 }}>
							<Box sx={{ border: "1px solid #E0E0E0", p: 2, borderRadius: "8px", mb: 2 }}>
								<Typography sx={{ fontWeight: 600, color: "#7055F5" }}>Datos del Remito</Typography>

								<Divider sx={{ my: 2 }} />

								{/* Selector de Clientes */}
								<Box display="flex" gap={1} mb={2}>
									<Controller
										name="cliente"
										control={control}
										rules={{ required: "El cliente es obligatorio." }}
										render={({ field }) => (
											<TextField {...field} label="Cliente" select fullWidth>
												{clientes.length === 0 ? (
													<MenuItem disabled>
														No hay clientes disponibles. Crea uno nuevo.
													</MenuItem>
												) : (
													clientes.map((cliente) => (
														<MenuItem key={generateKey(cliente.id_cliente)} value={cliente.id_cliente}>
															{cliente.nombre_cliente}
														</MenuItem>
													))
												)}
											</TextField>
										)}
									/>
									<Button variant="contained" color="success" onClick={() => toggleClientModal()}>
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
								</Box>

								{/* Campo de cantidad y botón para agregar */}
								{productoActualID && (
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
											<AddShoppingCartIcon />
										</Button>
									</Box>
								)}
							</Box>

							{productoActualID && (
								<ProductoSeleccionado
									producto={getCurrentProduct(productos, productoActualID)}
									cantidad={cantidad}
									addProductToList={addProductToList}
								/>
							)}

							{renderAlert()}

							{productosSeleccionados.length > 0 && (
								<ResumenProductos productos={productosSeleccionados} montoTotal={calcularTotal(productosSeleccionados)} />
							)}
						</Box>
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
			{openClientModal && <CreateCustomerModal open={openClientModal} handleClose={toggleClientModal} />}
		</>
	);
};

