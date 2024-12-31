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
import { ForgotPasswordModal } from "@/components/modals/forgotPassword";

export function LoginForm() {
	const [errors, setErrors] = useState({ email: "", password: "", session: "" });
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const handleClickOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const validateInputs = (data) => {
		const newErrors = {};
		if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
			newErrors.email = "Por favor ingrese una dirección de email válida";
		}
		if (!data.password || data.password.length < 6) {
			newErrors.password = "La contraseña debe de tener como mínimo 6 caracteres de longitud";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		const data = {
			email: formData.get("email"),
			password: formData.get("password"),
		};

		if (!validateInputs(data)) return;

		try {
			const response = await login(data);
			console.log(response);
			if (!response.ok) throw new Error(response.message || "Error al iniciar sesión");
			router.push("/panel");
		} catch (error) {
			setErrors((prevErrors) => ({
				...prevErrors,
				session: error || "Error inesperado. Intente nuevamente.",
			}));
		}
	};

	return (
		<Card className={styles.card}>
			<Typography component="h1" variant="h4" className={styles.title}>
				Login
			</Typography>

			<Box component="form" onSubmit={handleSubmit} noValidate className={styles.form}>

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

				{errors.session && (
					<Typography variant="body2" color="error" className={styles.errorMessage}>
						{errors.session}
					</Typography>
				)}

				<ForgotPasswordModal open={open} handleClose={handleClose} />

				<Button type="submit" fullWidth variant="contained" className={styles.button}>
					Ingresar
				</Button>
			</Box>
		</Card>
	);
}
