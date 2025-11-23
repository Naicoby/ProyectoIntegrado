import React from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CalendarMonth, EventNote, Person, ExitToApp } from '@mui/icons-material';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1">
                    Dashboard - Sistema de Gestión de Citas
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<ExitToApp />}
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </Button>
            </Box>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Bienvenido, {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Tipo de usuario: <strong>{user?.tipo_usuario}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Email: {user?.email}
                </Typography>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/agendar-cita')}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <CalendarMonth sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Agendar Cita
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Reserva una nueva cita médica
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => navigate('/mis-citas')}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <EventNote sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Mis Citas
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ver y gestionar tus citas
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Person sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Mi Perfil
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Actualiza tu información
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;