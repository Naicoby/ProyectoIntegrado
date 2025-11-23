// src/components/common/Layout.jsx
import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 3 }}>
                {children}
            </Box>
            <Box 
                component="footer" 
                sx={{ 
                    py: 2, 
                    px: 2, 
                    mt: 'auto',
                    backgroundColor: (theme) => theme.palette.grey[200],
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="sm">
                    <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        © {new Date().getFullYear()} Sistema de Gestión de Citas - Todos los derechos reservados
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Layout;