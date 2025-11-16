1. 💻 Comandos de Configuración y Estructura Modular
(Ejecutar desde la raíz del proyecto sgc-proyecto-integrado/)

Bash

# === Estructura de Apps RESTful ===
# Crear estructura modular para usuarios (YA HECHO)
cd backend/apps/usuarios
mkdir views
mkdir urls
mkdir serializers
touch views/__init__.py
touch urls/__init__.py
touch serializers/__init__.py
touch urls/api.py
cd ../../..

# Crear estructura modular para citas (YA HECHO)
cd backend/apps/citas
mkdir views
mkdir urls
mkdir serializers
touch views/__init__.py
touch urls/__init__.py
touch serializers/__init__.py
touch urls/api.py
cd ../../..

# Crear estructura modular para notificaciones (YA HECHO)
cd backend/apps/notificaciones
mkdir views
mkdir urls
mkdir serializers
touch views/__init__.py
touch urls/__init__.py
touch serializers/__init__.py
touch urls/api.py
cd ../../..

# Crear estructura modular para reportes (YA HECHO)
cd backend/apps/reportes
mkdir views
mkdir urls
mkdir serializers
touch views/__init__.py
touch urls/__init__.py
touch serializers/__init__.py
touch urls/api.py
cd ../../..

# Crear router principal de las apps API (YA HECHO)
touch backend/apps/urls.py
2. 💾 Comandos de Sincronización Git
(Ejecutar desde la raíz del proyecto sgc-proyecto-integrado/)

Bash

# Agregar cambios al área de staging
git add .

# Confirmar los cambios
git commit -m "feat: Implementación de Serializer de Citas, lógica de validación, vistas de Agendamiento y Cancelación (Sprint 1)"

# Conectar al repositorio remoto (Naicoby/ProyectoIntegrado)
git remote add origin https://github.com/Naicoby/ProyectoIntegrado.git

# Subir los cambios
git push -u origin main
3. 🐍 Código Implementado (Sprint 1)
backend/apps/citas/models.py
Python

from django.db import models
from django.conf import settings
from apps.usuarios.models import Profesional, Paciente
from django.utils.translation import gettext_lazy as _

# --- Modelos de la App Citas ---

class Cita(models.Model):
    """
    Representa una cita médica agendada en el sistema.
    """
    paciente = models.ForeignKey(
        Paciente, 
        on_delete=models.PROTECT, 
        related_name='citas_agendadas',
        verbose_name=_("Paciente")
    )
    profesional = models.ForeignKey(
        Profesional, 
        on_delete=models.PROTECT, 
        related_name='agenda',
        verbose_name=_("Profesional")
    )
    
    fecha_hora_inicio = models.DateTimeField(verbose_name=_("Fecha y Hora de Inicio"))
    fecha_hora_fin = models.DateTimeField(verbose_name=_("Fecha y Hora de Fin"))

    ESTADO_CHOICES = [
        ('PENDIENTE', 'Pendiente de Confirmación'),
        ('CONFIRMADA', 'Confirmada'),
        ('CANCELADA', 'Cancelada por Paciente'),
        ('ANULADA_ADMIN', 'Anulada por Administración'),
        ('REALIZADA', 'Realizada (Asistió)'),
        ('NO_SHOW', 'Inasistencia (No Show)'),
    ]
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default='PENDIENTE',
        verbose_name=_("Estado de la Cita")
    )

    motivo_consulta = models.TextField(blank=True, null=True, verbose_name=_("Motivo de Consulta"))
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = _('Cita')
        verbose_name_plural = _('Citas')
        ordering = ['fecha_hora_inicio']
        constraints = [
            models.UniqueConstraint(
                fields=['profesional', 'fecha_hora_inicio'], 
                name='unique_cita_profesional_horario'
            )
        ]

    def __str__(self):
        return f"Cita con {self.profesional.usuario.get_full_name()} el {self.fecha_hora_inicio.strftime('%Y-%m-%d %H:%M')}"


