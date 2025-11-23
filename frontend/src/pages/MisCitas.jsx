// src/pages/MisCitas.jsx
import React from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import CitaList from '../components/citas/CitaList';

const MisCitas = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                sx={{ mb: 2 }}
            >
                Volver al Dashboard
            </Button>

            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Mis Citas Médicas
                </Typography>
            </Box>

            <CitaList />
        </Container>
    );
};

export default MisCitas;