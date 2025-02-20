"use client";

import { Dialog } from "@mui/material";
import { ConfirmationDialog } from "@/components/modals/accionsModals/confirmationDialog";

export const DisguiseElementModal = ({ isOpen, onClose, targetId, config, handleModifyRows }) => {
    return (
        <Dialog open={isOpen} maxWidth="sm">
            <ConfirmationDialog
                onClose={onClose}
                targetId={targetId}
                actionConfig={config.disguiseConfigModal}
                handleModifyRows={handleModifyRows}
            />
        </Dialog>
    );
};
