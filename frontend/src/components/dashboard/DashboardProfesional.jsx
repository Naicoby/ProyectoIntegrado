// src/components/dashboard/DashboardProfesional.jsx
import React, { useEffect, useState } from 'react';
import {
    Grid, Card, CardContent, Typography, Box, Paper, List, ListItem, ListItemText, Chip
} from '@mui/material';
import { People, EventAvailable, TrendingUp, Schedule } from '@mui/icons-material';
import { useCitas } from '../../hooks/useCitas';
import { formatDateTime } from '../../utils/helpers';
import Loading from '../common/Loading';

const DashboardProfesional = () => {
    const { citas, loading, fetchCitas } = useCitas();
    const [stats, setStats] = useState({
        citasHoy: 0,
        citasSemana: 0,
        pacientesAtendidos: 0,
        tasaAsistencia: 0
    });

    useEffect(() => {
        fetchCitas();
    }, []);

    useEffect(() => {
        if (citas.length > 0) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            const citasHoy = citas.filter(c => {
                const citaFecha = new Date(c.fecha_hora);
                citaFecha.setHours(0, 0, 0, 0);
                return citaFecha.getTime() === hoy.getTime();
            }).length;

            const citasCompletadas = citas.filter(c => c.estado === 'completada').length;
            const citasNoAsistio = citas.filter(c => c.estado === 'no_asistio').length;
            const tasa = citasCompletadas + citasNoAsistio > 0 
                ? (citasCompletadas / (citasCompletadas + citasNoAsistio) * 100).toFixed(1)
                : 0;

            setStats({
                citasHoy,
                citasSemana: citas.length,
                pacientesAtendidos: citasCompletadas,
                tasaAsistencia: tasa
            });
        }
    }, [citas]);

    const citasDeHoy = citas
        .filter(c => {
            const citaFecha = new Date(c.fecha_hora);
            const hoy = new Date();
            citaFecha.setHours(0, 0, 0, 0);
            hoy.setHours(0, 0, 0, 0);
            return citaFecha.getTime() === hoy.getTime();
        })
        .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

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
                                        Citas Hoy
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.citasHoy}
                                    </Typography>
                                </Box>
                                <EventAvailable sx={{ fontSize: 48, color: 'primary.main' }} />
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
                                        Esta Semana
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.citasSemana}
                                    </Typography>
                                </Box>
                                <Schedule sx={{ fontSize: 48, color: 'info.main' }} />
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
                                        Pacientes Atendidos
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.pacientesAtendidos}
                                    </Typography>
                                </Box>
                                <People sx={{ fontSize: 48, color: 'success.main' }} />
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
                                        Tasa Asistencia
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.tasaAsistencia}%
                                    </Typography>
                                </Box>
                                <TrendingUp sx={{ fontSize: 48, color: 'warning.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Agenda del día */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Agenda de Hoy
                </Typography>

                {citasDeHoy.length === 0 ? (
                    <Typography color="text.secondary">
                        No tienes citas programadas para hoy
                    </Typography>
                ) : (
                    <List>
                        {citasDeHoy.map((cita) => (
                            <ListItem key={cita.id} divider>
                                <ListItemText
                                    primary={`${cita.paciente?.first_name} ${cita.paciente?.last_name}`}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2">
                                                {formatDateTime(cita.fecha_hora)}
                                            </Typography>
                                            {' — '}
                                            <Typography component="span" variant="body2">
                                                {cita.motivo_consulta}
                                            </Typography>
                                        </>
                                    }
                                />
                                <Chip 
                                    label={cita.confirmada ? 'Confirmada' : 'Pendiente'}
                                    color={cita.confirmada ? 'success' : 'warning'}
                                    size="small"
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
};

export default DashboardProfesional;