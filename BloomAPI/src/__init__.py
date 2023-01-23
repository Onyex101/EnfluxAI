from flask import Flask, jsonify
import os
from dotenv import load_dotenv
from src.constants.http_status_codes import HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_200_OK
from flask_migrate import Migrate
from flasgger import Swagger, swag_from
from flask_cors import CORS, cross_origin
from src.config.config import ProductionConfig, DevelopementConfig
from src.config.swagger import swagger_config, template
from src.routes.bloom import bloom
from src.database.db import db

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app, support_credentials=True)
    app_env = os.environ.get('ENV')
    # print(f"ENVIROMENT: {app_env}")
    # print(f"SQL: {os.environ.get('LOCAL_DATABASE_URI')}")
    if (app_env == 'developement'):
        app.config.from_object(DevelopementConfig)
        # print(f"dev config loaded: {app.config}")
    else:
        app.config.from_object(ProductionConfig)
    db.app = app
    db.init_app(app)
    migrate = Migrate(app, db)
    app.register_blueprint(bloom)

    Swagger(app, config=swagger_config, template=template)

    @app.errorhandler(HTTP_404_NOT_FOUND)
    def handle_404(e):
        return jsonify({'error': 'Not found'}), HTTP_404_NOT_FOUND

    @app.errorhandler(HTTP_500_INTERNAL_SERVER_ERROR)
    def handle_500(e):
        return jsonify({'error': 'Something went wrong, we are working on it'}), HTTP_500_INTERNAL_SERVER_ERROR

    @app.get('/test')
    def hello_world():
        return jsonify({"message": "Hello Bloom!!!"}), HTTP_200_OK

    return app
