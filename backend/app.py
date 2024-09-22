from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from extensions import db 
from flask_migrate import Migrate
from config import Config
from sqlalchemy.exc import IntegrityError 
import os
from dotenv import load_dotenv
from marshmallow import ValidationError 


from models.user import User
from models.admin import Admin
from models.blog import Blog
from models.video import Video
from models.curso import Curso
from models.tag import Tag
from models.quiz_respuesta import QuizRespuesta
from models.quiz_pregunta import QuizPregunta
from sqlalchemy import create_engine

from schemas.user_schema import user_schema, users_schema
from schemas.admin_schema import admin_schema, admins_schema
from schemas.blog_schema import blog_schema, blogs_schema
from schemas.video_schema import video_schema, videos_schema
from schemas.curso_schema import curso_schema, cursos_schema
from schemas.quiz_pregunta_schema import quiz_pregunta_schema, quiz_preguntas_schema
from schemas.tag_schema import tag_schema, tags_schema
from schemas.quiz_respuesta_schema import quiz_respuesta_schema, quiz_respuestas_schema

load_dotenv()

app = Flask(__name__)
app.config.from_pyfile('config.py')

"""
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'app.sqlite')
"""
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')


db.init_app(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)

@app.route('/')

def home():
    return "EFL Companion"


# TODO buscar información sobre blueprints y/o como refactorizar

