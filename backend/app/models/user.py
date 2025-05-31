from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app
from .. import db
import jwt
from enum import Enum

class UserRole(str, Enum):
    ORGANIZER = 'organizer'
    ATTENDEE = 'attendee'
    VENDOR = 'vendor'
    STAFF = 'staff'
    ADMIN = 'admin'

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    first_name = db.Column(db.String(64), nullable=False)
    last_name = db.Column(db.String(64), nullable=False)
    phone = db.Column(db.String(20))
    role = db.Column(db.Enum(UserRole), default=UserRole.ATTENDEE, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    organized_events = db.relationship('Event', backref='organizer', lazy=True, foreign_keys='Event.organizer_id')
    event_staff = db.relationship('EventStaff', back_populates='staff', lazy=True)
    assigned_tasks = db.relationship('TaskAssignment', back_populates='assignee', lazy=True)
    
    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        if self.email:
            self.email = self.email.lower()
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_auth_token(self):
        from .. import jwt
        access_token = jwt.create_access_token(identity=self.id)
        refresh_token = jwt.create_refresh_token(identity=self.id)
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': self.to_dict()
        }
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'role': self.role.value,
            'is_active': self.is_active,
            'email_verified': self.email_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def get_by_email(cls, email):
        return cls.query.filter_by(email=email.lower()).first()
    
    @classmethod
    def verify_auth_token(cls, token):
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        except:
            return None
        return cls.query.get(data['id'])
    
    def __repr__(self):
        return f'<User {self.email}>'
