"use client";

import { AuditoriaDetail } from "@/components/detailElement/auditoriaDetail";
import { ClientDetail } from "@/components/detailElement/clientDetail";
import { FacturaDetail } from "@/components/detailElement/facturaDetail";
import { ProveedorDetail } from "@/components/detailElement/proveedorDetail";
import { RemitoDetail } from "@/components/detailElement/remitoDetail";
import { Dialog } from "@mui/material";

export const DetailsElementModal = ({ isOpen, onClose, targetId, elementToDetail, facturaType = null }) => {
    const elementDetailComponent = {
        remito:     <RemitoDetail       targetId={targetId} onClose={onClose} />,
        client:     <ClientDetail       targetId={targetId} onClose={onClose} />,
        proveedor:  <ProveedorDetail    targetId={targetId} onClose={onClose} />,
        auditoria:  <AuditoriaDetail    targetId={targetId} onClose={onClose} />,
        facturas:   <FacturaDetail      targetId={targetId} onClose={onClose} facturaType={facturaType} />,
    };

    const widthModal = elementToDetail === "facturas" ? "xl" : "md"

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth={widthModal} >
            {elementDetailComponent[elementToDetail] || <div>Elemento no encontrado</div>}
        </Dialog>
    );
};

