export const editRow = (rows, accessId, rowElementId, objetoToEdit) =>
    rows.map((row) =>
        row[accessId] === rowElementId ? { ...row, ...objetoToEdit } : row
    );

export const disguiseRow = (rows, accessId, rowElementId) => {
    return rows.filter((row) => row[accessId] !== rowElementId);
};