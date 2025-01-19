"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useFetchData } from "@/hooks/fetch_initial_data";
import { DynamicFilter } from "@/components/filters/dynamicFilter";
import { fetchAllProducts } from "@/services/products.service";
import { ProgressIndicator } from "@/components/progressIndicator/progressIndicator";
import { accessToRows, defaultFilterConfig, headOfColumns, generateDynamicInputs } from "@/config/productsPage.config";

const ProductsPage = () => {
    const { user } = useUser();
    const { rows, isLoaded } = useFetchData(fetchAllProducts);
    const [dynamicFilterConfig, setDynamicFilterConfig] = useState(defaultFilterConfig);

    useEffect(() => {
        if (!isLoaded || rows.length === 0) return;

        const inputsToAdd = generateDynamicInputs(rows);

        setDynamicFilterConfig(prevConfig => {
            const existingInputs = new Set(prevConfig.inputs.map(input => input.name));

            const newInputs = inputsToAdd
                .filter(input => !existingInputs.has(input.name))
                .map(input => ({
                    ...input,
                    required: false,
                    type: "dropdownMenu",
                    inputWidth: null,
                }));

            if (newInputs.length === 0) return prevConfig;

            return {
                ...prevConfig,
                inputs: [...newInputs, ...prevConfig.inputs],
            };
        });
    }, [isLoaded, rows]);

    if (!user) {
        return <ProgressIndicator color="success" size={8} />;
    }

    if (!isLoaded) {
        return <ProgressIndicator color="info" size={6} />;
    }

    return (
        <DynamicFilter
            filterConfig={dynamicFilterConfig}
            rows={rows}
            headOfColumns={headOfColumns}
            accessToRows={accessToRows}
        />
    );
};

export default ProductsPage;
