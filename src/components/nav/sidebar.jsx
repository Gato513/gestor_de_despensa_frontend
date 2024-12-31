"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	useMediaQuery,
	IconButton,
	Divider,
	Typography,
} from "@mui/material";

import {
	Menu as MenuIcon,
	DashboardOutlined as DashboardOutlinedIcon,
	ReceiptLongOutlined as ReceiptLongOutlinedIcon,
	Inventory2Outlined as Inventory2OutlinedIcon,
	GroupOutlined as GroupOutlinedIcon,
	LocalShippingOutlined as LocalShippingOutlinedIcon,
	BarChartOutlined as BarChartOutlinedIcon,
	AccountBalanceOutlined as AccountBalanceOutlinedIcon,
	SettingsOutlined as SettingsOutlinedIcon,
	LogoutOutlined as LogoutOutlinedIcon,
} from "@mui/icons-material";


export const Sidebar = () => {
	const drawerWidth = 300;
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [open, setOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	// Recuperar el estado del ítem seleccionado desde sessionStorage
	useEffect(() => {
		const savedItem = sessionStorage.getItem("selectedSidebarItem");
		if (savedItem) {
			setSelectedItem(parseInt(savedItem, 10)); // Convierte a número
		} else {
			setSelectedItem(0); // Selecciona el primer ítem (índice 0) por defecto
			sessionStorage.setItem("selectedSidebarItem", 0); // Guarda en sessionStorage
		}
	}, []);

	// Manejar clic y guardar en sessionStorage
	const handleItemClick = (index) => {
		setSelectedItem(index);
		sessionStorage.setItem("selectedSidebarItem", index); // Guarda en sessionStorage
	};

	const handleDrawerToggle = () => setOpen(!open);

	const menuItems = [
		{ text: "Panel", icon: <DashboardOutlinedIcon />, link: "/panel" },
		{ text: "Remitos", icon: <ReceiptLongOutlinedIcon />, link: "/remitos" },
		{ text: "Productos", icon: <Inventory2OutlinedIcon />, link: "/productos" },
		{ text: "Clientes", icon: <GroupOutlinedIcon />, link: "/customers" },
		{ text: "Proveedores", icon: <LocalShippingOutlinedIcon />, link: "/suppliers" },
		{ text: "Informes", icon: <BarChartOutlinedIcon />, link: "/reports" },
		{ text: "Caja", icon: <AccountBalanceOutlinedIcon />, link: "/cash" },
	];

	const optionsItems = [{ text: "Configuraciones", icon: <SettingsOutlinedIcon /> }];

	const renderMenuList = (items, offset = 0) =>
		items.map((item, index) => {
			const isSelected = selectedItem === index + offset;

			return (
				<ListItem key={index} disablePadding>
					<ListItemButton
						component={Link}
						href={item.link || "#"}
						onClick={() => handleItemClick(index + offset)}
						sx={{
							justifyContent: "flex-start",
							backgroundColor: isSelected ? "#d6c6f5" : "transparent",
							"&:hover": {
								backgroundColor: "#d6c6f5",
								transform: "scale(1.02)",
							},
							borderRadius: 2,
							padding: 1.8,
							color: isSelected ? "#4a32a8" : "#664ddf",
						}}
					>
						<ListItemIcon sx={{ color: isSelected ? "#4a32a8" : "#664ddf" }}>
							{item.icon}
						</ListItemIcon>
						<ListItemText
							primary={
								<Typography
									variant="body1"
									sx={{
										fontWeight: isSelected ? "bold" : "normal",
									}}
								>
									{item.text}
								</Typography>
							}
						/>
					</ListItemButton>
				</ListItem>
			);
		});

	return (
		<>
			{isMobile && (
				<IconButton
					edge="start"
					color="inherit"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, display: { sm: "none" } }}
				>
					<MenuIcon />
				</IconButton>
			)}

			<Drawer
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
						backgroundColor: "#f1eefe",
						border: 0,
						padding: 2,
						overflow: "hidden"
					},
				}}
				variant={isMobile ? "temporary" : "permanent"}
				anchor="left"
				open={isMobile ? open : true}
				onClose={handleDrawerToggle}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 1,
					}}
				>
					<Box component={Link} href="/">
						<Box
							component="img"
							src="/assets/logo.png"
							alt="Logo"
							sx={{ height: 50, width: "100%" }}
						/>
					</Box>

					<Divider />

					<List sx={{ display: "flex", flexDirection: "column", gap: 1 }} >{renderMenuList(menuItems)}</List>

					<Divider />

					<List>{renderMenuList(optionsItems, menuItems.length)}</List>

					<Divider />

					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							gap: 1,
							p: 2,
							borderRadius: 2,
							backgroundColor: "#e8eaf6",
						}}
					>
						<Box
							component="img"
							src="/assets/AvatarSidebar.png"
							alt="Avatar"
							sx={{ height: 50, borderRadius: "50%" }}
						/>

						<Box>
							<Typography
								variant="body1"
								sx={{
									fontWeight: "bold",
									color: "#4a32a8",
								}}
							>
								Olivia Rhye
							</Typography>

							<Typography
								variant="body2"
								sx={{
									color: "#2F2467",
									fontSize: "14px",
								}}
							>
								olivia@untitledui.com
							</Typography>
						</Box>

						<IconButton sx={{ marginLeft: "auto", color: "#4a32a8" }}>
							<LogoutOutlinedIcon />
						</IconButton>
					</Box>
				</Box>
			</Drawer>
		</>
	);
};
