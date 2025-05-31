from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Venue, db
from ..services.auth_service import get_current_user

api = Namespace('venues', description='Venue operations')

# Request/Response models
venue_model = api.model('Venue', {
    'name': fields.String(required=True, description='Venue name'),
    'description': fields.String(description='Venue description'),
    'address_line1': fields.String(required=True, description='Address line 1'),
    'address_line2': fields.String(description='Address line 2'),
    'city': fields.String(required=True, description='City'),
    'state': fields.String(description='State/Province'),
    'postal_code': fields.String(description='Postal/ZIP code'),
    'country': fields.String(required=True, description='Country'),
    'latitude': fields.Float(description='Latitude'),
    'longitude': fields.Float(description='Longitude'),
    'capacity': fields.Integer(description='Maximum capacity'),
    'contact_name': fields.String(description='Contact person name'),
    'contact_phone': fields.String(description='Contact phone number'),
    'contact_email': fields.String(description='Contact email'),
    'website': fields.String(description='Venue website'),
    'is_active': fields.Boolean(description='Whether the venue is active', default=True)
})

# Query parameters
venue_parser = api.parser()
venue_parser.add_argument('search', type=str, help='Search term')
venue_parser.add_argument('city', type=str, help='Filter by city')
venue_parser.add_argument('country', type=str, help='Filter by country')
venue_parser.add_argument('min_capacity', type=int, help='Minimum capacity')
venue_parser.add_argument('page', type=int, default=1, help='Page number')
venue_parser.add_argument('per_page', type=int, default=20, help='Items per page')

@api.route('/')
class VenueList(Resource):
    @jwt_required()
    @api.expect(venue_parser)
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    def get(self):
        """Get a list of venues"""
        args = venue_parser.parse_args()
        query = Venue.query
        
        # Apply filters
        if args.get('search'):
            search = f"%{args['search']}%"
            query = query.filter(
                db.or_(
                    Venue.name.ilike(search),
                    Venue.description.ilike(search),
                    Venue.city.ilike(search),
                    Venue.country.ilike(search)
                )
            )
        
        if args.get('city'):
            query = query.filter(Venue.city.ilike(f"%{args['city']}%"))
        
        if args.get('country'):
            query = query.filter(Venue.country.ilike(f"%{args['country']}%"))
        
        if args.get('min_capacity'):
            query = query.filter(Venue.capacity >= args['min_capacity'])
        
        # Only show active venues by default unless specified
        if 'is_active' in request.args:
            query = query.filter(Venue.is_active == (request.args.get('is_active').lower() == 'true'))
        else:
            query = query.filter(Venue.is_active == True)
        
        # Pagination
        page = args.get('page', 1)
        per_page = args.get('per_page', 20)
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return {
            'items': [venue.to_dict() for venue in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        }
    
    @jwt_required()
    @api.expect(venue_model, validate=True)
    @api.response(201, 'Venue created')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    def post(self):
        """Create a new venue"""
        user = get_current_user()
        if not user or user.role not in ['admin', 'organizer']:
            return {"error": "Not authorized to create venues"}, 403
        
        data = request.get_json()
        
        try:
            venue = Venue(**data)
            db.session.add(venue)
            db.session.commit()
            
            return {
                "message": "Venue created successfully",
                "venue": venue.to_dict()
            }, 201
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to create venue: {str(e)}"}, 500

@api.route('/<int:venue_id>')
@api.param('venue_id', 'The venue identifier')
class VenueResource(Resource):
    @jwt_required()
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    @api.response(404, 'Venue not found')
    def get(self, venue_id):
        """Get venue by ID"""
        venue = Venue.query.get_or_404(venue_id)
        return venue.to_dict()
    
    @jwt_required()
    @api.expect(venue_model)
    @api.response(200, 'Venue updated')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Venue not found')
    def put(self, venue_id):
        """Update a venue"""
        user = get_current_user()
        if not user or user.role not in ['admin', 'organizer']:
            return {"error": "Not authorized to update venues"}, 403
        
        venue = Venue.query.get_or_404(venue_id)
        data = request.get_json()
        
        try:
            # Update venue fields
            for key, value in data.items():
                if hasattr(venue, key):
                    setattr(venue, key, value)
            
            db.session.commit()
            
            return {
                "message": "Venue updated successfully",
                "venue": venue.to_dict()
            }
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to update venue: {str(e)}"}, 500
    
    @jwt_required()
    @api.response(200, 'Venue deleted')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Venue not found')
    def delete(self, venue_id):
        """Delete a venue (soft delete)"""
        user = get_current_user()
        if not user or user.role != 'admin':
            return {"error": "Not authorized to delete venues"}, 403
        
        venue = Venue.query.get_or_404(venue_id)
        
        try:
            # Soft delete by setting is_active to False
            venue.is_active = False
            db.session.commit()
            
            return {"message": "Venue deactivated successfully"}
        except Exception as e:
            db.session.rollback()
            return {"error": f"Failed to deactivate venue: {str(e)}"}, 500
