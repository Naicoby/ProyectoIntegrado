// src/hooks/useCitas.js
import { useState, useEffect } from 'react';
import { citasAPI } from '../api/citas';

export const useCitas = () => {
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCitas = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await citasAPI.getAll(params);
            setCitas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const crearCita = async (citaData) => {
        try {
            const nuevaCita = await citasAPI.create(citaData);
            setCitas([...citas, nuevaCita]);
            return { success: true, data: nuevaCita };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const cancelarCita = async (id, motivo) => {
        try {
            await citasAPI.cancel(id, motivo);
            setCitas(citas.filter(c => c.id !== id));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const confirmarCita = async (id) => {
        try {
            await citasAPI.confirm(id);
            setCitas(citas.map(c => c.id === id ? { ...c, confirmada: true } : c));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return {
        citas,
        loading,
        error,
        fetchCitas,
        crearCita,
        cancelarCita,
        confirmarCita
    };
};