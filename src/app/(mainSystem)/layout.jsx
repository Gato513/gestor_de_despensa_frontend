import Box from "@mui/material/Box";
import { Sidebar } from "@/components/nav/sidebar.jsx";
import { CssBaseline } from "@mui/material";
import styles from "./MainLayout.module.css";

export default function MainLayout({ children }) {
	return (
		<Box sx={{ display: "flex", height: "100%" }}>
			<CssBaseline />
			<Sidebar />
			<main className={styles.main}>
				<Box className={styles.content}>{children}</Box>
			</main>
		</Box>
	);
}
