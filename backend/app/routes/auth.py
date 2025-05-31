from flask import request, current_app
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import (
    jwt_required, create_access_token, 
    get_jwt_identity, create_refresh_token
)
from ..services.auth_service import (
    register_user, login_user, refresh_token,
    change_password, update_profile, get_current_user
)

api = Namespace('auth', description='Authentication operations')

# Request models
login_model = api.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password')
})

register_model = api.model('Register', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password'),
    'first_name': fields.String(required=True, description='First name'),
    'last_name': fields.String(required=True, description='Last name'),
    'phone': fields.String(description='Phone number'),
    'role': fields.String(description='User role', enum=['organizer', 'attendee', 'vendor', 'staff'], default='attendee')
})

password_change_model = api.model('PasswordChange', {
    'current_password': fields.String(required=True, description='Current password'),
    'new_password': fields.String(required=True, description='New password')
})

profile_update_model = api.model('ProfileUpdate', {
    'first_name': fields.String(description='First name'),
    'last_name': fields.String(description='Last name'),
    'phone': fields.String(description='Phone number')
})

@api.route('/register')
class Register(Resource):
    @api.expect(register_model, validate=True)
    @api.response(201, 'User registered successfully')
    @api.response(400, 'Invalid input')
    @api.response(409, 'Email already registered')
    def post(self):
        """Register a new user"""
        data = request.get_json()
        return register_user(**data)

@api.route('/login')
class Login(Resource):
    @api.expect(login_model, validate=True)
    @api.response(200, 'Login successful')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Invalid credentials')
    def post(self):
        """User login"""
        data = request.get_json()
        return login_user(data.get('email'), data.get('password'))

@api.route('/refresh')
class Refresh(Resource):
    @jwt_required(refresh=True)
    @api.response(200, 'Token refreshed')
    @api.response(401, 'Invalid or expired refresh token')
    def post(self):
        """Refresh access token"""
        return refresh_token()

@api.route('/me')
class UserProfile(Resource):
    @jwt_required()
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    def get(self):
        """Get current user profile"""
        user = get_current_user()
        if not user:
            return {"error": "User not found"}, 404
        return user.to_dict()
    
    @jwt_required()
    @api.expect(profile_update_model)
    @api.response(200, 'Profile updated successfully')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    def put(self):
        """Update current user profile"""
        data = request.get_json()
        return update_profile(data)

@api.route('/change-password')
class ChangePassword(Resource):
    @jwt_required()
    @api.expect(password_change_model, validate=True)
    @api.response(200, 'Password updated successfully')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    def post(self):
        """Change user password"""
        data = request.get_json()
        return change_password(data.get('current_password'), data.get('new_password'))
