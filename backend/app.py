
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from config import Config
from flask_cors import CORS 
from extensions import db
from controllers import (
    user_bp, blog_bp, curso_bp, video_bp, login_bp, admin_bp,
    respuesta_bp, pregunta_bp, searchbar_bp, tag_bp
)

load_dotenv()

app = Flask(__name__)

app.config.from_object(Config)
app.config['JWT_ALGORITHM'] = 'HS256'
CORS(app)
db.init_app(app)

ma = Marshmallow(app)
migrate = Migrate(app, db)
jwt = JWTManager(app) 



blueprints = [
    tag_bp, user_bp, blog_bp, curso_bp, video_bp, login_bp, 
    admin_bp, respuesta_bp, pregunta_bp, searchbar_bp
]

for bp in blueprints:
    app.register_blueprint(bp)

    
@app.route('/')
def home():
    return "EFL Companion"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        app.run(debug=True) 

         #TODO DESACTIVAR PARA PRODUCCIÖN USANDO  app.run(debug=False) 
         #TODO IMPORTANTE: Configurar variables de entorno
         #TODO CORREGIR MENSAJES DE ERROR 
         #TODO INVESTIGAR: Protección CSRF (Cross-Site Request Forgery)
         #TODO CORS (Cross-Origin Resource Sharing) EDITAR AL DOMINIO DE PRODUCCIÓN y desde el front


