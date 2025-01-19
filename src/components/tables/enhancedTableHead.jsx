"use client"

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Checkbox from '@mui/material/Checkbox';
import { visuallyHidden } from '@mui/utils';
import generateKey from '@/util/generateKey';



export const EnhancedTableHead = ({ order, orderBy, rowCount, onRequestSort, headOfColumns }) => {

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headOfColumns.map((columnHead) => (
                    <TableCell
                        key={generateKey(columnHead.id)}
                        align={"left"}
                        padding={'normal'}
                        sortDirection={orderBy === columnHead.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === columnHead.id}
                            direction={orderBy === columnHead.id ? order : 'asc'}
                            onClick={createSortHandler(columnHead.id)}
                        >
                            {columnHead.label}
                            {orderBy === columnHead.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};