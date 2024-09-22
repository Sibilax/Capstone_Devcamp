from extensions import db 
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    user_name = db.Column(db.String(125), nullable=False)
    user_email = db.Column(db.String(125), unique=True, nullable=False)
    user_pwd = db.Column(db.String(255), nullable=False)

    def __init__(self, user_name, user_email, user_pwd):
        self.user_name = user_name
        self.user_email = user_email
        self.set_password(user_pwd) # no olvidar para encriptar la contraseña, si no está en el constructor no se encripta, debo sustituir aquí user_pwd(que es la columna en la que se va almacenar)

    def set_password(self, password):
        self.user_pwd = generate_password_hash(password) # ese password parametro y arg es solo representativo de la contraseña q paso y que se almacena encriptada en self.user_pwd


    def check_password(self, password):
        return check_password_hash(self.user_pwd, password) #idem pero para verificar
            

    def __str__(self):
        return (f'User: {self.user_name}')

