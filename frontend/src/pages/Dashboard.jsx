// src/pages/Dashboard.jsx
import React from 'react';
import { Container } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import Layout from '../components/common/Layout';
import DashboardPaciente from '../components/dashboard/DashboardPaciente';
import DashboardProfesional from '../components/dashboard/DashboardProfesional';
import DashboardAdmin from '../components/dashboard/DashboardAdmin';

const Dashboard = () => {
    const { user } = useAuth();

    const renderDashboard = () => {
        switch (user?.tipo_usuario) {
            case 'profesional':
                return <DashboardProfesional />;
            case 'admin':
                return <DashboardAdmin />;
            case 'paciente':
            default:
                return <DashboardPaciente />;
        }
    };

    return (
        <Layout>
            <Container maxWidth="lg">
                {renderDashboard()}
            </Container>
        </Layout>
    );
};

export default Dashboard;