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