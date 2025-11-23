// src/components/citas/CitaForm.jsx
import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, MenuItem, Typography, Alert, Grid, Paper, Stepper, Step, StepLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { useCitas } from '../../hooks/useCitas';
import { ESPECIALIDADES, HORARIOS_ATENCION } from '../../utils/constants';

const steps = ['Seleccionar Especialidad', 'Seleccionar Profesional', 'Fecha y Hora', 'Motivo'];

const CitaForm = ({ onSuccess }) => {
    const { crearCita } = useCitas();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        especialidad: '',
        profesional: '',
        fecha: null,
        hora: '',
        motivo_consulta: ''
    });
    const [profesionales, setProfesionales] = useState([]);
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Simular carga de profesionales (deberías hacer una llamada a la API)
    useEffect(() => {
        if (formData.especialidad) {
            // TODO: Cargar profesionales por especialidad desde la API
            setProfesionales([
                { id: 1, nombre: 'Dr. Juan Pérez', especialidad: formData.especialidad },
                { id: 2, nombre: 'Dra. María González', especialidad: formData.especialidad }
            ]);
        }
    }, [formData.especialidad]);

    // Simular carga de horarios disponibles
    useEffect(() => {
        if (formData.profesional && formData.fecha) {
            // TODO: Cargar horarios disponibles desde la API
            setHorariosDisponibles(HORARIOS_ATENCION);
        }
    }, [formData.profesional, formData.fecha]);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setError('');
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        // Combinar fecha y hora
        const fechaHora = new Date(formData.fecha);
        const [horas, minutos] = formData.hora.split(':');
        fechaHora.setHours(parseInt(horas), parseInt(minutos));

        const citaData = {
            profesional: formData.profesional,
            fecha_hora: fechaHora.toISOString(),
            motivo_consulta: formData.motivo_consulta,
            duracion_minutos: 30
        };

        const result = await crearCita(citaData);
        
        if (result.success) {
            alert('¡Cita agendada exitosamente!');
            if (onSuccess) onSuccess();
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <TextField
                        fullWidth
                        select
                        label="Especialidad"
                        value={formData.especialidad}
                        onChange={(e) => handleChange('especialidad', e.target.value)}
                    >
                        {ESPECIALIDADES.map((esp) => (
                            <MenuItem key={esp} value={esp}>
                                {esp}
                            </MenuItem>
                        ))}
                    </TextField>
                );

            case 1:
                return (
                    <TextField
                        fullWidth
                        select
                        label="Profesional"
                        value={formData.profesional}
                        onChange={(e) => handleChange('profesional', e.target.value)}
                        disabled={!formData.especialidad}
                    >
                        {profesionales.map((prof) => (
                            <MenuItem key={prof.id} value={prof.id}>
                                {prof.nombre}
                            </MenuItem>
                        ))}
                    </TextField>
                );

            case 2:
                return (
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <DatePicker
                                    label="Fecha"
                                    value={formData.fecha}
                                    onChange={(newValue) => handleChange('fecha', newValue)}
                                    minDate={new Date()}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Hora"
                                    value={formData.hora}
                                    onChange={(e) => handleChange('hora', e.target.value)}
                                    disabled={!formData.fecha}
                                >
                                    {horariosDisponibles.map((hora) => (
                                        <MenuItem key={hora} value={hora}>
                                            {hora}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </LocalizationProvider>
                );

            case 3:
                return (
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Motivo de consulta"
                        value={formData.motivo_consulta}
                        onChange={(e) => handleChange('motivo_consulta', e.target.value)}
                        placeholder="Describe brevemente el motivo de tu consulta..."
                    />
                );

            default:
                return null;
        }
    };

    const isStepValid = () => {
        switch (activeStep) {
            case 0:
                return formData.especialidad !== '';
            case 1:
                return formData.profesional !== '';
            case 2:
                return formData.fecha && formData.hora !== '';
            case 3:
                return formData.motivo_consulta.trim() !== '';
            default:
                return false;
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                Agendar Nueva Cita
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ minHeight: 200, mb: 3 }}>
                {renderStepContent()}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                >
                    Atrás
                </Button>

                <Box>
                    {activeStep === steps.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={!isStepValid() || loading}
                        >
                            {loading ? 'Agendando...' : 'Agendar Cita'}
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!isStepValid()}
                        >
                            Siguiente
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default CitaForm;