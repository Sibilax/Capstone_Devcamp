from flask import Blueprint, request, jsonify
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError

from models.blog import Blog  
from models.video import Video 
from models.tag import Tag 

searchbar_bp = Blueprint('searchbar', __name__)


@searchbar_bp.route('/search', methods=['GET'])  # http://localhost:5000/search?query=english&nivel=B2&limit=10&offset=0
def searchbar():
    # primero necesito los parámetros de búsqueda
    query = request.args.get('query')  # Ej: "english", "blog", "video"
    nivel = request.args.get('nivel')  # Ej: "B2"
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)
    
    # Inicializa las consultas para blogs y videos (almaceno en una variable las tablas a las que tendrá acceso cada consulta)
    blog_query = Blog.query
    video_query = Video.query

    # Establezco los criterios de búsqueda por palabra clave en título o contenido de mis tablas
    if query:
        keywords = query.split()  # Divido la consulta en palabras clave
        
        # Filtro los blogs que contengan las palabras clave en el título o el contenido
        blog_query = blog_query.filter(     
            db.or_(  # función que toma varias condiciones y devuelve True si al menos una de ellas es verdadera. PAra consultas dinámicas donde se combinan diferentes criterios de búsqueda. db =  instancia de la bd de sqlalchemy
                *[Blog.blog_title.ilike(f"%{keyword}%") | Blog.blog_content.ilike(f"%{keyword}%") # asterisco (*) se utiliza para desempaquetar la lista y que los criterios de búsqueda se evalúen de a uno durante la iteración para ver si son true
                for keyword in keywords]
            )
        )

        # Idem pero con videos
        video_query = video_query.filter(
            db.or_(
                *[Video.video_title.ilike(f"%{keyword}%") | Video.video_content.ilike(f"%{keyword}%")
                for keyword in keywords]
            )
        )

    # Si se especifica un nivel, filtro por nivel en los tags
    if nivel:
        blog_query = blog_query.join(Tag, Blog.blog_id == Tag.tag_blog_id).filter(Tag.tag_name == nivel)
        video_query = video_query.join(Tag, Video.video_id == Tag.tag_video_id).filter(Tag.tag_name == nivel)

    # Si el query no esta vacío y la palabra clave es "blog" y no "video", filtra solo los blogs
    if query and 'blog' in query.lower() and 'video' not in query.lower():
        video_query = None  # Como se busca "blog", no devolvemos videos
    elif query and 'video' in query.lower() and 'blog' not in query.lower():
        blog_query = None  # Como se busca "video", no devolvemos blogs

    # Ejecuto las consultas con limit y offset sólo si el query no se ha modificado a none(como arriba cuando no se busca blog y se lo vuelve none: video_query = None  )
    blogs = blog_query.limit(limit).offset(offset).all() if blog_query is not None else []
    videos = video_query.limit(limit).offset(offset).all() if video_query is not None else []

    # Convierto los resultados a formato JSON
    blog_results = [{'id': blog.blog_id, 'title': blog.blog_title, 'content': blog.blog_content} for blog in blogs]
    video_results = [{'id': video.video_id, 'title': video.video_title, 'content': video.video_content} for video in videos]

    # Devolver los resultados en un diciionario para poder almacenar múltiples pares clave valor dentro (JSON).
    results = {
        'blogs': blog_results,
        'videos': video_results
    }
    
    return jsonify(results)
