"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, IconButton, Button } from "@mui/material";
import { Receipt, GroupAdd, PersonAdd, ShoppingCart, Store } from "@mui/icons-material";
import styles from "./PanelPage.module.css";
import { ProductBillingModal } from "@/components/modals/mainModals/productBillingModal";
import { CobranzaModal } from "@/components/modals/mainModals/cobranzaModal";
import { CreateCustomerModal } from "@/components/modals/mainModals/customerModal";
import { CreateRemitoModal } from "@/components/modals/mainModals/createRemitoModal";
import { CreateSystemUserModal } from "@/components/modals/mainModals/createSystemUser";
import { useUser } from "@/context/UserContext";
import { ProgressIndicator } from "@/components/progressIndicator/progressIndicator";
import generateKey from "@/util/generateKey";

const forms = [
	{
		name: "Cobranza y Facturación",
		icon: <Receipt fontSize="large" />,
		color: "#1976D2", // Azul - Representa facturación
		bgColor: "#E3F2FD",
		onClick: "openCobranzaModal",
		roles: ["admin", "cajero"],
	},
	{
		name: "Creación de Clientes",
		icon: <PersonAdd fontSize="large" />,
		color: "#8E24AA", // Morado - Representa gestión de clientes
		bgColor: "#F3E5F5",
		onClick: "openCustomerModal",
		roles: ["admin", "cajero"],
	},
	{
		name: "Creación de Usuarios",
		icon: <GroupAdd fontSize="large" />,
		color: "#FFA000", // Amarillo - Representa administración de usuarios
		bgColor: "#FFF8E1",
		onClick: "CreateSystemUserModal",
		roles: ["admin"],
	},
	{
		name: "Venta de Productos",
		icon: <ShoppingCart fontSize="large" />,
		color: "#43A047", // Verde - Representa ventas
		bgColor: "#E8F5E9",
		onClick: "openRemitoModal",
		roles: ["admin", "cajero"],
	},
	{
		name: "Compra de Productos",
		icon: <Store fontSize="large" />,
		color: "#D32F2F", // Rojo - Representa compras y abastecimiento
		bgColor: "#FFEBEE",
		onClick: "openProductBillingModal",
		roles: ["admin"],
	},
];

const PanelPage = () => {
	const [openModal, setOpenModal] = useState(null);
	const { user } = useUser();

	const handleOpenModal = (modal) => {
		setOpenModal(modal);
	};

	const handleCloseModal = () => {
		setOpenModal(null);
	};

	if (!user) {
		return <ProgressIndicator color={"success"} size={8} />;
	}

	return (
		<Box className={styles.container}>
			<Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
				{forms
					.filter((form) => form.roles.includes(user.role))
					.map((form, index) => (
						<Paper
							key={generateKey(index)}
							sx={{
								width: "22rem",
								padding: "1.5rem",
								textAlign: "center",
								backgroundColor: form.bgColor,
								borderRadius: "12px",
								boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
								transition: "all 0.3s ease-in-out",
								"&:hover": {
									boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
									transform: "translateY(-4px)",
								},
							}}
						>
							<IconButton
								sx={{
									backgroundColor: form.color,
									color: "#fff",
									width: "60px",
									height: "60px",
									marginBottom: "1rem",
									"&:hover": {
										backgroundColor: form.color,
										opacity: 0.85,
									},
								}}
								onClick={() => handleOpenModal(form.onClick)}
							>
								{form.icon}
							</IconButton>

							<Typography variant="h6" sx={{ fontWeight: "bold", color: form.color, marginBottom: "1rem" }}>
								{form.name}
							</Typography>

							<Button
								variant="contained"
								sx={{
									backgroundColor: form.color,
									"&:hover": { backgroundColor: form.color, opacity: 0.85 },
									fontWeight: "bold",
									padding: "0.5rem 1rem",
								}}
								onClick={() => handleOpenModal(form.onClick)}
							>
								Acceder
							</Button>
						</Paper>
					))}
			</Box>

			{/* Modales */}
			<CreateCustomerModal open={openModal === "openCustomerModal"} handleClose={handleCloseModal} />
			<CreateSystemUserModal open={openModal === "CreateSystemUserModal"} handleClose={handleCloseModal} />
			<CreateRemitoModal open={openModal === "openRemitoModal"} handleClose={handleCloseModal} />
			<ProductBillingModal open={openModal === "openProductBillingModal"} handleClose={handleCloseModal} />
			<CobranzaModal open={openModal === "openCobranzaModal"} handleClose={handleCloseModal} />
		</Box>
	);
};

export default PanelPage;