class Inasistencia(models.Model):
    """
    Registro detallado de una inasistencia (No Show) para efectos de auditoría.
    """
    cita = models.OneToOneField(
        Cita,
        on_delete=models.CASCADE,
        related_name='registro_inasistencia',
        verbose_name=_("Cita No Show")
    )
    paciente = models.ForeignKey(
        Paciente,
        on_delete=models.CASCADE,
        related_name='historial_inasistencias',
        verbose_name=_("Paciente")
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)
    motivo_registro = models.CharField(
        max_length=100,
        default='No se presentó a la hora de la cita',
        verbose_name=_("Motivo")
    )

    class Meta:
        verbose_name = _('Inasistencia')
        verbose_name_plural = _('Inasistencias')
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"No Show: {self.paciente.usuario.get_full_name()} - Cita ID: {self.cita.id}"
backend/apps/citas/serializers/serializers.py(Agenda)
Python

from rest_framework import serializers
from apps.citas.models import Cita
from apps.usuarios.models import Profesional, Paciente
from django.utils import timezone
from datetime import timedelta
from django.db import transaction

class CitaSerializer(serializers.ModelSerializer):
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    paciente_nombre = serializers.CharField(source='paciente.usuario.get_full_name', read_only=True)
    profesional_nombre = serializers.CharField(source='profesional.usuario.get_full_name', read_only=True)

    class Meta:
        model = Cita
        fields = [
            'id', 'paciente', 'profesional', 'fecha_hora_inicio', 'fecha_hora_fin', 
            'motivo_consulta', 'estado', 'fecha_creacion',
            'estado_display', 'paciente_nombre', 'profesional_nombre'
        ]
        read_only_fields = ['id', 'estado', 'fecha_creacion', 'fecha_hora_fin']
        
    def validate(self, data):
        """
        HU-004: Valida la disponibilidad, bloqueo de paciente y hora válida.
        """
        paciente = data.get('paciente')
        profesional = data.get('profesional')
        fecha_hora_inicio = data.get('fecha_hora_inicio')
        
        # 1. Validar que la cita sea en el futuro
        if fecha_hora_inicio < timezone.now():
            raise serializers.ValidationError("No se pueden agendar citas en el pasado.")

        # 2. Validación de Bloqueo por Inasistencias (HU-002)
        if paciente.bloqueado:
            raise serializers.ValidationError(
                f"El paciente {paciente.usuario.get_full_name()} está bloqueado por acumular inasistencias. Contacte a administración."
            )
            
        # 3. Validación de Duración y Cálculo de fecha_hora_fin
        duracion_minutos = profesional.duracion_consulta 
        fecha_hora_fin_calculada = fecha_hora_inicio + timedelta(minutes=duracion_minutos)
        data['fecha_hora_fin'] = fecha_hora_fin_calculada

        # 4. Validación de Disponibilidad del Profesional (HU-004)
        superposicion_existente = Cita.objects.filter(
            profesional=profesional,
            fecha_hora_inicio__lt=fecha_hora_fin_calculada,
            fecha_hora_fin__gt=fecha_hora_inicio,
            estado__in=['PENDIENTE', 'CONFIRMADA']
        ).exists()
        
        if superposicion_existente:
            raise serializers.ValidationError(
                "Este horario ya está ocupado. Por favor, seleccione otro horario disponible."
            )
            
        return data

    @transaction.atomic
    def create(self, validated_data):
        """
        HU-001: Crea la cita en la base de datos de forma transaccional.
        """
        cita = Cita.objects.create(**validated_data)
        return cita
backend/apps/citas/views/agendamiento.py
Python

from rest_framework import generics, permissions
from apps.citas.models import Cita
from apps.citas.serializers.serializers import CitaSerializer
from apps.usuarios.models import Paciente

