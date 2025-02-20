"use client";

import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { minimumStockControl } from "@/services/products.service";

// Hook personalizado para obtener la información de stock
const useFetchStockInfo = () => {
    const [stockInfo, setStockInfo] = useState(null);
    const [isStockInfoLoaded, setIsStockInfoLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataStockInfo = await minimumStockControl();
                setStockInfo(dataStockInfo);
            } catch (error) {
                console.error("Error al cargar datos de stock:", error);
            } finally {
                setIsStockInfoLoaded(true);
            }
        };
        fetchData();
    }, []);

    return { stockInfo, isStockInfoLoaded };
};

export const StockAlert = () => {
    const { stockInfo, isStockInfoLoaded } = useFetchStockInfo();

    // Solo se renderiza la alerta si los datos están cargados y hay stock bajo
    if (!isStockInfoLoaded || !stockInfo?.lowStockDanger) {
        return null;
    }

    return (
        <Snackbar
            open
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            autoHideDuration={null} // La alerta permanecerá visible hasta que se haga clic
        >
                <Alert
                    severity="warning"
                    sx={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0} // Hace el componente accesible por teclado
                >
                    Hay {stockInfo.productQuantityReplenish || 0} productos con stock bajo.
                    Mas Informacion en Productos
                </Alert>
        </Snackbar>
    );
};
