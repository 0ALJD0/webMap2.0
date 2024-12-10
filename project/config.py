import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    OPENAI_API_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://usuario:contraseña@localhost:5432/nombre_de_base_de_datos'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_TYPE = 'filesystem'
