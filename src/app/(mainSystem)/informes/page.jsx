"use client";

import React, { useState } from "react";
import { Box, Typography, Paper, IconButton, Button } from "@mui/material";
import { BarChart, Inventory2, Assignment, ShoppingCart, AttachMoney, VerifiedUser } from "@mui/icons-material";
import styles from "./InformePage.module.css";
import { useUser } from "@/context/UserContext";
import { ProgressIndicator } from "@/components/progressIndicator/progressIndicator";
import generateKey from "@/util/generateKey";
import { SalesReportModal } from "@/components/informes/salesReport";
import { InventoryReportModal } from "@/components/informes/inventoryReport";
import { DebtReportModal } from "@/components/informes/DebtRepor";
import { PurchaseReportModal } from "@/components/informes/PurchaseReport";
import { CashFlowReportModal } from "@/components/informes/CashFlowReport";
import { AuditReportModal } from "@/components/informes/AuditReport";
import { confirmAccessRoute } from "@/util/confirmRouteAccess";

const reportTypes = [
    {
        name: "Informe de Ventas",
        icon: <BarChart fontSize="large" />,
        color: "#1976D2", // Azul - Representa estadísticas de ventas
        bgColor: "#E3F2FD",
        onClick: "SalesReport",
        roles: ["admin"],
    },
    {
        name: "Informe de Inventario",
        icon: <Inventory2 fontSize="large" />,
        color: "#8E24AA", // Morado - Representa almacenamiento y stock
        bgColor: "#F3E5F5",
        onClick: "InventoryReport",
        roles: ["admin"],
    },
    {
        name: "Informe de Deudas",
        icon: <Assignment fontSize="large" />,
        color: "#FFA000", // Amarillo - Representa alertas y finanzas pendientes
        bgColor: "#FFF8E1",
        onClick: "DebtReport",
        roles: ["admin"],
    },
    {
        name: "Inf. Compras a Proveedores",
        icon: <ShoppingCart fontSize="large" />,
        color: "#43A047", // Verde - Representa compras y abastecimiento
        bgColor: "#E8F5E9",
        onClick: "SupplierPurchasingReport",
        roles: ["admin"],
    },
    {
        name: "Informe de Movimientos de Caja",
        icon: <AttachMoney fontSize="large" />,
        color: "#D32F2F", // Rojo - Representa transacciones monetarias
        bgColor: "#FFEBEE",
        onClick: "CashMovementReport",
        roles: ["admin"],
    },
    // {
    //     name: "Informe de Auditoría",
    //     icon: <VerifiedUser fontSize="large" />,
    //     color: "#37474F", // Gris oscuro - Representa seguridad y control
    //     bgColor: "#ECEFF1",
    //     onClick: "AuditReport",
    //     roles: ["admin"],
    // },
];

const InformesPage = () => {
    const { user } = useUser();

    if (user && confirmAccessRoute(user.role)) {
        const [openModal, setOpenModal] = useState(null);

        const handleOpenModal = (modal) => {
            setOpenModal(modal);
        };

        const handleCloseModal = () => {
            setOpenModal(null);
        };

        if (!user) {
            return <ProgressIndicator color={"success"} size={8} />;
        }

        return (
            <>
                <Box className={styles.container}>
                    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
                        {reportTypes
                            .filter((form) => form.roles.includes(user.role))
                            .map((form, index) => (
                                <Paper
                                    key={generateKey(index)}
                                    sx={{
                                        width: "22rem",
                                        padding: "1.5rem",
                                        textAlign: "center",
                                        backgroundColor: form.bgColor,
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                        transition: "all 0.3s ease-in-out",
                                        "&:hover": {
                                            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
                                            transform: "translateY(-4px)",
                                        },
                                    }}
                                >
                                    <IconButton
                                        sx={{
                                            backgroundColor: form.color,
                                            color: "#fff",
                                            width: "60px",
                                            height: "60px",
                                            marginBottom: "1rem",
                                            "&:hover": {
                                                backgroundColor: form.color,
                                                opacity: 0.85,
                                            },
                                        }}
                                        onClick={() => handleOpenModal(form.onClick)}
                                    >
                                        {form.icon}
                                    </IconButton>

                                    <Typography variant="h6" sx={{ fontWeight: "bold", color: form.color, marginBottom: "1rem" }}>
                                        {form.name}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: form.color,
                                            "&:hover": { backgroundColor: form.color, opacity: 0.85 },
                                            fontWeight: "bold",
                                            padding: "0.5rem 1rem",
                                        }}
                                        onClick={() => handleOpenModal(form.onClick)}
                                    >
                                        Acceder
                                    </Button>
                                </Paper>
                            ))}
                    </Box>
                </Box>

                {/* Modales */}
                <SalesReportModal open={openModal === "SalesReport"} handleClose={handleCloseModal} />
                <InventoryReportModal open={openModal === "InventoryReport"} handleClose={handleCloseModal} />
                <DebtReportModal open={openModal === "DebtReport"} handleClose={handleCloseModal} />
                <PurchaseReportModal open={openModal === "SupplierPurchasingReport"} handleClose={handleCloseModal} />
                <CashFlowReportModal open={openModal === "CashMovementReport"} handleClose={handleCloseModal} />
                <AuditReportModal open={openModal === "AuditReport"} handleClose={handleCloseModal} />

            </>
        );
    }
    return <ProgressIndicator color="success" size={8} />;

};

export default InformesPage;
