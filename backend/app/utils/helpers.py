import os
from werkzeug.utils import secure_filename
from flask import current_app
from functools import wraps
from flask_jwt_extended import get_jwt_identity
from ..models import User

def allowed_file(filename):
    """Check if the file extension is allowed"""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, folder):
    """Save an uploaded file to the specified folder"""
    if not file:
        return None
    
    if not allowed_file(file.filename):
        return None
    
    # Create secure filename
    filename = secure_filename(file.filename)
    
    # Create directory if it doesn't exist
    upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], folder)
    os.makedirs(upload_folder, exist_ok=True)
    
    # Save file
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    
    # Return relative path
    return os.path.join('uploads', folder, filename)

def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return {"error": "Admin access required"}, 403
            
        return f(*args, **kwargs)
    return decorated_function

def organizer_required(f):
    """Decorator to require organizer or admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role not in ['admin', 'organizer']:
            return {"error": "Organizer access required"}, 403
            
        return f(*args, **kwargs)
    return decorated_function

def format_datetime(value, format='%Y-%m-%d %H:%M:%S'):
    """Format a datetime object to a string"""
    if value is None:
        return None
    return value.strftime(format)

def parse_datetime(datetime_str, format='%Y-%m-%dT%H:%M:%S'):
    """Parse a datetime string to a datetime object"""
    from datetime import datetime
    try:
        return datetime.strptime(datetime_str, format)
    except (ValueError, TypeError):
        return None

def paginate_query(query, page, per_page):
    """Paginate a SQLAlchemy query"""
    return query.paginate(page=page, per_page=per_page, error_out=False)

def get_paginated_response(pagination, schema):
    """Create a paginated response with the given schema"""
    return {
        'items': schema.dump(pagination.items, many=True),
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': pagination.page,
        'per_page': pagination.per_page
    }
