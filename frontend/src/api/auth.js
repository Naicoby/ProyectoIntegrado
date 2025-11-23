// src/api/auth.js
import axiosInstance from './axios';

export const authAPI = {
    // Login
    login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login/', credentials);
        return response.data;
    },
    
    // Registro
    register: async (userData) => {
        const response = await axiosInstance.post('/usuarios/', userData);
        return response.data;
    },
    
    // Obtener perfil actual
    getProfile: async () => {
        const response = await axiosInstance.get('/auth/profile/');
        return response.data;
    },
    
    // Logout
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },
};