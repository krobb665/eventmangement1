from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, User, UserRole
from ..services.auth_service import get_current_user

api = Namespace('users', description='User operations')

# Request/Response models
user_model = api.model('User', {
    'email': fields.String(required=True, description='User email'),
    'first_name': fields.String(required=True, description='First name'),
    'last_name': fields.String(required=True, description='Last name'),
    'phone': fields.String(description='Phone number'),
    'role': fields.String(description='User role', enum=[r.value for r in UserRole], default='attendee'),
    'is_active': fields.Boolean(description='Whether the user account is active', default=True)
})

user_update_model = api.model('UserUpdate', {
    'first_name': fields.String(description='First name'),
    'last_name': fields.String(description='Last name'),
    'phone': fields.String(description='Phone number'),
    'is_active': fields.Boolean(description='Whether the user account is active')
})

# Query parameters
user_parser = api.parser()
user_parser.add_argument('search', type=str, help='Search term')
user_parser.add_argument('role', type=str, help='Filter by role')
user_parser.add_argument('is_active', type=str, help='Filter by active status (true/false)')
user_parser.add_argument('page', type=int, default=1, help='Page number')
user_parser.add_argument('per_page', type=int, default=20, help='Items per page')

@api.route('/')
class UserList(Resource):
    @jwt_required()
    @api.expect(user_parser)
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    def get(self):
        """Get a list of users (admin/organizer only)"""
        current_user = get_current_user()
        if not current_user or current_user.role not in ['admin', 'organizer']:
            return {"error": "Not authorized to view users"}, 403
        
        args = user_parser.parse_args()
        query = User.query
        
        # Apply filters
        if args.get('search'):
            search = f"%{args['search']}%"
            query = query.filter(
                db.or_(
                    User.email.ilike(search),
                    User.first_name.ilike(search),
                    User.last_name.ilike(search)
                )
            )
        
        if args.get('role'):
            query = query.filter(User.role == UserRole(args['role']))
        
        if args.get('is_active'):
            is_active = args['is_active'].lower() == 'true'
            query = query.filter(User.is_active == is_active)
        
        # Order by name
        query = query.order_by(User.last_name, User.first_name)
        
        # Pagination
        page = args.get('page', 1)
        per_page = args.get('per_page', 20)
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return {
            'items': [user.to_dict() for user in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        }
    
    @jwt_required()
    @api.expect(user_model, validate=True)
    @api.response(201, 'User created')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    def post(self):
        """Create a new user (admin/organizer only)"""
        current_user = get_current_user()
        if not current_user or current_user.role not in ['admin', 'organizer']:
            return {"error": "Not authorized to create users"}, 403
        
        data = request.get_json()
        
        # Check if email already exists
        if User.query.filter_by(email=data['email'].lower()).first():
            return {"error": "Email already registered"}, 400
        
        # Only admins can create other admins
        if 'role' in data and data['role'] == 'admin' and current_user.role != 'admin':
            return {"error": "Only admins can create admin users"}, 403
        
        try:
            # Create the user
            user = User(
                email=data['email'].lower(),
                first_name=data['first_name'],
                last_name=data['last_name'],
                phone=data.get('phone'),
                role=UserRole(data.get('role', 'attendee')),
                is_active=data.get('is_active', True)
            )
            
            # Set a temporary password (user will need to reset it)
            user.set_password('temp_password')
            
            db.session.add(user)
            db.session.commit()
            
            # In a real app, send an email with password reset instructions
            
            return {
                "message": "User created successfully",
                "user": user.to_dict()
            }, 201
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to create user: {str(e)}"}, 500

@api.route('/<int:user_id>')
@api.param('user_id', 'The user identifier')
class UserResource(Resource):
    @jwt_required()
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Get user by ID"""
        current_user = get_current_user()
        if not current_user:
            return {"error": "Not authenticated"}, 401
        
        # Users can view their own profile, admins/organizers can view any profile
        if current_user.id != user_id and current_user.role not in ['admin', 'organizer']:
            return {"error": "Not authorized to view this user"}, 403
        
        user = User.query.get_or_404(user_id)
        return user.to_dict()
    
    @jwt_required()
    @api.expect(user_update_model)
    @api.response(200, 'User updated')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'User not found')
    def put(self, user_id):
        """Update a user"""
        current_user = get_current_user()
        if not current_user:
            return {"error": "Not authenticated"}, 401
        
        # Users can update their own profile, admins can update any profile
        if current_user.id != user_id and current_user.role != 'admin':
            return {"error": "Not authorized to update this user"}, 403
        
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        try:
            # Update allowed fields
            allowed_fields = ['first_name', 'last_name', 'phone', 'is_active']
            
            # Only admins can update roles and active status
            if current_user.role == 'admin':
                allowed_fields.extend(['role', 'is_active'])
            
            for field in allowed_fields:
                if field in data:
                    setattr(user, field, data[field])
            
            db.session.commit()
            
            return {
                "message": "User updated successfully",
                "user": user.to_dict()
            }
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to update user: {str(e)}"}, 500
    
    @jwt_required()
    @api.response(200, 'User deactivated')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'User not found')
    def delete(self, user_id):
        """Deactivate a user (soft delete)"""
        current_user = get_current_user()
        if not current_user or current_user.role != 'admin':
            return {"error": "Not authorized to deactivate users"}, 403
        
        if current_user.id == user_id:
            return {"error": "Cannot deactivate your own account"}, 400
        
        user = User.query.get_or_404(user_id)
        
        try:
            # Soft delete by deactivating the account
            user.is_active = False
            db.session.commit()
            
            return {"message": "User deactivated successfully"}
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to deactivate user: {str(e)}"}, 500

@api.route('/me')
class CurrentUser(Resource):
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
    @api.expect(user_update_model)
    @api.response(200, 'Profile updated')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    def put(self):
        """Update current user profile"""
        user = get_current_user()
        if not user:
            return {"error": "User not found"}, 404
        
        data = request.get_json()
        
        try:
            # Update allowed fields (users can't change their own role or active status)
            allowed_fields = ['first_name', 'last_name', 'phone']
            
            for field in allowed_fields:
                if field in data:
                    setattr(user, field, data[field])
            
            db.session.commit()
            
            return {
                "message": "Profile updated successfully",
                "user": user.to_dict()
            }
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to update profile: {str(e)}"}, 500
