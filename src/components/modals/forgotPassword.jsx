import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	OutlinedInput,
} from "@mui/material";

export const ForgotPasswordModal = ({ open, handleClose }) => {
	const handleSubmit = (event) => {
		event.preventDefault();
		handleClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{ component: "form", onSubmit: handleSubmit }}
		>
			<DialogTitle>Reset password</DialogTitle>

			<DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<DialogContentText>
					Enter your email address, and we&apos;ll send you a link to reset your password.
				</DialogContentText>

				<OutlinedInput
					autoFocus
					required
					id="email"
					name="email"
					placeholder="Email address"
					type="email"
					fullWidth
				/>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button type="submit" variant="contained">
					Continue
				</Button>
			</DialogActions>
		</Dialog>
	);
};
