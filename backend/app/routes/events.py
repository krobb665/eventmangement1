from flask import request, current_app
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..services.event_service import (
    get_events, get_event_by_id, create_event,
    update_event, delete_event, upload_event_cover, is_authorized_for_event
)
from ..models import Event, EventStatus, EventType, EventGuest, EventVendor, EventStaff
from .. import db

api = Namespace('events', description='Event operations')

# Request/Response models
event_model = api.model('Event', {
    'title': fields.String(required=True, description='Event title'),
    'description': fields.String(description='Event description'),
    'start_time': fields.DateTime(required=True, description='Start time (ISO 8601 format)'),
    'end_time': fields.DateTime(required=True, description='End time (ISO 8601 format)'),
    'timezone': fields.String(description='Timezone (e.g., "America/New_York")', default='UTC'),
    'location': fields.String(description='Physical location'),
    'virtual_meeting_url': fields.String(description='URL for virtual meetings'),
    'max_attendees': fields.Integer(description='Maximum number of attendees'),
    'is_public': fields.Boolean(description='Whether the event is public', default=True),
    'event_type': fields.String(description='Type of event', enum=[t.value for t in EventType], default='other'),
    'status': fields.String(description='Event status', enum=[s.value for s in EventStatus], default='draft'),
    'venue_id': fields.Integer(description='ID of the venue')
})

# Query parameters
event_parser = api.parser()
event_parser.add_argument('status', type=str, help='Filter by status')
event_parser.add_argument('event_type', type=str, help='Filter by event type')
event_parser.add_argument('start_date', type=str, help='Filter by start date (YYYY-MM-DD)')
event_parser.add_argument('end_date', type=str, help='Filter by end date (YYYY-MM-DD)')
event_parser.add_argument('search', type=str, help='Search term')
event_parser.add_argument('page', type=int, default=1, help='Page number')
event_parser.add_argument('per_page', type=int, default=20, help='Items per page')

@api.route('/')
class EventList(Resource):
    @jwt_required()
    @api.expect(event_parser)
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    def get(self):
        """Get a list of events"""
        args = event_parser.parse_args()
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        
        # Convert string dates to datetime objects
        filters = {k: v for k, v in args.items() if v is not None and k not in ['page', 'per_page']}
        
        return get_events(
            user=user,
            filters=filters,
            page=args['page'],
            per_page=args['per_page']
        )
    
    @jwt_required()
    @api.expect(event_model, validate=True)
    @api.response(201, 'Event created')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    def post(self):
        """Create a new event"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        return create_event(request.get_json(), user)

@api.route('/<int:event_id>')
@api.param('event_id', 'The event identifier')
class EventResource(Resource):
    @jwt_required()
    @api.response(200, 'Success')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Event not found')
    def get(self, event_id):
        """Get event by ID"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        return get_event_by_id(event_id, user)
    
    @jwt_required()
    @api.expect(event_model)
    @api.response(200, 'Event updated')
    @api.response(400, 'Invalid input')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Event not found')
    def put(self, event_id):
        """Update an event"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        return update_event(event_id, request.get_json(), user)
    
    @jwt_required()
    @api.response(200, 'Event deleted')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Event not found')
    def delete(self, event_id):
        """Delete an event"""
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        return delete_event(event_id, user)

@api.route('/<int:event_id>/upload-cover')
@api.param('event_id', 'The event identifier')
class EventCoverUpload(Resource):
    @jwt_required()
    @api.response(200, 'Cover image uploaded')
    @api.response(400, 'No file provided')
    @api.response(401, 'Not authenticated')
    @api.response(403, 'Not authorized')
    @api.response(404, 'Event not found')
    def post(self, event_id):
        """Upload a cover image for an event"""
        if 'file' not in request.files:
            return {"error": "No file part"}, 400
        
        file = request.files['file']
        if file.filename == '':
            return {"error": "No selected file"}, 400
        
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        return upload_event_cover(event_id, file, user)

# Import User here to avoid circular imports
from ..models.user import User
