"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useFetchData } from "@/hooks/fetch_initial_data";
import { fetchAllCajaData } from "@/services/registros.service";
import { DynamicFilter } from "@/components/filters/dynamicFilter";
import { ProgressIndicator } from "@/components/progressIndicator/progressIndicator";
import { accessToRows, defaultFilterConfig, headOfColumns, generateDynamicInputs, bottonActionConfig } from "@/config/cajaPage.config";
import { confirmAccessRoute } from "@/util/confirmRouteAccess";

const CajaPage = () => {
    const { user } = useUser();

    if (user && confirmAccessRoute(user.role)) {
        const { rows, isLoaded } = useFetchData(fetchAllCajaData);
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
            return <ProgressIndicator color={"success"} size={8} />;
        }

        if (!isLoaded) {
            return <ProgressIndicator color="info" size={6} />;
        }

        return isLoaded && (
            <DynamicFilter
                filterConfig={dynamicFilterConfig}
                rows={rows}
                headOfColumns={headOfColumns}
                accessToRows={accessToRows}
                bottonConfig={bottonActionConfig}

            />
        );
    }
    return <ProgressIndicator color="success" size={8} />;

};

export default CajaPage;
