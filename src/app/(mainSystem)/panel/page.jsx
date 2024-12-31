"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, IconButton, Button, Grid2 } from "@mui/material";
import { NoteAdd, PersonAdd, Receipt, Inventory } from "@mui/icons-material";
import styles from "./PanelPage.module.css";
import { ProductBillingModal } from "@/components/modals/productBillingModal";
import { CobranzaModal } from "@/components/modals/cobranzaModal";
import { CreateCustomerModal } from "@/components/modals/customerModal";
import { CreateRemitoModal } from "@/components/modals/createRemitoModal";

const forms = [
	{
		name: "Formulario de Cobranza",
		icon: <NoteAdd />,
		color: "#2196f3",
		onClick: "openCobranzaModal",
	},
	{
		name: "Creación de Clientes",
		icon: <PersonAdd />,
		color: "#9c27b0",
		onClick: "openCustomerModal",
	},
	{
		name: "Creación de Remitos",
		icon: <Receipt />,
		color: "#4caf50",
		onClick: "openRemitoModal",
	},
	{
		name: "Facturación de Productos",
		icon: <Inventory />,
		color: "#f44336",
		onClick: "openProductBillingModal",
	},
];

const PanelPage = () => {
	// Estados para controlar los modales
	const [openProductBillingModal, setOpenProductBillingModal] = useState(false);
	const [openCobranzaModal, setOpenCobranzaModal] = useState(false);
	const [openCustomerModal, setOpenCustomerModal] = useState(false);
	const [openRemitoModal, setOpenRemitoModal] = useState(false);

	// Función para abrir modales
	const handleOpenModal = (modal) => {
		const modals = {
			openProductBillingModal: setOpenProductBillingModal,
			openCobranzaModal: setOpenCobranzaModal,
			openCustomerModal: setOpenCustomerModal,
			openRemitoModal: setOpenRemitoModal,
		};

		modals[modal](true);
	};

	// Función para cerrar todos los modales
	const handleCloseModal = () => {
		setOpenProductBillingModal(false);
		setOpenCobranzaModal(false);
		setOpenCustomerModal(false);
		setOpenRemitoModal(false);
	};

	return (
		<Box className={styles.container}>

			<Grid2 container spacing={6} justifyContent="center">
				{forms.map((form, index) => (
					
					<Grid2 xs={12} sm={6} md={4} key={index}>
						<Paper className={styles.paper}>
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
			<CreateCustomerModal open={openCustomerModal} handleClose={handleCloseModal} />
			<CreateRemitoModal 	 open={openRemitoModal} handleClose={handleCloseModal} />
			<ProductBillingModal open={openProductBillingModal} handleClose={handleCloseModal} />
			<CobranzaModal open={openCobranzaModal} handleClose={handleCloseModal} />
		</Box>
	);
};

export default PanelPage;
