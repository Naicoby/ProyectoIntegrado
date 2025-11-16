from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

class Usuario(AbstractUser):
    """
    Usuario base del sistema.
    Extiende AbstractUser de Django para aprovechar autenticación integrada.
    """
    TIPO_USUARIO_CHOICES = [
        ('PACIENTE', 'Paciente'),
        ('PROFESIONAL', 'Profesional'),
        ('ADMIN', 'Administrador'),
    ]
    
    # Campos adicionales
    telefono = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Formato: +56912345678')],
        help_text='Formato: +56912345678'
    )
    tipo_usuario = models.CharField(
        max_length=20,
        choices=TIPO_USUARIO_CHOICES,
        default='PACIENTE'
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-fecha_registro']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_tipo_usuario_display()})"


class Paciente(models.Model):
    """
    Modelo para pacientes del sistema.
    Relación 1:1 con Usuario.
    """
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='paciente'
    )
    rut = models.CharField(
        max_length=12,
        unique=True,
        validators=[RegexValidator(r'^\d{7,8}-[\dkK]$', 'Formato: 12345678-9')]
    )
    fecha_nacimiento = models.DateField()
    direccion = models.TextField(blank=True, null=True)
    
    # Control de inasistencias
    inasistencias_consecutivas = models.IntegerField(default=0)
    bloqueado = models.BooleanField(default=False)
    fecha_ultimo_bloqueo = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        verbose_name = 'Paciente'
        verbose_name_plural = 'Pacientes'
    
    def __str__(self):
        return f"{self.usuario.get_full_name()} - RUT: {self.rut}"


class Especialidad(models.Model):
    """
    Especialidades médicas disponibles en la clínica.
    """
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    duracion_consulta_minutos = models.IntegerField(
        default=30,
        help_text='Duración por defecto de la consulta en minutos'
    )
    activa = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Especialidad'
        verbose_name_plural = 'Especialidades'
        ordering = ['nombre']
    
    def __str__(self):
        return self.nombre


class Profesional(models.Model):
    """
    Modelo para profesionales de la salud.
    Relación 1:1 con Usuario.
    """
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='profesional'
    )
    especialidad = models.ForeignKey(
        Especialidad,
        on_delete=models.PROTECT,
        related_name='profesionales'
    )
    numero_registro = models.CharField(
        max_length=50,
        unique=True,
        help_text='Número de registro profesional'
    )
    
    # Duración personalizada (opcional, sobrescribe la de la especialidad)
    duracion_consulta_custom = models.IntegerField(
        null=True,
        blank=True,
        help_text='Si se especifica, sobrescribe la duración de la especialidad'
    )
    
    # Configuración de agenda
    atiende_lunes = models.BooleanField(default=True)
    atiende_martes = models.BooleanField(default=True)
    atiende_miercoles = models.BooleanField(default=True)
    atiende_jueves = models.BooleanField(default=True)
    atiende_viernes = models.BooleanField(default=True)
    atiende_sabado = models.BooleanField(default=False)
    atiende_domingo = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Profesional'
        verbose_name_plural = 'Profesionales'
    
    @property
    def duracion_consulta(self):
        """Retorna la duración de consulta (custom o de la especialidad)"""
        return self.duracion_consulta_custom or self.especialidad.duracion_consulta_minutos
    
    def __str__(self):
        return f"Dr(a). {self.usuario.get_full_name()} - {self.especialidad.nombre}"