class AgendarCitaAPIView(generics.CreateAPIView):
    """
    Vista de API para que un paciente autenticado agende una nueva cita.
    """
    serializer_class = CitaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        
        try:
            paciente = user.paciente 
        except Paciente.DoesNotExist:
            raise permissions.PermissionDenied("Solo los usuarios tipo Paciente pueden agendar citas.")
            
        if serializer.validated_data['paciente'] != paciente:
            raise permissions.PermissionDenied("No puedes agendar citas a nombre de otro paciente.")

        serializer.save()
backend/apps/citas/serializers/cancelacion.py
Python

from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from apps.citas.models import Cita
from django.http import Http404

class CancelacionCitaSerializer(serializers.Serializer):
    """
    Serializador para validar la cancelación de una cita basada en la regla de tiempo.
    """
    cita_id = serializers.IntegerField(write_only=True)
    
    def validate_cita_id(self, value):
        try:
            cita = Cita.objects.get(id=value)
        except Cita.DoesNotExist:
            raise serializers.ValidationError("La cita no existe.")
            
        self.instance = cita 
        
        # Tiempo mínimo de anticipación (24 horas)
        limite_cancelacion = cita.fecha_hora_inicio - timedelta(hours=24)
        
        if timezone.now() >= limite_cancelacion:
            raise serializers.ValidationError(
                "La cancelación debe realizarse con al menos 24 horas de anticipación."
            )
            
        # Verificar estado (solo cancelar si está PENDIENTE o CONFIRMADA)
        if cita.estado not in ['PENDIENTE', 'CONFIRMADA']:
            raise serializers.ValidationError(f"La cita no puede ser cancelada en su estado actual: {cita.estado}.")

        return value
backend/apps/citas/views/cancelacion.py
Python

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from apps.citas.serializers.cancelacion import CancelacionCitaSerializer
from apps.citas.models import Cita
from django.http import Http404 # Necesario para get_object

