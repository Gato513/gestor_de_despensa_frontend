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
	LogoutOutlined as LogoutOutlinedIcon,
} from "@mui/icons-material";

import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { useUser } from "@/context/UserContext";
import generateKey from "@/util/generateKey";

// Lista de ítems del menú
const menuItems = [
	{
		text: "Panel",
		icon: <DashboardOutlinedIcon />,
		link: "/panel",
		roles: ["admin", "cajero"]

	},
	{
		text: "Remitos",
		icon: <ReceiptLongOutlinedIcon />,
		link: "/remitos",
		roles: ["admin"]

	},
	{
		text: "Productos",
		icon: <Inventory2OutlinedIcon />,
		link: "/productos",
		roles: ["admin"]

	},
	{
		text: "Clientes",
		icon: <GroupOutlinedIcon />,
		link: "/customers",
		roles: ["admin"]

	},
	{
		text: "Usuarios",
		icon: <ManageAccountsOutlinedIcon />,
		link: "/user_of_system",
		roles: ["admin"]

	},
	{
		text: "Proveedores",
		icon: <LocalShippingOutlinedIcon />,
		link: "/proveedores",
		roles: ["admin"]

	},
	{
		text: "Informes",
		icon: <BarChartOutlinedIcon />,
		link: "/informes",
		roles: ["admin"]

	},
	{
		text: "Caja",
		icon: <AccountBalanceOutlinedIcon />,
		link: "/caja",
		roles: ["admin"]

	},
];

const renderMenuList = (items, selectedItem, user, handleItemClick) => {
	return items.map((item, index) => {
		const isSelected = selectedItem === index;
		const isDisabled = !item.roles.includes(user.role);

		return (
			<ListItem key={generateKey(index)} disablePadding>
				<ListItemButton
					component={Link}
					href={isDisabled ? "#" : item.link}
					onClick={() => handleItemClick(index, isDisabled)}
					sx={{
						...styles.listItemButton,
						backgroundColor: isSelected ? "#d6c6f5" : "transparent",
						"&:hover": {
							backgroundColor: !isDisabled ? "#d6c6f5" : "transparent",
							transform: !isDisabled ? "scale(1.02)" : "none",
						},
						color: isDisabled ? "#BDBDBD" : isSelected ? "#4a32a8" : "#664ddf",
						cursor: isDisabled ? "not-allowed" : "pointer",
					}}
					disabled={isDisabled}
				>
					<ListItemIcon
						sx={{
							...styles.listItemIcon,
							color: isDisabled ? "#BDBDBD" : isSelected ? "#4a32a8" : "#664ddf",
						}}
					>
						{item.icon}
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography
								variant="body1"
								sx={{
									fontWeight: isSelected ? "bold" : "normal",
									color: isDisabled ? "#BDBDBD" : "inherit",
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
}

export const Sidebar = () => {
	const drawerWidth = 300;
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [open, setOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	const { user } = useUser();

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
	const handleItemClick = (index, disabled) => {
		if (disabled) return; // No hacer nada si el botón está deshabilitado
		setSelectedItem(index);
		sessionStorage.setItem("selectedSidebarItem", index); // Guarda en sessionStorage
	};

	const handleDrawerToggle = () => setOpen(!open);

	if (!user) {
		return null;
	}

	return (
		<>
			{isMobile && (
				<IconButton
					edge="start"
					color="inherit"
					onClick={handleDrawerToggle}
					sx={styles.menuIconButton}
				>
					<MenuIcon />
				</IconButton>
			)}

			<Drawer
				sx={{
					...styles.drawer,
					"& .MuiDrawer-paper": {
						...styles.drawerPaper,
						width: drawerWidth,
					},
				}}
				variant={isMobile ? "temporary" : "permanent"}
				anchor="left"
				open={isMobile ? open : true}
				onClose={handleDrawerToggle}
			>
				<Box sx={styles.drawerContent}>
					<Box component={Link} href="/">
						<Box component="img" src="/assets/logo.png" alt="Logo" sx={styles.logo} />
					</Box>

					<Divider />

					<List sx={styles.menuList}>{renderMenuList(menuItems, selectedItem, user, handleItemClick)}</List>

					<Divider />

					<Box sx={styles.userSection}>
						<Box
							component="img"
							src="/assets/AvatarSidebar.png"
							alt="Avatar"
							sx={styles.userAvatar}
						/>

						<Box>
							<Typography variant="body1" sx={styles.userName}>
								{user.nombre_usuario}
							</Typography>
						</Box>

						<IconButton sx={styles.logoutButton}>
							<LogoutOutlinedIcon />
						</IconButton>
					</Box>
				</Box>
			</Drawer>
		</>
	);
};

const styles = {
	menuIconButton: {
		mr: 2,
		display: { sm: "none" },
	},
	drawer: {
		width: 300,
		flexShrink: 0,
	},
	drawerPaper: {
		boxSizing: "border-box",
		backgroundColor: "#f1eefe",
		border: 0,
		padding: 2,
		overflow: "hidden",
	},
	drawerContent: {
		display: "flex",
		flexDirection: "column",
		gap: 1,
	},
	logo: {
		height: 50,
		width: "100%",
	},
	menuList: {
		display: "flex",
		flexDirection: "column",
		gap: 1,
	},
	listItemButton: {
		justifyContent: "flex-start",
		borderRadius: 2,
		padding: 1.8,
	},
	listItemIcon: {},
	userSection: {
		display: "flex",
		alignItems: "center",
		gap: 1,
		p: 2,
		borderRadius: 2,
		backgroundColor: "#e8eaf6",
	},
	userAvatar: {
		height: 40,
		borderRadius: "50%",
		backgroundColor: "#D6C6F5",
		padding: 1,
	},
	userName: {
		fontWeight: "bold",
		color: "#4a32a8",
		fontSize: "0.9rem",
	},
	logoutButton: {
		marginLeft: "auto",
		color: "#4a32a8",
	},
};
