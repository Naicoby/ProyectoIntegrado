// src/components/citas/CitaCard.jsx
import React from 'react';
import {
    Card, CardContent, CardActions, Typography, Box, Chip, Button, Divider
} from '@mui/material';
import {
    CalendarMonth, AccessTime, Person, LocalHospital, Cancel, CheckCircle
} from '@mui/icons-material';
import { formatDateTime, getEstadoColor, getEstadoLabel } from '../../utils/helpers';

const CitaCard = ({ cita, onCancelar, onConfirmar, showActions = true }) => {
    const handleCancelar = () => {
        if (window.confirm('¿Estás seguro de cancelar esta cita?')) {
            const motivo = prompt('Ingresa el motivo de cancelación:');
            if (motivo) {
                onCancelar(cita.id, motivo);
            }
        }
    };

    const handleConfirmar = () => {
        if (window.confirm('¿Confirmas tu asistencia a esta cita?')) {
            onConfirmar(cita.id);
        }
    };

    const puedeConfirmar = cita.estado === 'pendiente';
    const puedeCancelar = ['pendiente', 'confirmada'].includes(cita.estado);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip 
                        label={getEstadoLabel(cita.estado)}
                        color={getEstadoColor(cita.estado)}
                        size="small"
                    />
                    {cita.confirmada && (
                        <Chip 
                            label="Confirmada"
                            color="success"
                            size="small"
                            icon={<CheckCircle />}
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarMonth sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                        {formatDateTime(cita.fecha_hora)}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                        {cita.profesional?.usuario?.first_name} {cita.profesional?.usuario?.last_name}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocalHospital sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        {cita.profesional?.especialidad}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                        Duración: {cita.duracion_minutos} minutos
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Motivo:</strong>
                </Typography>
                <Typography variant="body2">
                    {cita.motivo_consulta}
                </Typography>

                {cita.observaciones && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Observaciones:</strong>
                        </Typography>
                        <Typography variant="body2">
                            {cita.observaciones}
                        </Typography>
                    </Box>
                )}
            </CardContent>

            {showActions && (
                <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    {puedeConfirmar && (
                        <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={handleConfirmar}
                        >
                            Confirmar
                        </Button>
                    )}
                    {puedeCancelar && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={handleCancelar}
                        >
                            Cancelar
                        </Button>
                    )}
                </CardActions>
            )}
        </Card>
    );
};

export default CitaCard;