// src/utils/constants.js
export const ESTADOS_CITA = {
    PENDIENTE: 'pendiente',
    CONFIRMADA: 'confirmada',
    COMPLETADA: 'completada',
    CANCELADA: 'cancelada',
    NO_ASISTIO: 'no_asistio'
};

export const TIPOS_USUARIO = {
    PACIENTE: 'paciente',
    PROFESIONAL: 'profesional',
    ADMIN: 'admin'
};

export const ESPECIALIDADES = [
    'Medicina General',
    'Cardiología',
    'Dermatología',
    'Pediatría',
    'Ginecología',
    'Traumatología',
    'Oftalmología',
    'Psiquiatría',
    'Neurología',
    'Otorrinolaringología'
];

export const DIAS_SEMANA = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
];

export const HORARIOS_ATENCION = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];