"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/session.service";
import styles from "./LoginForm.module.css";
import {
	Box,
	Button,
	FormLabel,
	FormControl,
	TextField,
	Typography,
	Card,
	Link,
} from "@mui/material";
import { ForgotPasswordModal } from "@/components/modals/mainModals/forgotPassword";

export function LoginForm() {
	const [errors, setErrors] = useState({ email: "", password: "", session: "" });
	const [open, setOpen] = useState(false);
	const router = useRouter();

	// Handlers for Forgot Password Modal
	const handleClickOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// Validates the form inputs
	const validateInputs = ({ email, password }) => {
		const newErrors = {};

		if (!email || !/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = "Por favor ingrese una dirección de email válida";
		}
		if (!password || password.length < 6) {
			newErrors.password = "La contraseña debe tener como mínimo 6 caracteres";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handles form submission
	const handleSubmit = async (event) => {
		event.preventDefault();

		const urlList = [
			"/panel",
			"/remitos",
			"/productos",
			"/customers",
			"/user_of_system",
			"/proveedores",
			"/informes",
			"/caja",
			"/auditoria",
			"/facturas",
		];
		const savedItem = sessionStorage.getItem("selectedSidebarItem");
		const lastPage = savedItem ? urlList[parseInt(savedItem, 10)] : urlList[0];

		const formData = new FormData(event.currentTarget);
		const data = {
			email: formData.get("email"),
			password: formData.get("password"),
		};

		if (!validateInputs(data)) return;

		try {
			await login(data);
			router.push(lastPage);
		} catch (error) {
			setErrors((prevErrors) => ({
				...prevErrors,
				session: error.message || "Error inesperado. Intente nuevamente.",
			}));
		}
	};

	return (
		<Card className={styles.card}>
			<Typography component="h1" variant="h4" className={styles.title}>
				Login
			</Typography>

			<Box component="form" onSubmit={handleSubmit} noValidate className={styles.form}>
				{/* Email Input */}
				<FormControl className={styles.input}>
					<FormLabel htmlFor="email">Email</FormLabel>
					<TextField
						id="email"
						name="email"
						type="email"
						autoFocus
						error={!!errors.email}
						helperText={errors.email}
						required
						fullWidth
					/>
				</FormControl>

				{/* Password Input */}
				<FormControl>
					<Box sx={{ display: "flex", justifyContent: "space-between" }}>
						<FormLabel htmlFor="password">Password</FormLabel>
						<Link
							component="button"
							type="button"
							onClick={handleClickOpen}
							variant="body2"
							className={styles.link}
						>
							¿Olvidaste tu contraseña?
						</Link>
					</Box>
					<TextField
						id="password"
						name="password"
						type="password"
						error={!!errors.password}
						helperText={errors.password}
						required
						fullWidth
					/>
				</FormControl>

				{/* Error Message */}
				{errors.session && (
					<Typography variant="body2" color="error" className={styles.errorMessage}>
						{errors.session}
					</Typography>
				)}

				{/* Forgot Password Modal */}
				<ForgotPasswordModal open={open} handleClose={handleClose} />

				{/* Submit Button */}
				<Button type="submit" fullWidth variant="contained" className={styles.button}>
					Ingresar
				</Button>
			</Box>
		</Card>
	);
}
