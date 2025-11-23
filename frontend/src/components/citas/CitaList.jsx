// src/components/citas/CitaList.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Typography, Alert, Tabs, Tab, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import CitaCard from './CitaCard';
import Loading from '../common/Loading';
import { useCitas } from '../../hooks/useCitas';
import { ESTADOS_CITA } from '../../utils/constants';

const CitaList = () => {
    const { citas, loading, error, fetchCitas, cancelarCita, confirmarCita } = useCitas();
    const [filtroEstado, setFiltroEstado] = useState('todas');
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        fetchCitas();
    }, []);

    const handleCancelar = async (id, motivo) => {
        const result = await cancelarCita(id, motivo);
        if (result.success) {
            alert('Cita cancelada exitosamente');
            fetchCitas();
        } else {
            alert('Error al cancelar: ' + result.error);
        }
    };

    const handleConfirmar = async (id) => {
        const result = await confirmarCita(id);
        if (result.success) {
            alert('Cita confirmada exitosamente');
            fetchCitas();
        } else {
            alert('Error al confirmar: ' + result.error);
        }
    };

    const filtrarCitas = () => {
        let citasFiltradas = citas;

        // Filtrar por estado
        if (filtroEstado !== 'todas') {
            citasFiltradas = citasFiltradas.filter(c => c.estado === filtroEstado);
        }

        // Filtrar por fecha (próximas o pasadas)
        const ahora = new Date();
        if (tabValue === 0) {
            // Próximas citas
            citasFiltradas = citasFiltradas.filter(c => new Date(c.fecha_hora) >= ahora);
        } else {
            // Citas pasadas
            citasFiltradas = citasFiltradas.filter(c => new Date(c.fecha_hora) < ahora);
        }

        return citasFiltradas;
    };

    const citasFiltradas = filtrarCitas();

    if (loading) return <Loading message="Cargando citas..." />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                    <Tab label="Próximas Citas" />
                    <Tab label="Citas Pasadas" />
                </Tabs>
            </Box>

            <Box sx={{ mb: 3 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Filtrar por estado</InputLabel>
                    <Select
                        value={filtroEstado}
                        label="Filtrar por estado"
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <MenuItem value="todas">Todas</MenuItem>
                        <MenuItem value={ESTADOS_CITA.PENDIENTE}>Pendientes</MenuItem>
                        <MenuItem value={ESTADOS_CITA.CONFIRMADA}>Confirmadas</MenuItem>
                        <MenuItem value={ESTADOS_CITA.COMPLETADA}>Completadas</MenuItem>
                        <MenuItem value={ESTADOS_CITA.CANCELADA}>Canceladas</MenuItem>
                        <MenuItem value={ESTADOS_CITA.NO_ASISTIO}>No Asistió</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {citasFiltradas.length === 0 ? (
                <Alert severity="info">No hay citas para mostrar</Alert>
            ) : (
                <Grid container spacing={3}>
                    {citasFiltradas.map((cita) => (
                        <Grid item xs={12} md={6} lg={4} key={cita.id}>
                            <CitaCard
                                cita={cita}
                                onCancelar={handleCancelar}
                                onConfirmar={handleConfirmar}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default CitaList;