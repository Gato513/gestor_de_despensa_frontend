"use client";
import { Box, Typography } from "@mui/material";
import { useUser } from "@/context/UserContext";
import { ProgressIndicator } from "@/components/progressIndicator/progressIndicator";


const RemitosPage = () => {
    const { user } = useUser();

    if (!user) {
        return <ProgressIndicator color={"success"} size={8} />;
    }

    return (
        <Box className={styles.container}>
            <Typography>Hola Informes</Typography>
        </Box>
    );
};

export default RemitosPage;

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
};