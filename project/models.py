from . import db

class Administrador(db.Model):
    __tablename__ = 'administradores'
    id = db.Column(db.Integer, primary_key=True)
    usuario = db.Column(db.String(50), unique=True, nullable=False)
    contrasena = db.Column(db.String(255), nullable=False)
    establecimientos = db.relationship('Establecimiento', backref='administrador', lazy=True)

class Establecimiento(db.Model):
    __tablename__ = 'establecimientos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    direccion = db.Column(db.String(255), nullable=False)
    latitud = db.Column(db.Numeric(precision=10, scale=8), nullable=False)
    longitud = db.Column(db.Numeric(precision=11, scale=8), nullable=False)
    descripcion = db.Column(db.String(500))
    tipo = db.Column(db.String(100))
    eliminado = db.Column(db.Boolean, default=False)
    administrador_id = db.Column(db.Integer, db.ForeignKey('administradores.id'), nullable=False)
    horarios = db.relationship('Horario', backref='establecimiento', lazy=True)

class Horario(db.Model):
    __tablename__ = 'horarios'
    id = db.Column(db.Integer, primary_key=True)
    establecimiento_id = db.Column(db.Integer, db.ForeignKey('establecimientos.id'), nullable=False)
    dia_semana = db.Column(db.String(20), nullable=False)
    hora_apertura = db.Column(db.Time, nullable=False)
    hora_cierre = db.Column(db.Time, nullable=False)
