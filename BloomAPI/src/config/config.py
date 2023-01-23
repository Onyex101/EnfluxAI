import os
from dotenv import load_dotenv

load_dotenv()

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SWAGGER = {
        'title': "Bloom Classification API",
        'uiversion': 3
    }

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopementConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.environ.get('LOCAL_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
