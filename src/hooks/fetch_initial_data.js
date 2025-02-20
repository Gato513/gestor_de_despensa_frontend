import { useEffect, useState } from "react";

export const useFetchData = (accessFunctionApi) => {
    const [rows, setRows] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await accessFunctionApi();
                setRows(data);
                setIsLoaded(true);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        fetchData();
    }, []);

    return { rows, setRows, isLoaded, setIsLoaded };
};

export const useFetchDataById = (accessFunctionApi, targetId, facturaType = null) => { // facturaType indica el tipo de factura venta o compra.
    const [rows, setRows] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await (facturaType ? accessFunctionApi(targetId, facturaType) : accessFunctionApi(targetId));
                setRows(data);
                setIsLoaded(true);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };
        fetchData();
    }, []);

    return { rows, setRows, isLoaded, setIsLoaded };
};
