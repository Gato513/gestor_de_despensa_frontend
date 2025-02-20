"use client";
import { useMemo, useState } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper } from "@mui/material";
import { ProgressIndicator } from "@/components/progressIndicator/progressIndicator";
import { EnhancedTableHead } from "@/components/tables/enhancedTableHead";
import { useUser } from "@/context/UserContext";
import { capitalize } from "@/util/formatter";
import generateKey from "@/util/generateKey";
import { ActionButtons } from "../modals/accionsModals/actionButtons";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export const DynamicTable = ({ rows, headOfColumns, accessToRows, bottonConfig = null, handleModifyRows = null, numberOfRows = 5 }) => {
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(numberOfRows);
    const { user } = useUser();

    const handleRequestSort = (event, property) => {
        setOrder(orderBy === property && order === "asc" ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = Math.max(0, (1 + page) * rowsPerPage - rows.length);

    const visibleRows = useMemo(
        () =>
            rows
                .slice()
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
        [order, orderBy, page, rowsPerPage, rows]
    );

    if (!user) return <ProgressIndicator color="success" size={5} />;

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
                        <EnhancedTableHead
                            headOfColumns={headOfColumns}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.length > 0 ? (
                                visibleRows.map((row, index) => (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={generateKey(index)}
                                    >
                                        {accessToRows.map(accessName => (
                                            <TableCell key={generateKey(accessName)}>
                                                {["estado", "userRole", "movimiento", "have_stock", "tipo_factura"].includes(accessName)
                                                    ? capitalize(row[accessName])
                                                    : row[accessName]}
                                            </TableCell>
                                        ))}

                                        {bottonConfig && (
                                            <TableCell sx={{ py: 0 }}>
                                                <ActionButtons
                                                    row={row}
                                                    accessToRows={accessToRows}
                                                    config={bottonConfig}
                                                    handleModifyRows={handleModifyRows}
                                                />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={accessToRows.length + (bottonConfig ? 1 : 0)}>
                                        <Box textAlign="center" sx={{ py: 3, color: "gray" }}>
                                            No se encontraron datos para mostrar.
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[1, 5, 7]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};
