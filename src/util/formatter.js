export const capitalize = (string) => {
    if (!string) return ''; // Manejar cadenas vacías

    // Verificar si la cadena es completamente numérica
    if (/^\d+$/.test(string)) return string;

    return string.charAt(0).toUpperCase() + string.slice(1);
};


export const formatAsOption = (rows, access) => {
    return Array.from(
        rows.reduce((mapa, row) => {
            const filteringParameter = row[access];
            if (!mapa.has(filteringParameter)) {
                mapa.set(filteringParameter, { value: filteringParameter, label: filteringParameter });
            }
            return mapa;
        }, new Map()).values()
    );
}