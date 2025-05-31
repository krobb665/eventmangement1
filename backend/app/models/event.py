from datetime import datetime
from enum import Enum
from .. import db

class EventType(str, Enum):
    CONFERENCE = 'conference'
    MEETING = 'meeting'
    SEMINAR = 'seminar'
    WORKSHOP = 'workshop'
    SOCIAL = 'social'
    VIRTUAL = 'virtual'
    HYBRID = 'hybrid'
    OTHER = 'other'

class EventStatus(str, Enum):
    DRAFT = 'draft'
    PUBLISHED = 'published'
    CANCELLED = 'cancelled'
    COMPLETED = 'completed'

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    start_time = db.Column(db.DateTime, nullable=False, index=True)
    end_time = db.Column(db.DateTime, nullable=False, index=True)
    timezone = db.Column(db.String(50), default='UTC')
    location = db.Column(db.String(200))
    virtual_meeting_url = db.Column(db.String(500))
    max_attendees = db.Column(db.Integer)
    is_public = db.Column(db.Boolean, default=True)
    event_type = db.Column(db.Enum(EventType), default=EventType.OTHER)
    status = db.Column(db.Enum(EventStatus), default=EventStatus.DRAFT)
    cover_image = db.Column(db.String(255))
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    venue_id = db.Column(db.Integer, db.ForeignKey('venues.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    guests = db.relationship('EventGuest', back_populates='event', lazy=True, cascade='all, delete-orphan')
    vendors = db.relationship('EventVendor', back_populates='event', lazy=True, cascade='all, delete-orphan')
    staff = db.relationship('EventStaff', back_populates='event', lazy=True, cascade='all, delete-orphan')
    tasks = db.relationship('Task', back_populates='event', lazy=True, cascade='all, delete-orphan')
    budget = db.relationship('Budget', back_populates='event', uselist=False, cascade='all, delete-orphan')
    venue = db.relationship('Venue', back_populates='events')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
            'timezone': self.timezone,
            'location': self.location,
            'virtual_meeting_url': self.virtual_meeting_url,
            'max_attendees': self.max_attendees,
            'is_public': self.is_public,
            'event_type': self.event_type.value,
            'status': self.status.value,
            'cover_image': self.cover_image,
            'organizer_id': self.organizer_id,
            'venue_id': self.venue_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'guest_count': len(self.guests),
            'vendor_count': len(self.vendors),
            'staff_count': len(self.staff)
        }

class EventGuest(db.Model):
    __tablename__ = 'event_guests'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    email = db.Column(db.String(120), nullable=False, index=True)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    phone = db.Column(db.String(20))
    rsvp_status = db.Column(db.String(20), default='pending')  # pending, accepted, declined
    check_in_time = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    event = db.relationship('Event', back_populates='guests')
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'rsvp_status': self.rsvp_status,
            'check_in_time': self.check_in_time.isoformat() if self.check_in_time else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class EventVendor(db.Model):
    __tablename__ = 'event_vendors'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    vendor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    service_type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    event = db.relationship('Event', back_populates='vendors')
    vendor = db.relationship('User')
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'vendor_id': self.vendor_id,
            'vendor_name': f"{self.vendor.first_name} {self.vendor.last_name}" if self.vendor else None,
            'service_type': self.service_type,
            'description': self.description,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class EventStaff(db.Model):
    __tablename__ = 'event_staff'
    
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    responsibilities = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    event = db.relationship('Event', back_populates='staff')
    staff = db.relationship('User', back_populates='event_staff')
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'staff_id': self.staff_id,
            'staff_name': f"{self.staff.first_name} {self.staff.last_name}" if self.staff else None,
            'role': self.role,
            'responsibilities': self.responsibilities,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
