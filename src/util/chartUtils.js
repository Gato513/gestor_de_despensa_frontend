import Chart from "chart.js/auto";


const generateColor = () => {
    const r = Math.floor(Math.random() * 200) + 30;
    const g = Math.floor(Math.random() * 200) + 30;
    const b = Math.floor(Math.random() * 200) + 30;
    return `rgb(${r}, ${g}, ${b})`;
};
/**
 * Genera una imagen en base64 de un gráfico de ventas.
 */
export const getBase64ChartSales = async (data, title) => {
    if (!data || data.length === 0) return null;

    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = 600;
            canvas.height = 400;

            // Determinar el tipo de gráfico basado en el título para diferenciar "Ventas por Producto" y "Ventas por Período"
            let labels, datasetData, backgroundColors;

            if (title === "Ventas por Período") {
                labels = data.map(d => d.fecha); // Usar la fecha como etiqueta
                datasetData = data.map(d => d.total_ventas); // Usar el total de ventas como datos
            } else if (title === "Ventas por Producto") {
                labels = data.map(d => d.nombre_producto); // Usar el nombre del producto como etiqueta
                datasetData = data.map(d => d.cantidad_vendida); // Usar la cantidad vendida como datos
            }

            // Generar un color aleatorio para cada barra
            backgroundColors = datasetData.map(() => generateColor());

            const chart = new Chart(ctx, {
                type: "bar", // Tipo de gráfico de barras
                data: {
                    labels: labels, // Etiquetas dinámicas (fechas o productos)
                    datasets: [{
                        label: title,
                        data: datasetData, // Total de ventas o cantidad vendida
                        backgroundColor: backgroundColors // Colores aleatorios
                    }]
                },
                options: {
                    responsive: false, // Evita que se redimensione automáticamente
                    animation: false,  // Evita retrasos en la generación del gráfico
                    plugins: {
                        legend: { display: true } // Muestra la leyenda del gráfico
                    }
                }
            });

            // Esperamos a que el gráfico termine de renderizarse antes de extraer la imagen
            chart.options.animation = false;
            chart.update();

            setTimeout(() => {
                try {
                    const base64Image = canvas.toDataURL("image/png");
                    if (base64Image) {
                        resolve(base64Image);
                    } else {
                        reject("Error al generar la imagen base64.");
                    }
                } catch (error) {
                    reject(`Error al convertir a base64: ${error.message}`);
                }
            }, 200); // Pequeño retraso para garantizar la renderización
        } catch (error) {
            reject(`Error al crear el gráfico: ${error.message}`);
        }
    });
};

export const getBase64ChartInventory = async (data, title, type = "bar") => {
    if (!data || data.length === 0) return null;

    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = 600;
            canvas.height = 400;

            let labels, datasetData, backgroundColors = [];

            if (title.includes("Movimientos de Inventario")) {
                labels = data.map(d => new Date(d.fecha).toLocaleDateString());
                datasetData = data.map(d => d.cantidad);
                backgroundColors = ["rgb(54, 162, 235)", "rgb(255, 99, 132)"]; // Azul para entradas, rojo para salidas
            } else {
                labels = data.map(d => d.nombre_producto);
                datasetData = data.map(d => d.cantidad_vendida);
                backgroundColors = datasetData.map(() => generateColor());
            }

            const chart = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: title,
                        data: datasetData,
                        backgroundColor: backgroundColors
                    }]
                },
                options: {
                    responsive: false,
                    animation: false,
                    plugins: { legend: { display: true } }
                }
            });

            setTimeout(() => {
                try {
                    resolve(canvas.toDataURL("image/png"));
                } catch (error) {
                    reject(`Error al convertir a base64: ${error.message}`);
                }
            }, 200);
        } catch (error) {
            reject(`Error al crear el gráfico: ${error.message}`);
        }
    });
};

export const getBase64DebtReport = async (data, title, type = "line") => {
    if (!data || data.length === 0) return null;

    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = 600;
            canvas.height = 400;

            const labels = data.map(d => d.mes);
            const datasetData = data.map(d => parseFloat(d.total_adeudado || d.total_pagado));
            const backgroundColor = generateColor();
            const borderColor = generateColor();

            const chart = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: title,
                        data: datasetData,
                        borderColor: borderColor,
                        backgroundColor: backgroundColor,
                        fill: type !== "line"
                    }]
                },
                options: {
                    responsive: false,
                    animation: false,
                    plugins: { legend: { display: true } },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            setTimeout(() => {
                try {
                    resolve(canvas.toDataURL("image/png"));
                } catch (error) {
                    reject(`Error al convertir a base64: ${error.message}`);
                }
            }, 200);
        } catch (error) {
            reject(`Error al crear el gráfico: ${error.message}`);
        }
    });
};

export const getBase64PurchaseReport = async (data, title, type = "line") => {
    if (!data || data.length === 0) return null;

    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = 600;
            canvas.height = 400;

            const labels = data.map(d => new Date(d.fecha_compra).toLocaleDateString());
            const datasetData = data.map(d => parseFloat(d.monto_total));

            const backgroundColor = generateColor();
            const borderColor = generateColor();

            const chart = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: title,
                        data: datasetData,
                        borderColor: borderColor,
                        backgroundColor: backgroundColor,
                        fill: type !== "line"
                    }]
                },
                options: {
                    responsive: false,
                    animation: false,
                    plugins: { legend: { display: true } },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            setTimeout(() => {
                try {
                    resolve(canvas.toDataURL("image/png"));
                } catch (error) {
                    reject(`Error al convertir a base64: ${error.message}`);
                }
            }, 200);
        } catch (error) {
            reject(`Error al crear el gráfico: ${error.message}`);
        }
    });
};


export const getBase64CashFlowReport = async (data, title, type = "line") => {
    if (!data || data.length === 0) return null;

    return new Promise((resolve, reject) => {
        try {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = 600;
            canvas.height = 400;

            const labels = data.map(d => new Date(d.fecha_movimiento).toLocaleDateString());
            const datasetData = data.map(d => parseFloat(d.monto));

            const backgroundColor = generateColor();
            const borderColor = generateColor();

            const chart = new Chart(ctx, {
                type: type,
                data: {
                    labels: labels,
                    datasets: [{
                        label: title,
                        data: datasetData,
                        borderColor: borderColor,
                        backgroundColor: backgroundColor,
                        fill: type !== "line"
                    }]
                },
                options: {
                    responsive: false,
                    animation: false,
                    plugins: { legend: { display: true } },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });

            setTimeout(() => {
                try {
                    resolve(canvas.toDataURL("image/png"));
                } catch (error) {
                    reject(`Error al convertir a base64: ${error.message}`);
                }
            }, 200);
        } catch (error) {
            reject(`Error al crear el gráfico: ${error.message}`);
        }
    });
};

