from flask import Blueprint, request, jsonify
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError

from models.blog import Blog
from schemas.blog_schema import blog_schema, blogs_schema  
from decorators.admin_permits import admin_permits

blog_bp = Blueprint('blog', __name__)

@blog_bp.route('/blog', methods=["POST"])
@admin_permits
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
    


@blog_bp.route('/blog/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
   
    blog = Blog.query.get(blog_id)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    return jsonify(blog_schema.dump(blog))



@blog_bp.route('/blogs', methods=['GET'])
def get_blogs():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    blogs = Blog.query.limit(limit).offset(offset).all()
    if not blogs:
        return jsonify({'error': 'No blogs found'}), 404  
    return jsonify(blogs_schema.dump(blogs))



@blog_bp.route('/blog/<int:blog_id>', methods=["DELETE"])
@admin_permits 
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



@blog_bp.route('/blogs', methods=["DELETE"])
@admin_permits 
def delete_all_blogs():
    try:
        Blog.query.delete()
        db.session.commit()

        return jsonify({"message": "All blogs deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@blog_bp.route('/blog/<int:blog_id>', methods=["PUT"])
@admin_permits 
def update_blog(blog_id):
    title = request.json.get('blog_title')
    content = request.json.get('blog_content')

    try:
        blog = Blog.query.get(blog_id)
        if not blog:
            return jsonify({"error": "Blog not found"}), 404

        # Solo actualiza los campos proporcionados en la solicitud, los que ingreso a POSTMAN
        if title:
            blog.blog_title = title
        if content:
            blog.blog_content = content

        db.session.commit()

        return jsonify({"message": "Blog updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


