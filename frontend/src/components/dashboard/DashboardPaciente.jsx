// src/components/dashboard/DashboardPaciente.jsx
import React, { useEffect, useState } from 'react';
import {
    Grid, Card, CardContent, Typography, Box, Paper, Alert
} from '@mui/material';
import {
    CalendarMonth, EventNote, Cancel, CheckCircle, Warning
} from '@mui/icons-material';
import { useCitas } from '../../hooks/useCitas';
import { useAuth } from '../../hooks/useAuth';
import CitaCard from '../citas/CitaCard';
import Loading from '../common/Loading';

const DashboardPaciente = () => {
    const { user } = useAuth();
    const { citas, loading, fetchCitas, cancelarCita, confirmarCita } = useCitas();
    const [stats, setStats] = useState({
        total: 0,
        pendientes: 0,
        confirmadas: 0,
        completadas: 0
    });

    useEffect(() => {
        fetchCitas();
    }, []);

    useEffect(() => {
        if (citas.length > 0) {
            setStats({
                total: citas.length,
                pendientes: citas.filter(c => c.estado === 'pendiente').length,
                confirmadas: citas.filter(c => c.estado === 'confirmada').length,
                completadas: citas.filter(c => c.estado === 'completada').length
            });
        }
    }, [citas]);

    const proximasCitas = citas
        .filter(c => new Date(c.fecha_hora) >= new Date() && ['pendiente', 'confirmada'].includes(c.estado))
        .slice(0, 3);

    const handleCancelar = async (id, motivo) => {
        const result = await cancelarCita(id, motivo);
        if (result.success) {
            alert('Cita cancelada exitosamente');
            fetchCitas();
        } else {
            alert('Error: ' + result.error);
        }
    };

    const handleConfirmar = async (id) => {
        const result = await confirmarCita(id);
        if (result.success) {
            alert('Cita confirmada exitosamente');
            fetchCitas();
        } else {
            alert('Error: ' + result.error);
        }
    };

    if (loading) return <Loading />;

    return (
        <Box>
            {/* Estadísticas */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Total Citas
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.total}
                                    </Typography>
                                </Box>
                                <CalendarMonth sx={{ fontSize: 48, color: 'primary.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Pendientes
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.pendientes}
                                    </Typography>
                                </Box>
                                <Warning sx={{ fontSize: 48, color: 'warning.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Confirmadas
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.confirmadas}
                                    </Typography>
                                </Box>
                                <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography color="text.secondary" variant="body2">
                                        Completadas
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.completadas}
                                    </Typography>
                                </Box>
                                <EventNote sx={{ fontSize: 48, color: 'info.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Alertas */}
            {user?.bloqueado && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Tu cuenta está bloqueada por inasistencias. Contacta al administrador.
                </Alert>
            )}

            {/* Próximas Citas */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Próximas Citas
                </Typography>

                {proximasCitas.length === 0 ? (
                    <Alert severity="info">No tienes citas próximas agendadas</Alert>
                ) : (
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {proximasCitas.map((cita) => (
                            <Grid item xs={12} md={4} key={cita.id}>
                                <CitaCard
                                    cita={cita}
                                    onCancelar={handleCancelar}
                                    onConfirmar={handleConfirmar}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Box>
    );
};

export default DashboardPaciente;