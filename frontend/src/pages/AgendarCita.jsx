// src/pages/AgendarCita.jsx
import React from 'react';
import { Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import CitaForm from '../components/citas/CitaForm';

const AgendarCita = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/mis-citas');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/dashboard')}
                sx={{ mb: 2 }}
            >
                Volver al Dashboard
            </Button>

            <CitaForm onSuccess={handleSuccess} />
        </Container>
    );
};

export default AgendarCita;