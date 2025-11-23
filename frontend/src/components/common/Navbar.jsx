// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import {
    AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar, Box, Drawer, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import {
    Menu as MenuIcon, AccountCircle, ExitToApp, Dashboard, CalendarMonth, EventNote, Settings, Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login');
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Agendar Cita', icon: <CalendarMonth />, path: '/agendar-cita' },
        { text: 'Mis Citas', icon: <EventNote />, path: '/mis-citas' },
    ];

    const drawer = (
        <Box sx={{ width: 250 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Typography variant="h6">Menú</Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <Close />
                </IconButton>
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.text}
                        onClick={() => {
                            navigate(item.path);
                            handleDrawerToggle();
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={() => navigate('/dashboard')}
                    >
                        SGC - Sistema de Gestión de Citas
                    </Typography>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
                        <Button color="inherit" onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/agendar-cita')}>
                            Agendar Cita
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/mis-citas')}>
                            Mis Citas
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {user?.first_name} {user?.last_name}
                        </Typography>
                        <IconButton
                            size="large"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem disabled>
                            <Typography variant="body2">
                                {user?.email}
                            </Typography>
                        </MenuItem>
                        <MenuItem onClick={() => { handleClose(); navigate('/perfil'); }}>
                            <Settings sx={{ mr: 1 }} /> Mi Perfil
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ExitToApp sx={{ mr: 1 }} /> Cerrar Sesión
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Navbar;