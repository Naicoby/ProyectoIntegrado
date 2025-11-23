// src/api/citas.js
import axiosInstance from './axios';

export const citasAPI = {
    // Obtener todas las citas
    getAll: async (params = {}) => {
        const response = await axiosInstance.get('/citas/', { params });
        return response.data;
    },
    
    // Obtener una cita por ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/citas/${id}/`);
        return response.data;
    },
    
    // Crear nueva cita
    create: async (citaData) => {
        const response = await axiosInstance.post('/citas/', citaData);
        return response.data;
    },
    
    // Actualizar cita
    update: async (id, citaData) => {
        const response = await axiosInstance.put(`/citas/${id}/`, citaData);
        return response.data;
    },
    
    // Cancelar cita
    cancel: async (id, motivo) => {
        const response = await axiosInstance.post(`/citas/${id}/cancelar/`, { motivo });
        return response.data;
    },
    
    // Confirmar cita
    confirm: async (id) => {
        const response = await axiosInstance.post(`/citas/${id}/confirmar/`);
        return response.data;
    },
    
    // Obtener disponibilidad de profesional
    getDisponibilidad: async (profesionalId, fecha) => {
        const response = await axiosInstance.get(`/profesionales/${profesionalId}/disponibilidad/`, {
            params: { fecha }
        });
        return response.data;
    },
};