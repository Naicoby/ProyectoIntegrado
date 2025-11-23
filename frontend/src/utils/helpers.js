// src/utils/helpers.js
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear fecha
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: es });
};

// Formatear fecha y hora
export const formatDateTime = (date) => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, "dd/MM/yyyy 'a las' HH:mm", { locale: es });
};

// Validar RUT chileno
export const validarRUT = (rut) => {
    if (!/^\d{7,8}-[0-9kK]$/.test(rut)) return false;
    
    const [nums, dv] = rut.split('-');
    let suma = 0;
    let multiplo = 2;
    
    for (let i = nums.length - 1; i >= 0; i--) {
        suma += parseInt(nums[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'k' : dvEsperado.toString();
    
    return dv.toLowerCase() === dvCalculado;
};

// Formatear RUT
export const formatearRUT = (rut) => {
    const cleaned = rut.replace(/[^0-9kK]/g, '');
    if (cleaned.length <= 1) return cleaned;
    
    const dv = cleaned.slice(-1);
    const nums = cleaned.slice(0, -1);
    
    return `${nums}-${dv}`;
};

// Obtener color según estado de cita
export const getEstadoColor = (estado) => {
    const colores = {
        pendiente: 'warning',
        confirmada: 'info',
        completada: 'success',
        cancelada: 'error',
        no_asistio: 'error'
    };
    return colores[estado] || 'default';
};

// Obtener etiqueta legible del estado
export const getEstadoLabel = (estado) => {
    const labels = {
        pendiente: 'Pendiente',
        confirmada: 'Confirmada',
        completada: 'Completada',
        cancelada: 'Cancelada',
        no_asistio: 'No Asistió'
    };
    return labels[estado] || estado;
};

// Validar teléfono chileno
export const validarTelefono = (telefono) => {
    return /^\+?56?9\d{8}$/.test(telefono);
};

// Calcular tiempo restante hasta una fecha
export const tiempoRestante = (fechaFutura) => {
    const ahora = new Date();
    const fecha = typeof fechaFutura === 'string' ? parseISO(fechaFutura) : fechaFutura;
    const diff = fecha - ahora;
    
    if (diff < 0) return 'Ya pasó';
    
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (dias > 0) return `En ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `En ${horas} hora${horas > 1 ? 's' : ''}`;
    return 'Muy pronto';
};