// src/components/dashboard/DashboardAdmin.jsx
import React, { useEffect, useState } from 'react';
import {
    Grid, Card, CardContent, Typography, Box, Paper
} from '@mui/material';
import {
    People, EventNote, Block, CheckCircle
} from '@mui/icons-material';
import { useCitas } from '../../hooks/useCitas';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Loading from '../common/Loading';

const DashboardAdmin = () => {
    const { citas, loading, fetchCitas } = useCitas();
    const [stats, setStats] = useState({
        totalCitas: 0,
        citasHoy: 0,
        pacientesBloqueados: 0,
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

            const completadas = citas.filter(c => c.estado === 'completada').length;
            const noAsistio = citas.filter(c => c.estado === 'no_asistio').length;
            const tasa = completadas + noAsistio > 0 
                ? (completadas / (completadas + noAsistio) * 100).toFixed(1)
                : 0;

            setStats({
                totalCitas: citas.length,
                citasHoy,
                pacientesBloqueados: 0, // TODO: Obtener desde API
                tasaAsistencia: tasa
            });
        }
    }, [citas]);

    // Datos de ejemplo para el gráfico
    const chartData = [
        { name: 'Lun', citas: 12 },
        { name: 'Mar', citas: 19 },
        { name: 'Mié', citas: 15 },
        { name: 'Jue', citas: 22 },
        { name: 'Vie', citas: 18 },
        { name: 'Sáb', citas: 8 },
    ];

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
                                        {stats.totalCitas}
                                    </Typography>
                                </Box>
                                <EventNote sx={{ fontSize: 48, color: 'primary.main' }} />
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
                                        Citas Hoy
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.citasHoy}
                                    </Typography>
                                </Box>
                                <People sx={{ fontSize: 48, color: 'info.main' }} />
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
                                        Usuarios Bloqueados
                                    </Typography>
                                    <Typography variant="h4">
                                        {stats.pacientesBloqueados}
                                    </Typography>
                                </Box>
                                <Block sx={{ fontSize: 48, color: 'error.main' }} />
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
                                <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Gráfico de citas */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Citas de la Semana
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="citas" stroke="#1976d2" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default DashboardAdmin;