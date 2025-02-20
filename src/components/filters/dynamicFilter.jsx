"use client";
import { Controller, useForm } from "react-hook-form";
import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { LocalizationProvider } from "@mui/x-date-pickers";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { DynamicTable } from "@/components/tables/dynamicTable";
import { useEffect, useState } from "react";
import generateKey from "@/util/generateKey";
import { capitalize } from "@/util/formatter";

export const DynamicFilter = ({ filterConfig, rows, headOfColumns, accessToRows, handleModifyRows, bottonConfig = {} }) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: filterConfig.defaultValues,
    });

    const [filterRows, setFilterRows] = useState([]);

    useEffect(() => {
        setFilterRows(rows)
    }, [rows])
    

    const formReset = (e) => {
        reset();
        setFilterRows(rows);
    };

    const onSubmit = async (data) => {
        const { accessFilterValues } = filterConfig;
        let filtered = [...rows];

        accessFilterValues.forEach((access) => {
            if (data[access]) {
                filtered = filtered.filter(row => {
                    const rowValue = String(row[access]);
                    return rowValue === data[access];
                });
            }
        });

        setFilterRows(filtered);
    };

    const renderField = ({ name, label, required, type, options, inputWidth }) => (
        <Controller
            key={generateKey(name)}
            name={name}
            control={control}
            rules={
                required
                    ? { required: `${label} es obligatorio.` }
                    : {}
            }
            render={({ field, fieldState: { error } }) => {
                if (type === "date") {
                    return (
                        <DatePicker
                            label={label}
                            value={field.value ? dayjs(field.value, "YYYY/MM/DD") : null}
                            onChange={(newValue) => {
                                field.onChange(newValue ? newValue.format("YYYY/MM/DD") : null);
                            }}
                            render={(params) => (
                                <TextField
                                    {...params}
                                    size="small"
                                    error={!!error}
                                    helperText={error?.message || ""}
                                    sx={inputWidth ? { width: inputWidth } : { flex: 1 }}
                                />
                            )}
                        />
                    );
                }

                return (
                    <TextField
                        {...field}
                        label={label}
                        error={!!error}
                        helperText={error?.message || ""}
                        required={required}
                        size="medium"
                        select={type === "dropdownMenu"}
                        sx={inputWidth ? { width: inputWidth } : { flex: 1 }}
                    >
                        {type === "dropdownMenu" &&
                            options.map(({ value, label }) => (
                                <MenuItem key={generateKey(value)} value={value}>
                                    {capitalize(label)}
                                </MenuItem>
                            ))}
                    </TextField>
                );
            }}
        />
    );

    return (
        <>
            <Box display="flex" alignItems="left" sx={{ color: "#2f2467", my: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {filterConfig.filterName}
                </Typography>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                    <Box sx={{ m: 2 }}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            gap={2}
                            sx={{ mb: 4 }}
                        >
                            <Box display="flex" flex={1} gap={2}>

                                {filterConfig.inputs.map(renderField)}

                                <Button
                                    type="reset"
                                    variant="contained"
                                    color="warning"
                                    onClick={formReset}
                                    title="Restablecer filtros"
                                >
                                    <RestartAltIcon />
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    title="Aplicar filtros"
                                    sx={{ backgroundColor: "#5a3fd1", color: "white" }}
                                >
                                    <SearchIcon />
                                </Button>

                            </Box>
                        </Box>
                    </Box>
                </form>
            </LocalizationProvider>

            <DynamicTable
                rows={filterRows}
                headOfColumns={headOfColumns}
                accessToRows={accessToRows}
                bottonConfig={Object.keys(bottonConfig).length > 0 ? bottonConfig : null}
                handleModifyRows={handleModifyRows}
            />
        </>
    );
};
