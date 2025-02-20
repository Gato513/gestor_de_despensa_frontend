"use client";

import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import generateKey from "@/util/generateKey";
import { DisguiseElementModal } from "./disguiseElementModal";
import { DeleteElementModal } from "./deleteElementModal";
import { EditElementModal } from "./editElementModal";
import { DetailsElementModal } from "./detailsElementModal";

const defaultButtons = {
    edit: { icon: <EditIcon />, title: "Editar", color: "success" },
    delete: { icon: <DeleteIcon />, title: "Eliminar", color: "error" },
    details: { icon: <VisibilityIcon />, title: "Detalles", color: "primary" },
    disguise: { icon: <VisibilityOffIcon />, title: "Ocultar", color: "warning" },
};

export const ActionButtons = ({ row, config, handleModifyRows }) => {
    const [activeModal, setActiveModal] = useState(null);
    const [targetId, setTargetId] = useState(null);
    const [facturaType, setFacturaType] = useState(null);

    
    const { accessId, allowedButtons, page, editConfigModal = null } = config;

    const handleButtonClick = (type) => {
        if (["disguise", "delete", "edit", "details" ].includes(type)) {
            setTargetId(row[accessId]);
        }
        if (["facturas"].includes(page)) {
            setFacturaType(row["tipo_factura"])
        }
        setActiveModal(type);
    };

    const handleCloseModal = () => {
        setActiveModal(null);
        setTargetId(null);
    };

    const renderModal = () => {
        switch (activeModal) {
            case "disguise":
                return (
                    <DisguiseElementModal
                        isOpen
                        onClose={handleCloseModal}
                        targetId={targetId}
                        config={config}
                        handleModifyRows={handleModifyRows}
                    />
                );
            case "delete":
                return (
                    <DeleteElementModal
                        isOpen
                        onClose={handleCloseModal}
                        targetId={targetId}
                        config={config}
                        handleModifyRows={handleModifyRows}
                    />
                );
            case "edit":
                return (
                    <EditElementModal
                        isOpen
                        onClose={handleCloseModal}
                        row={row}
                        fieldsToEdit={editConfigModal.fieldsToEdit}
                        config={editConfigModal}
                        targetId={targetId}
                        handleModifyRows={handleModifyRows}
                    />
                );
            case "details":
                return (
                    <DetailsElementModal
                        isOpen
                        onClose={handleCloseModal}
                        elementToDetail={page}
                        targetId={targetId}
                        facturaType={page === "facturas" ? facturaType : undefined}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ height: 45, display: "flex", gap: 1 }}>
            {allowedButtons.map((buttonType) => {
                const { icon, title, color } = defaultButtons[buttonType];
                return (
                    <Tooltip key={generateKey(buttonType)} title={title}>
                        <IconButton color={color} onClick={() => handleButtonClick(buttonType)}>
                            {icon}
                        </IconButton>
                    </Tooltip>
                );
            })}
            {renderModal()}
        </Box>
    );
};
