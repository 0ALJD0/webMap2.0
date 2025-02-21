from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from sqlalchemy import func
class Administrador(db.Model):
    __tablename__ = 'administradores'
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(50), unique=True, nullable=False)
    contrasena_hash = db.Column(db.String(255), nullable=False)  # Ahora es obligatorio
    establecimientos = db.relationship('Establecimiento', backref='administrador', lazy=True)

    def set_contrasena(self, contrasena):
        """Genera un hash de la contraseña y lo almacena en contrasena_hash."""
        self.contrasena_hash = generate_password_hash(contrasena)

    def check_contrasena(self, contrasena):
        """Verifica si la contraseña proporcionada coincide con el hash almacenado."""
        return check_password_hash(self.contrasena_hash, contrasena)

# Tabla intermedia entre Establecimiento y Tipo_servicio
establecimiento_tipo_servicio = db.Table(
    'establecimiento_tipo_servicio',
    db.Column('establecimiento_id', db.Integer, db.ForeignKey('establecimientos.id'), primary_key=True),
    db.Column('tipo_servicio_id', db.Integer, db.ForeignKey('tipo_servicios.id'), primary_key=True)
)

# Tabla intermedia entre Establecimiento y Tipo_cocina
establecimiento_tipo_cocina = db.Table(
    'establecimiento_tipo_cocina',
    db.Column('establecimiento_id', db.Integer, db.ForeignKey('establecimientos.id'), primary_key=True),
    db.Column('tipo_cocina_id', db.Integer, db.ForeignKey('tipo_cocinas.id'), primary_key=True)
)

class Establecimiento(db.Model):
    __tablename__ = 'establecimientos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    direccion = db.Column(db.String(255), nullable=False)
    latitud = db.Column(db.Numeric(precision=10, scale=8), nullable=False)
    longitud = db.Column(db.Numeric(precision=11, scale=8), nullable=False)
    descripcion = db.Column(db.String(500))
    tipo = db.Column(db.String(100))
    tipo_servicio = db.relationship('Tipo_servicio', secondary=establecimiento_tipo_servicio, backref='establecimientos', lazy=True)
    tipo_cocina = db.relationship('Tipo_cocina', secondary=establecimiento_tipo_cocina, backref='establecimientos', lazy=True)
    numero_taza = db.Column(db.Integer, default=0)  
    numero_cubiertos = db.Column(db.Integer, default=0)  
    numero_copas = db.Column(db.Integer, default=0)  
    petfriendly = db.Column(db.Boolean, default=False)
    accesibilidad = db.Column(db.Boolean, default=False)
    eliminado = db.Column(db.Boolean, default=False)
    administrador_id = db.Column(db.Integer, db.ForeignKey('administradores.id'), nullable=False)
    horarios = db.relationship('Horario', backref='establecimiento', lazy=True)

class Tipo_servicio(db.Model):
    __tablename__ = 'tipo_servicios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), unique=True, nullable=False)
    
class Tipo_cocina(db.Model):
    __tablename__ = 'tipo_cocinas'
    id=db.Column(db.Integer,primary_key=True)
    nombre = db.Column(db.String(100), unique=True, nullable=False)

class Horario(db.Model):    
    __tablename__ = 'horarios'
    id = db.Column(db.Integer, primary_key=True)
    establecimiento_id = db.Column(db.Integer, db.ForeignKey('establecimientos.id'), nullable=False)
    dia_semana = db.Column(db.String(20), nullable=False)
    hora_apertura = db.Column(db.Time, nullable=False)
    hora_cierre = db.Column(db.Time, nullable=False)

class Chat(db.Model):
    __tablename__ = 'chats'
    id=db.Column(db.Integer, primary_key=True)
    mensaje=db.Column(db.String(500), nullable=False)
    fechayhora=db.Column(db.DateTime, nullable=False, server_default=func.now())

class Valoracion(db.Model):
    __tablename__ = 'valoraciones'
    id = db.Column(db.Integer, primary_key=True)
    puntuacion = db.Column(db.Integer, nullable=False)  # Puntuación de 1 a 5
    establecimiento_id = db.Column(db.Integer, db.ForeignKey('establecimientos.id'), nullable=False)
    nombre_anonimo = db.Column(db.String(100))  # Opcional, para un nombre anónimo
    comentario = db.Column(db.String(500))  # Opcional, para comentarios adicionales
    fecha = db.Column(db.DateTime, default=db.func.now())  # Fecha de la valoración

    # Relación con Establecimiento
    establecimiento = db.relationship('Establecimiento', backref='valoraciones')