class CancelarCitaAPIView(generics.UpdateAPIView):
    """
    Permite al paciente cancelar una cita validando la regla de 24 horas de anticipación.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CancelacionCitaSerializer
    queryset = Cita.objects.all() # Necesario para UpdateAPIView

    def get_object(self):
        # Usaremos el ID pasado en la URL (pk) para obtener la cita a cancelar
        try:
            return Cita.objects.get(id=self.kwargs['pk'])
        except Cita.DoesNotExist:
            raise Http404

    def update(self, request, *args, **kwargs):
        cita = self.get_object()
        serializer = self.get_serializer(data={'cita_id': cita.id})

        # Paso 1: Validar las reglas de cancelación (regla de 24h)
        serializer.is_valid(raise_exception=True)
        
        # Paso 2: Ejecutar la cancelación y el guardado
        cita.estado = 'CANCELADA'
        cita.save()
        
        return Response(
            {"detail": "Cita cancelada exitosamente y horario liberado.", "cita_id": cita.id}, 
            status=status.HTTP_200_OK
        )
backend/apps/citas/urls/api.py
Python

from django.urls import path
from apps.citas.views.agendamiento import AgendarCitaAPIView
from apps.citas.views.cancelacion import CancelarCitaAPIView

# URLs específicas de la aplicación 'citas'
urlpatterns = [
    # HU-001 y HU-004 (Agendamiento)
    path('agendar/', AgendarCitaAPIView.as_view(), name='agendar_cita'),
    
    # HU-001-3 (Cancelación) - Usa el ID de la cita en la URL
    path('cancelar/<int:pk>/', CancelarCitaAPIView.as_view(), name='cancelar_cita'),
]
backend/apps/urls.py(Router Principal)
Python

from django.urls import path, include

urlpatterns = [
    # Enlaza las URLs de autenticación/registro de usuarios (JWT)
    path('usuarios/', include('apps.usuarios.urls.api')),
    
    # Enlaza las URLs de agendamiento/cancelación de citas
    path('citas/', include('apps.citas.urls.api')),
]
💡 README.md (Resumen del Proyecto)
Markdown

# 🏥 Proyecto Integrado: Sistema de Gestión de Citas Médicas (SGC)

## 🎯 Objetivo del Proyecto

El **Sistema de Gestión de Citas Médicas (SGC)** es una aplicación web integral diseñada para digitalizar y automatizar el proceso de agendamiento y gestión de la disponibilidad de citas en una clínica de salud. El objetivo principal es optimizar el control de agendas, **reducir las inasistencias ("No Show")** mediante bloqueos automáticos, y generar reportes en tiempo real.

## 💻 Arquitectura y Stack Tecnológico

| Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | **ReactJS** | Interfaz de usuario dinámica y responsive. |
| **Backend** | **Python con Django** | Lógica de negocio y exposición de la **API RESTful**. |
| **Base de Datos** | **MySQL 8.0** (Vía Docker) | Persistencia de datos, con modelo de datos centrado en Usuario, Profesional y Cita. |
| **Tareas Asíncronas** | **Celery & Redis** (Vía Docker) | Procesamiento de tareas asíncronas, como el envío de notificaciones y recordatorios. |
| **Metodología** | **Scrum** | Desarrollo gestionado por Sprints de 2 semanas. |

---

## 🚀 Estado Actual (Sprint 1)

El proyecto se encuentra en la fase inicial de desarrollo (Sprint 1), centrado en las funcionalidades **"Must Have"** del MVP:

### Funcionalidades Implementadas (Base de la API):

* **Estructura Modular:** Estructura de código de Django organizada por aplicaciones (`usuarios`, `citas`, `notificaciones`, `reportes`) con subcarpetas para `views/`, `urls/`, y `serializers/`.
* **Modelos Core:** Implementación de modelos clave para **`Usuario`**, **`Paciente`**, **`Profesional`** y **`Cita`**.
* **Autenticación JWT:** Endpoints de login y refresh token implementados en `apps/usuarios/` mediante Simple JWT.
* **Agendamiento de Citas (HU-001/HU-004):**
    * **Serializador de Citas** con validación en el lado del servidor.
    * **Validación de Disponibilidad:** Lógica implementada para evitar superposiciones de horarios (**Doble Reserva**).
    * **Control de Bloqueo:** Validación que impide agendar citas si el paciente está **bloqueado por inasistencias**.
* **Cancelación de Citas (HU-001-3):** Endpoint y lógica implementada para cancelar citas, aplicando la regla de negocio de **24 horas de anticipación**.

### Tareas Pendientes (Próximos Pasos):

* **Gestión de Disponibilidad (HU-003):** Implementar modelos y vistas para que el profesional de la salud pueda gestionar sus horarios disponibles y bloqueos.
* **Pruebas Unitarias:** Creación de tests formales para validar la lógica del Serializer de Citas.
* **Notificaciones Asíncronas (HU-005):** Integración completa de Celery/Redis para el envío de recordatorios 24h antes.

---

## 🛠️ Guía de Instalación Rápida

1.  **Clonar el Repositorio:** `git clone https://github.com/Naicoby/ProyectoIntegrado.git`
2.  **Levantar Contenedores (Docker Desktop Requerido):** `docker-compose up -d`
3.  **Configurar Backend e Instalar Dependencias:**
    * `cd backend`
    * `python -m venv venv`
    * `.\venv\Scripts\Activate.ps1` (Windows) o `source venv/bin/activate` (Mac/Linux)
    * `pip install -r requirements/base.txt`
4.  **Aplicar Migraciones y Crear Superusuario:**
    * `python manage.py makemigrations`
    * `python manage.py migrate --settings=config.settings.development`
    * `python manage.py createsuperuser --settings=config.settings.development`
5.  **Correr el Servidor de Desarrollo:**
    * `python manage.py runserver --settings=config.settings.development`
    * *(Accede a la API en `http://localhost:8000/api/v1/...`)*
