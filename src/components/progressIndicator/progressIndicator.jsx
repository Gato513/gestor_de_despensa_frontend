import { Box, CircularProgress } from "@mui/material";


export const ProgressIndicator = ({ color, size }) => {
    return (
        <Box sx={styles.container}>
            <CircularProgress color={color} size={`${size}rem`} />
        </Box>
    )
};

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
};
