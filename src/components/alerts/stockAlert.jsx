"use client";

import { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import Link from "next/link";
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
            sx={{ cursor: "pointer" }}
        >
            <Link href="/productos">
                <Alert
                    severity="warning"
                    sx={{ cursor: "pointer" }}
                    role="button"
                    tabIndex={0} // Hace el componente accesible por teclado
                >
                    Hay {stockInfo.productQuantityReplenish || 0} productos con stock bajo.
                    Haga clic aquí para más detalles.
                </Alert>
            </Link>
        </Snackbar>
    );
};
