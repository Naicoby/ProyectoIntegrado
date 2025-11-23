import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress,
    MenuItem
} from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
        rut: '',
        telefono: '',
        tipo_usuario: 'paciente'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones
        if (formData.password !== formData.password2) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        const result = await register(formData);
        
        if (result.success) {
            alert('Registro exitoso. Por favor inicia sesión.');
            navigate('/login');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ marginTop: 4, marginBottom: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <LocalHospital sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                        <Typography component="h1" variant="h4" gutterBottom>
                            Registro de Usuario
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                required fullWidth
                                label="Nombre"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <TextField
                                required fullWidth
                                label="Apellido"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <TextField
                                required fullWidth
                                label="RUT"
                                name="rut"
                                placeholder="12345678-9"
                                value={formData.rut}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <TextField
                                required fullWidth
                                label="Teléfono"
                                name="telefono"
                                placeholder="+56912345678"
                                value={formData.telefono}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <TextField
                                required fullWidth
                                label="Usuario"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <TextField
                                required fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <TextField
                                required fullWidth
                                label="Contraseña"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <TextField
                                required fullWidth
                                label="Confirmar Contraseña"
                                name="password2"
                                type="password"
                                value={formData.password2}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Box>
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Registrarse'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2">
                                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                            </Typography>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;