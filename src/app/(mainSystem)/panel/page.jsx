"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, IconButton, Button, Grid2 } from "@mui/material";
import { NoteAdd, PersonAdd, Receipt, Inventory } from "@mui/icons-material";
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
		name: "Cobranza y Facturacion",
		icon: <NoteAdd />,
		color: "#2196f3",
		onClick: "openCobranzaModal",
		roles: ["admin", "cajero"],
	},
	{
		name: "Creación de Clientes",
		icon: <PersonAdd />,
		color: "#9c27b0",
		onClick: "openCustomerModal",
		roles: ["admin", "cajero"],
	},
	{
		name: "Creación de Usuarios",
		icon: <PersonAdd />,
		color: "#cba217",
		onClick: "CreateSystemUserModal",
		roles: ["admin"],
	},
	{
		name: "Venta de Productos",
		icon: <Receipt />,
		color: "#4caf50",
		onClick: "openRemitoModal",
		roles: ["admin", "cajero"],
	},
	{
		name: "Compra de Productos",
		icon: <Inventory />,
		color: "#f44336",
		onClick: "openProductBillingModal",
		roles: ["admin"],
	},
];

const PanelPage = () => {
	const [openModal, setOpenModal] = useState(null); // Controla qué modal está abierto

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
			<Grid2 container spacing={6} justifyContent="center">
				{forms
					.filter((form) => form.roles.includes(user.role)) // Filtra según el rol del usuario
					.map((form, index) => (
						<Grid2 xs={12} sm={6} md={4} key={generateKey(index)}>
							<Paper sx={user.role === "admin" ? { width: "22rem" } : { width: "25rem" }} className={styles.paper}>
								<IconButton
									className={styles.iconButton}
									style={{ backgroundColor: form.color }}
									onClick={() => handleOpenModal(form.onClick)}
								>
									{form.icon}
								</IconButton>

								<Typography
									variant="h6"
									className={styles.formName}
									style={{ color: form.color }}
								>
									{form.name}
								</Typography>

								<Button
									variant="contained"
									className={styles.button}
									style={{ backgroundColor: form.color }}
									onClick={() => handleOpenModal(form.onClick)}
								>
									Acceder
								</Button>
							</Paper>
						</Grid2>
					))}
			</Grid2>

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
