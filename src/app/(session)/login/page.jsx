"use client"
import { LoginForm } from "@/components/forms/session/loginForm"
import CssBaseline from "@mui/material/CssBaseline";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
	return (
		<>
			<CssBaseline enableColorScheme />
			<div className={styles.signInContainer}>
				<LoginForm />
			</div>
		</>
	);
};

export default LoginPage;