@app.route('/blog', methods=["POST"])
def create_blog():

    title = request.json.get('blog_title')
    content = request.json.get('blog_content')


    if not title or not content:
        return jsonify({"error": "Please check the required fields"}), 400
          
    try:
        new_blog = Blog(title, content)

        db.session.add(new_blog)
        db.session.commit()

        return jsonify({"message": "Blog created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    


@app.route('/video', methods=["POST"])
def create_video():

    title = request.json.get('video_title')
    content = request.json.get('video_content')
    url = request.json.get('video_url')


    if not title or not content:
        return jsonify({"error": "Please check the required fields"}), 400
          
    try:
        new_video = Video(title, content, url)

        db.session.add(new_video)
        db.session.commit()

        return jsonify({"message": "Video created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    


@app.route('/curso', methods=["POST"])
def create_curso():

    name = request.json.get('curso_name')
    description = request.json.get('curso_description')
    level = request.json.get('curso_level')

    if not name or not description or not level:
        return jsonify({"error": "Please check the required fields"}), 400
          
    try:
        new_curso = Curso(name, description, level)

        db.session.add(new_curso)
        db.session.commit()

        return jsonify({"message": "Curso created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    



@app.route('/pregunta', methods=["POST"])
def create_question():

    nivel = request.json.get('quiz_pregunta_nivel')
    pregunta = request.json.get('quiz_pregunta_contenido')


    if not nivel or not pregunta:
        return jsonify({"error": "Please check the required fields"}), 400
          
    try:
        new_question = QuizPregunta(nivel, pregunta)

        db.session.add(new_question)
        db.session.commit()    
        
        return jsonify({"message": "Question created successfully"}), 201


    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@app.route('/respuesta', methods=["POST"])
def create_answer():

    respuesta = request.json.get('quiz_respuesta_contenido')
    es_correcta = request.json.get('quiz_respuesta_correcta')
    respuesta_pregunta_id = request.json.get('quiz_respuesta_pregunta_id')
    respuesta_opcion = request.json.get('quiz_respuesta_opcion')

    if not respuesta or not es_correcta or not respuesta_pregunta_id or not respuesta_opcion:
        return jsonify({"error": "Please check the required fields"}), 400
          
    try:
        new_answer = QuizRespuesta(
            quiz_respuesta_contenido=respuesta,
            quiz_respuesta_correcta=es_correcta,
            quiz_respuesta_pregunta_id=respuesta_pregunta_id,
            quiz_respuesta_opcion=respuesta_opcion
        )

        db.session.add(new_answer)
        db.session.commit()

        return jsonify({"message": "Answer created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/register', methods=["POST"])
def register_user():

    name = request.json.get('user_name')
    email = request.json.get('user_email')
    password = request.json.get('user_pwd')

    if not name or not email or not password:
        return jsonify({"error": "Please check the required fields"}), 400
    
    try:  # hay que implementar aquí la validación, si no la validación del esquema no se aplica y la solicitud POST se crea igual aunque no se cumpla el criterio 
        data = {
            'user_name': name,
            'user_email': email,
            'user_pwd': password
        }
        
        validated_data = user_schema.load(data)
        
    except ValidationError as err:
        return jsonify(err.messages), 400  # Devuelve los errores de validación
    
    try:
        # Crear el nuevo usuario (la encriptación ocurre en el modelo)
        new_user = User(user_name=validated_data['user_name'], user_email=validated_data['user_email'], user_pwd=validated_data['user_pwd'])

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201

    except IntegrityError:
        db.session.rollback()  
        return jsonify({"error": "El email ya está registrado."}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/user', methods=["POST"])
def create_user():

    name = request.json.get('user_name')
    email = request.json.get('user_email')
    password = request.json.get('user_pwd')

    if not name or not email or not password:
        return jsonify({"error": "Please check the required fields"}), 400
    
    try:  # hay que implementar aquí la validación, si no la validación del esquema no se aplica y la solicitud post se crea igual aunque no se cumpla el criterio 
        data = {
            'user_name': name,
            'user_email': email,
            'user_pwd': password
        }
        
        validated_data = user_schema.load(data)
        
    except ValidationError as err:
        return jsonify({
            "error": "Validation failed",
            "fields": err.messages  # Para poder devolver el mensaje de error con el campo que falló
        }), 400
    
    try:
        new_user = User(user_name=validated_data['user_name'], user_email=validated_data['user_email'], user_pwd=validated_data['user_pwd'])

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201

    except IntegrityError:
        db.session.rollback()  
        return jsonify({"error": "El email ya está registrado."}), 400
          
    try:
        new_user = User(user_name=name,user_email=email,user_pwd= password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201
    
    except IntegrityError:
        db.session.rollback()  
        return jsonify({"error": "El email ya está registrado."}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/admin', methods=["POST"])
def create_admin():

    name = request.json.get('admin_name')
    email = request.json.get('admin_email')
    password = request.json.get('admin_pwd')
    role = request.json.get('admin_role')

    if not name or not email or not password or not role:
        return jsonify({"error": "Please check the required fields"}), 400

    try:  # hay que implementar aquí la validación, si no la validación del esquema no se aplica y la solicitud post se crea igual aunque no se cumpla el criterio 
        data = {
            'admin_name': name,
            'admin_email': email,
            'admin_pwd': password,
            'admin_role': role
        }
        
        validated_data = admin_schema.load(data)
        
    except ValidationError as err:
        return jsonify({
            "error": "Validation failed",
            "fields": err.messages  # Para poder devolver el mensaje de error con el campo que falló
        }), 400
    
          
    try:
        new_admin = Admin(admin_name=name,admin_email=email,admin_pwd= password, admin_role = role)

        db.session.add(new_admin)
        db.session.commit()

        return jsonify({"message": "Admin created successfully"}), 201

    except IntegrityError:
        db.session.rollback()  
        return jsonify({"error": "El email ya está registrado."}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/tag', methods=["POST"])
def assign_tag():

    tag_input = request.json.get('tag_name')
    resource_input = request.json.get('resource')
    resource_id_input = request.json.get('resource_id')

    if not tag_input or not resource_input or not resource_id_input:
        return jsonify({"error": "Please check the required fields"}), 400
    
    try:
        resource_id_input = int(resource_id_input)

    except ValueError:
        return jsonify({"error": "Resource ID must be an integer"}), 400

    try:

        tag = Tag.query.filter_by(tag_name=tag_input).first() #verifico q exista

        if not tag:
            tag = Tag(tag_name=tag_input)

        accepted_resources = {
            'curso': (Curso, 'tag_curso_id', 'curso_id'),
            'blog': (Blog, 'tag_blog_id', 'blog_id'),
            'video': (Video, 'tag_video_id', 'video_id'),
            'pregunta': (QuizPregunta, 'tag_quiz_pregunta_id', 'quiz_pregunta_id')
        }

        if resource_input not in accepted_resources:
            return jsonify({"error": "Invalid resource type"}), 400


        if resource_input == 'curso':
            curso = Curso.query.get(resource_id_input)
            if not curso:
                return jsonify({"error": "Curso not found"}), 404

            tag.tag_curso_id = curso.curso_id 


        elif resource_input == 'blog':
            blog = Blog.query.get(resource_id_input)
            if not blog:
                return jsonify({"error": "Blog not found"}), 404

            tag.tag_blog_id = blog.blog_id 

        
        elif resource_input == 'video':
            video = Video.query.get(resource_id_input)
            if not video:
                return jsonify({"error": "Video not found"}), 404

            tag.tag_video_id = video.video_id


        elif resource_input == 'pregunta':
            pregunta = QuizPregunta.query.get(resource_id_input)
            if not pregunta:
                return jsonify({"error": "Pregunta not found"}), 404

            tag.tag_quiz_pregunta_id = pregunta.quiz_pregunta_id
                    
        db.session.add(tag)
        db.session.commit()
        
        return jsonify({"message": "Tag added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# SOLICITUDES GET

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    from schemas.user_schema import user_schema
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user_schema.dump(user))

@app.route('/users', methods=['GET'])
def get_users():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    users = User.query.limit(limit).offset(offset).all()
    if not users:
        return jsonify({'error': 'No users found'}), 404  
    return jsonify(users_schema.dump(users))
#admin

@app.route('/admin/<int:admin_id>', methods=['GET'])
def get_admin(admin_id):
    from models.admin import Admin
    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404
    return jsonify(admin_schema.dump(admin))

@app.route('/admins', methods=['GET'])
def get_admins():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    admins = Admin.query.limit(limit).offset(offset).all()
    if not admins:
        return jsonify({'error': 'No admins found'}), 404  
    return jsonify(admins_schema.dump(admins))

#blog

@app.route('/blog/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
    from models.blog import Blog
    blog = Blog.query.get(blog_id)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    return jsonify(blog_schema.dump(blog))

@app.route('/blogs', methods=['GET'])
def get_blogs():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    blogs = Blog.query.limit(limit).offset(offset).all()
    if not blogs:
        return jsonify({'error': 'No blogs found'}), 404  
    return jsonify(blogs_schema.dump(blogs))
# video

@app.route('/video/<int:video_id>', methods=['GET'])
def get_video(video_id):
    from models.video import Video
    video = Video.query.get(video_id)
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    return  jsonify(video_schema.dump(video))



@app.route('/videos', methods=['GET'])
def get_videos():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    videos = Video.query.limit(limit).offset(offset).all()
    if not videos:
        return jsonify({'error': 'No videos found'}), 404  
    return  jsonify(videos_schema.dump(videos))

# curso

@app.route('/curso/<int:curso_id>', methods=['GET'])
def get_curso(curso_id):
    from models.curso import Curso
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Course not found'}), 404
    return jsonify(curso_schema.dump(curso))

@app.route('/cursos', methods=['GET'])
def get_cursos():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    cursos = Curso.query.limit(limit).offset(offset).all()
    if not cursos:
        return jsonify({'error': 'No courses found'}), 404  
    return jsonify(cursos_schema.dump(cursos))

# preguntas

@app.route('/pregunta/<int:quiz_pregunta_id>', methods=['GET'])
def get_pregunta(quiz_pregunta_id):
    from models.quiz_pregunta import QuizPregunta

    pregunta = QuizPregunta.query.get(quiz_pregunta_id)
    
    if not pregunta:
        return jsonify({'error': 'Question not found'}), 404
    return  jsonify(quiz_pregunta_schema.dump(pregunta))

@app.route('/preguntas', methods=['GET'])
def get_preguntas():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    preguntas = QuizPregunta.query.limit(limit).offset(offset).all()
    if not preguntas:
        return jsonify({'error': 'No questions found'}), 404  
    return jsonify(quiz_preguntas_schema.dump(preguntas))

# respuestas
@app.route('/respuesta/<int:quiz_respuesta_id>', methods=['GET'])
def get_quiz_respuesta(quiz_respuesta_id):
    from models.quiz_respuesta import QuizRespuesta
    respuesta = QuizRespuesta.query.get(quiz_respuesta_id)
    if not respuesta:
        return jsonify({'error': 'Answer not found'}), 404
    return jsonify(quiz_respuesta_schema.dump(respuesta))

@app.route('/respuestas', methods=['GET'])
def get_respuestas():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    respuestas = QuizRespuesta.query.limit(limit).offset(offset).all()
    if not respuestas:
        return jsonify({'error': 'No answers found'}), 404  
    return jsonify(quiz_respuestas_schema.dump(respuestas))

# tags

@app.route('/tag/<int:tag_id>', methods=['GET'])
def get_specific_tag(tag_id):
    from models.tag import Tag
    tag = Tag.query.get(tag_id)

    if not tag:
        return jsonify({'message': 'Tag not found'}), 404
    return jsonify(tag_schema.dump(tag))

@app.route('/tags/<int:resource_id>/tipo', methods=['GET']) 
def get_tags_by_quiz_pregunta(resource_id): 

    tipo = request.args.get('tipo')  
    
    if tipo == 'pregunta':
        tags = Tag.query.filter_by(tag_quiz_pregunta_id=resource_id).all()
        
    elif tipo == 'blog':
        tags = Tag.query.filter_by(tag_blog_id=resource_id).all() 
    
    elif tipo == 'video':
        tags = Tag.query.filter_by(tag_video_id=resource_id).all() 

    elif tipo == 'curso':
        tags = Tag.query.filter_by(tag_curso_id=resource_id).all() 
    
    else:
        return jsonify({'error': 'Tipo no válido'}), 400  # Manejar tipos no válidos

    if not tags: 
        return jsonify({'error': 'No tags found'}), 404 
    
    response = [
        {
            "tag_id": tag.tag_id,
            "tag_name": tag.tag_name,
            "resource_type": tipo  
        }
        for tag in tags
    ]

    return jsonify(response)  


# Delete

@app.route('/blog/<int:blog_id>', methods=["DELETE"])
def delete_blog(blog_id):
    try:
        blog = Blog.query.get(blog_id)
        if not blog:
            return jsonify({"error": "Blog not found"}), 404

        db.session.delete(blog)
        db.session.commit()

        return jsonify({"message": "Blog deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/blogs', methods=["DELETE"])
def delete_all_blogs():
    try:
        Blog.query.delete()
        db.session.commit()

        return jsonify({"message": "All blogs deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/video/<int:video_id>', methods=["DELETE"])
def delete_video(video_id):
    try:
        video = Video.query.get(video_id)
        if not video:
            return jsonify({"error": "Video not found"}), 404

        db.session.delete(video)
        db.session.commit()

        return jsonify({"message": "Video deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/videos', methods=["DELETE"])
def delete_all_videos():
    try:
        Video.query.delete()
        db.session.commit()

        return jsonify({"message": "All videos deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/curso/<int:curso_id>', methods=["DELETE"])
def delete_curso(curso_id):
    try:
        curso = Curso.query.get(curso_id)
        if not curso:
            return jsonify({"error": "Course not found"}), 404

        db.session.delete(curso)
        db.session.commit()

        return jsonify({"message": "Course deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/cursos', methods=["DELETE"])
def delete_all_cursos():
    try:
        Curso.query.delete()
        db.session.commit()

        return jsonify({"message": "All courses deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/pregunta/<int:quiz_pregunta_id>', methods=["DELETE"])
def delete_pregunta(quiz_pregunta_id):
    try:
        pregunta = QuizPregunta.query.get(quiz_pregunta_id)
        if not pregunta:
            return jsonify({"error": "Question not found"}), 404

        db.session.delete(pregunta)  # importante: funciona sólo si he marcado on cascade en el modelo de la pregunta, así aparece en la FK de la bd
        db.session.commit()

        return jsonify({"message": "Question and associated answers deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/preguntas', methods=["DELETE"])
def delete_all_preguntas():
    try:
        QuizPregunta.query.delete()
        db.session.commit()

        return jsonify({"message": "All questions deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/respuesta/<int:quiz_respuesta_id>', methods=["DELETE"])
def delete_respuesta(quiz_respuesta_id):
    try:
        respuesta = QuizRespuesta.query.get(quiz_respuesta_id)
        if not respuesta:
            return jsonify({"error": "Respuesta not found"}), 404

        db.session.delete(respuesta)
        db.session.commit()

        return jsonify({"message": "Respuesta deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/respuestas', methods=["DELETE"])
def delete_all_respuestas():
    try:
        QuizRespuesta.query.delete()
        db.session.commit()

        return jsonify({"message": "All respuestas deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/user/<int:user_id>', methods=["DELETE"])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/users', methods=["DELETE"])
def delete_all_users():
    try:
        User.query.delete()
        db.session.commit()

        return jsonify({"message": "All users deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/admin/<int:admin_id>', methods=["DELETE"])
def delete_admin(admin_id):
    try:
        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        db.session.delete(admin)
        db.session.commit()

        return jsonify({"message": "Admin deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/admins', methods=["DELETE"])
def delete_all_admins():
    try:
        Admin.query.delete()
        db.session.commit()

        return jsonify({"message": "All admins deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/tag/<int:tag_id>', methods=["DELETE"])
def delete_tag(tag_id):
    try:
        tag = Tag.query.get(tag_id)
        if not tag:
            return jsonify({"error": "Tag not found"}), 404

        db.session.delete(tag)
        db.session.commit()

        return jsonify({"message": "Tag deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/tags', methods=["DELETE"])
def delete_all_tags():
    try:
        Tag.query.delete()
        db.session.commit()

        return jsonify({"message": "All tags deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Put

@app.route('/blog/<int:blog_id>', methods=["PUT"])
def update_blog(blog_id):
    title = request.json.get('blog_title')
    content = request.json.get('blog_content')

    try:
        blog = Blog.query.get(blog_id)
        if not blog:
            return jsonify({"error": "Blog not found"}), 404

        # Solo actualiza los campos proporcionados en la solicitud
        if title:
            blog.blog_title = title
        if content:
            blog.blog_content = content

        db.session.commit()

        return jsonify({"message": "Blog updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@app.route('/video/<int:video_id>', methods=["PUT"])
def update_video(video_id):
    title = request.json.get('video_title')
    content = request.json.get('video_content')
    url = request.json.get('video_url')

    try:
        video = Video.query.get(video_id)
        if not video:
            return jsonify({"error": "Video not found"}), 404

        # Solo actualizar si se proporciona un valor en la solicitud
        if title:
            video.video_title = title
        if content:
            video.video_content = content
        if url:
            video.video_url = url

        db.session.commit()

        return jsonify({"message": "Video updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/curso/<int:curso_id>', methods=["PUT"])
def update_curso(curso_id):
    name = request.json.get('curso_name')
    description = request.json.get('curso_description')
    level = request.json.get('curso_level')

    try:
        curso = Curso.query.get(curso_id)
        if not curso:
            return jsonify({"error": "Curso not found"}), 404

        if name:
            curso.curso_name = name
        if description:
            curso.curso_description = description
        if level:
            curso.curso_level = level

        db.session.commit()
        return jsonify({"message": "Curso updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route('/pregunta/<int:quiz_pregunta_id>', methods=["PUT"])
def update_pregunta(quiz_pregunta_id):
    nivel = request.json.get('quiz_pregunta_nivel')
    pregunta = request.json.get('quiz_pregunta_contenido')

    try:
        question = QuizPregunta.query.get(quiz_pregunta_id)
        if not question:
            return jsonify({"error": "Pregunta not found"}), 404

        if nivel:
            question.quiz_pregunta_nivel = nivel
        if pregunta:
            question.quiz_pregunta_contenido = pregunta

        db.session.commit()
        return jsonify({"message": "Pregunta updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/respuesta/<int:quiz_respuesta_id>', methods=["PUT"])
def update_respuesta(quiz_respuesta_id):
    respuesta = request.json.get('quiz_respuesta_contenido')
    es_correcta = request.json.get('quiz_respuesta_correcta')
    respuesta_opcion = request.json.get('quiz_respuesta_opcion')

    try:
        answer = QuizRespuesta.query.get(quiz_respuesta_id)
        if not answer:
            return jsonify({"error": "Respuesta not found"}), 404

        if respuesta:
            answer.quiz_respuesta_contenido = respuesta
        if es_correcta is not None:  # Tener en cuenta que es_correcta puede ser False
            answer.quiz_respuesta_correcta = es_correcta
        if respuesta_opcion:
            answer.quiz_respuesta_opcion = respuesta_opcion

        db.session.commit()
        return jsonify({"message": "Respuesta updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/user/<int:user_id>', methods=["PUT"])
def update_user(user_id):
    name = request.json.get('user_name')
    email = request.json.get('user_email')
    password = request.json.get('user_pwd')

    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if name:
            user.user_name = name
        if email:
            user.user_email = email
        if password:
            user.user_pwd = password

        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/admin/<int:admin_id>', methods=["PUT"])
def update_admin(admin_id):
    name = request.json.get('admin_name')
    email = request.json.get('admin_email')
    password = request.json.get('admin_pwd')
    role = request.json.get('admin_role')

    try:
        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        if name:
            admin.admin_name = name
        if email:
            admin.admin_email = email
        if password:
            admin.admin_pwd = password
        if role:
            admin.admin_role = role

        db.session.commit()
        return jsonify({"message": "Admin updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/tag/<int:tag_id>', methods=["PUT"])
def update_tag(tag_id):
    tag_input = request.json.get('tag_name')

    try:
        tag = Tag.query.get(tag_id)
        if not tag:
            return jsonify({"error": "Tag not found"}), 404

        if tag_input:
            tag.tag_name = tag_input

        db.session.commit()
        return jsonify({"message": "Tag updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        app.run(debug=True)