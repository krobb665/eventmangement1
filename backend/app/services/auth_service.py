from flask import current_app, request
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from ..models.user import User, UserRole
from .. import db
import re

def validate_email(email):
    """Basic email validation"""
    if not email or '@' not in email:
        return False
    return True

def validate_password(password):
    """Password validation: at least 8 chars, 1 digit, 1 uppercase, 1 lowercase"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    if not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    if not re.search(r"\d", password):
        return False, "Password must contain at least one digit"
    return True, ""

def register_user(email, password, first_name, last_name, role=UserRole.ATTENDEE, **kwargs):
    """Register a new user"""
    if not validate_email(email):
        return {"error": "Invalid email address"}, 400
    
    is_valid, message = validate_password(password)
    if not is_valid:
        return {"error": message}, 400
    
    if User.get_by_email(email):
        return {"error": "Email already registered"}, 400
    
    try:
        user = User(
            email=email.lower(),
            first_name=first_name,
            last_name=last_name,
            role=role,
            **kwargs
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return {
            "message": "User registered successfully",
            "user": user.to_dict(),
            "access_token": access_token,
            "refresh_token": refresh_token
        }, 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error registering user: {str(e)}")
        return {"error": "An error occurred while registering the user"}, 500

def login_user(email, password):
    """Authenticate and login a user"""
    if not email or not password:
        return {"error": "Email and password are required"}, 400
    
    user = User.get_by_email(email.lower())
    if not user or not user.check_password(password):
        return {"error": "Invalid email or password"}, 401
    
    if not user.is_active:
        return {"error": "Account is deactivated"}, 403
    
    # Generate tokens
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    
    return {
        "message": "Login successful",
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token
    }

def refresh_token():
    """Generate a new access token using refresh token"""
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    return {"access_token": access_token}

def get_current_user():
    """Get the current authenticated user"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return None
    return user

def change_password(current_password, new_password):
    """Change user password"""
    user = get_current_user()
    if not user:
        return {"error": "User not found"}, 404
    
    if not user.check_password(current_password):
        return {"error": "Current password is incorrect"}, 400
    
    is_valid, message = validate_password(new_password)
    if not is_valid:
        return {"error": message}, 400
    
    try:
        user.set_password(new_password)
        db.session.commit()
        return {"message": "Password updated successfully"}
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error changing password: {str(e)}")
        return {"error": "An error occurred while updating the password"}, 500

def update_profile(user_data):
    """Update user profile"""
    user = get_current_user()
    if not user:
        return {"error": "User not found"}, 404
    
    try:
        # Update allowed fields
        allowed_fields = ['first_name', 'last_name', 'phone']
        for field in allowed_fields:
            if field in user_data:
                setattr(user, field, user_data[field])
        
        db.session.commit()
        return {"message": "Profile updated successfully", "user": user.to_dict()}
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error updating profile: {str(e)}")
        return {"error": "An error occurred while updating the profile"}, 500
