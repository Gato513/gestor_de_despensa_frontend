"use client";

import { Dialog } from "@mui/material";
import { ConfirmationDialog } from "@/components/modals/accionsModals/confirmationDialog";

export const DeleteElementModal = ({ isOpen, onClose, targetId, config }) => {
    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <ConfirmationDialog
                onClose={onClose}
                targetId={targetId}
                actionConfig={config}
            />
        </Dialog>
    );
};
