"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { disguiseRow, editRow } from "@/util/rowUtils";
import { useFetchData } from "@/hooks/fetch_initial_data";
import { DynamicFilter } from "@/components/filters/dynamicFilter";
import { fetchAllProducts } from "@/services/products.service";
import { ProgressIndicator } from "@/components/progressIndicator/progressIndicator";
import { accessToRows, defaultFilterConfig, headOfColumns, generateDynamicInputs, bottonActionConfig } from "@/config/productsPage.config";
import { confirmAccessRoute } from "@/util/confirmRouteAccess";

const ProductsPage = () => {
    const { user } = useUser();

    if (user && confirmAccessRoute(user.role)) {
        const { rows: initialRows, isLoaded } = useFetchData(fetchAllProducts);
        const [rows, setRows] = useState([]);
        const [dynamicFilterConfig, setDynamicFilterConfig] = useState(defaultFilterConfig);

        useEffect(() => {
            if (isLoaded && initialRows.length > 0) {
                setRows(initialRows);
            }
        }, [isLoaded, initialRows]);

        const handleModifyRows = ({ typeOfAction, rowElementId, objetoToEdit = null }) => {
            const { accessId } = bottonActionConfig;

            const actions = {
                disguise: () => setRows((prevRows) => disguiseRow(prevRows, accessId, rowElementId)),
                edit: () => setRows((prevRows) => editRow(prevRows, accessId, rowElementId, objetoToEdit)),
            };

            const actionHandler = actions[typeOfAction];
            if (actionHandler) {
                actionHandler();
            } else {
                console.error(`Acción no soportada: ${typeOfAction}`);
            }
        };

        useEffect(() => {
            if (!isLoaded || rows.length === 0) return;

            const inputsToAdd = generateDynamicInputs(rows);

            setDynamicFilterConfig((prevConfig) => {
                const existingInputs = new Set(prevConfig.inputs.map((input) => input.name));

                const newInputs = inputsToAdd
                    .filter((input) => !existingInputs.has(input.name))
                    .map((input) => ({
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
                bottonConfig={bottonActionConfig}
                handleModifyRows={handleModifyRows}
            />
        );
    }
    return <ProgressIndicator color="success" size={8} />;

};

export default ProductsPage;