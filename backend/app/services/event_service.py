from datetime import datetime
from ..models import db, Event, EventStatus, EventType, EventGuest, EventVendor, EventStaff, User, Venue
from ..models.task import Task, TaskStatus, TaskPriority, TaskAssignment
from ..models.budget import Budget, BudgetStatus, BudgetItem, ExpenseCategory
from sqlalchemy import or_, and_, func
import uuid
import os
from werkzeug.utils import secure_filename
from ..utils.helpers import allowed_file

def get_events(user, filters=None, page=1, per_page=20):
    """Get events with optional filtering and pagination"""
    query = Event.query
    
    # Apply filters
    if filters:
        if 'status' in filters:
            query = query.filter(Event.status == filters['status'])
        if 'event_type' in filters:
            query = query.filter(Event.event_type == filters['event_type'])
        if 'start_date' in filters:
            query = query.filter(Event.start_time >= filters['start_date'])
        if 'end_date' in filters:
            query = query.filter(Event.end_time <= filters['end_date'])
        if 'search' in filters:
            search = f"%{filters['search']}%"
            query = query.filter(
                or_(
                    Event.title.ilike(search),
                    Event.description.ilike(search)
                )
            )
    
    # Filter by user role
    if user.role == 'organizer':
        query = query.filter(Event.organizer_id == user.id)
    elif user.role == 'staff':
        query = query.join(EventStaff).filter(EventStaff.staff_id == user.id)
    elif user.role == 'vendor':
        query = query.join(EventVendor).filter(EventVendor.vendor_id == user.id)
    elif user.role == 'attendee':
        query = query.join(EventGuest).filter(
            and_(
                EventGuest.email == user.email,
                Event.status.in_(['published', 'in_progress'])
            )
        )
    
    # Order and paginate
    query = query.order_by(Event.start_time.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return {
        'items': [event.to_dict() for event in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page,
        'per_page': per_page
    }

def get_event_by_id(event_id, user):
    """Get a single event by ID with authorization"""
    event = Event.query.get_or_404(event_id)
    
    # Check authorization
    if not is_authorized_for_event(event, user):
        return {"error": "Not authorized to view this event"}, 403
    
    return event.to_dict(detailed=True)

def create_event(event_data, user):
    """Create a new event"""
    try:
        # Basic validation
        if not event_data.get('title'):
            return {"error": "Title is required"}, 400
        
        if not event_data.get('start_time') or not event_data.get('end_time'):
            return {"error": "Start and end times are required"}, 400
        
        # Create the event
        event = Event(
            title=event_data['title'],
            description=event_data.get('description', ''),
            start_time=datetime.fromisoformat(event_data['start_time']),
            end_time=datetime.fromisoformat(event_data['end_time']),
            timezone=event_data.get('timezone', 'UTC'),
            location=event_data.get('location', ''),
            virtual_meeting_url=event_data.get('virtual_meeting_url'),
            max_attendees=event_data.get('max_attendees'),
            is_public=event_data.get('is_public', True),
            event_type=EventType(event_data.get('event_type', 'other')),
            status=EventStatus.draft,
            organizer_id=user.id,
            venue_id=event_data.get('venue_id')
        )
        
        db.session.add(event)
        db.session.flush()  # Get the event ID
        
        # Create a default budget
        budget = Budget(
            event_id=event.id,
            total_budget=0,
            status='draft',
            created_by=user.id
        )
        db.session.add(budget)
        
        db.session.commit()
        
        return {"message": "Event created successfully", "event": event.to_dict()}, 201
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to create event: {str(e)}"}, 500

def update_event(event_id, event_data, user):
    """Update an existing event"""
    event = Event.query.get_or_404(event_id)
    
    # Check authorization
    if event.organizer_id != user.id and user.role != 'admin':
        return {"error": "Not authorized to update this event"}, 403
    
    try:
        # Update allowed fields
        allowed_fields = [
            'title', 'description', 'start_time', 'end_time', 'timezone',
            'location', 'virtual_meeting_url', 'max_attendees', 'is_public',
            'event_type', 'status', 'venue_id', 'cover_image'
        ]
        
        for field in allowed_fields:
            if field in event_data:
                if field in ['start_time', 'end_time']:
                    setattr(event, field, datetime.fromisoformat(event_data[field]))
                elif field in ['event_type', 'status']:
                    # Convert string to enum
                    enum_class = EventType if field == 'event_type' else EventStatus
                    setattr(event, field, enum_class(event_data[field]))
                else:
                    setattr(event, field, event_data[field])
        
        event.updated_at = datetime.utcnow()
        db.session.commit()
        
        return {"message": "Event updated successfully", "event": event.to_dict()}
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to update event: {str(e)}"}, 500

def delete_event(event_id, user):
    """Delete an event"""
    event = Event.query.get_or_404(event_id)
    
    # Check authorization
    if event.organizer_id != user.id and user.role != 'admin':
        return {"error": "Not authorized to delete this event"}, 403
    
    try:
        # In a real app, you might want to soft delete or archive instead
        db.session.delete(event)
        db.session.commit()
        return {"message": "Event deleted successfully"}
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to delete event: {str(e)}"}, 500

def upload_event_cover(event_id, file, user):
    """Upload a cover image for an event"""
    event = Event.query.get_or_404(event_id)
    
    # Check authorization
    if event.organizer_id != user.id and user.role != 'admin':
        return {"error": "Not authorized to update this event"}, 403
    
    if not file:
        return {"error": "No file provided"}, 400
    
    if not allowed_file(file.filename):
        return {"error": "File type not allowed"}, 400
    
    try:
        # Generate a unique filename
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        
        # Create uploads directory if it doesn't exist
        upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'event_covers')
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        # Update event with the new cover image path
        # In a production app, you'd want to store this in cloud storage (S3, etc.)
        # and store the URL in the database
        event.cover_image = f"/uploads/event_covers/{unique_filename}"
        db.session.commit()
        
        return {
            "message": "Cover image uploaded successfully",
            "image_url": event.cover_image
        }
    except Exception as e:
        return {"error": f"Failed to upload cover image: {str(e)}"}, 500

def is_authorized_for_event(event, user):
    """Check if a user is authorized to view/edit an event"""
    if user.role == 'admin':
        return True
    
    if event.organizer_id == user.id:
        return True
    
    if user.role == 'staff' and any(staff.staff_id == user.id for staff in event.staff):
        return True
    
    if user.role == 'vendor' and any(vendor.vendor_id == user.id for vendor in event.vendors):
        return True
    
    if user.role == 'attendee' and any(guest.email == user.email for guest in event.guests):
        return True
    
    return event.is_public

# Add more event-related service functions as needed (guests, vendors, tasks, budget, etc.)
