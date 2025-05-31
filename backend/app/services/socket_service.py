from flask_socketio import emit, join_room, leave_room
from flask import request
from flask_jwt_extended import decode_token
from ..models import db, User
import json

def register_socket_handlers(socketio):
    """Register all Socket.IO event handlers"""
    @socketio.on('connect')
    def handle_connect():
        """Handle new WebSocket connection"""
        print(f'Client connected: {request.sid}')
        
        # Authenticate the connection using JWT token
        token = request.args.get('token')
        if not token:
            return False  # Reject connection
            
        try:
            # Decode the JWT token
            decoded_token = decode_token(token)
            user_id = decoded_token['sub']
            user = User.query.get(user_id)
            
            if not user:
                return False  # Reject connection if user not found
                
            # Store user ID in the socket's session
            request.user_id = user_id
            
            # Join a room for the user (for private messages)
            join_room(f'user_{user_id}')
            
            # Join rooms for user's events
            # (In a real app, you would query the user's events and join those rooms)
            
            print(f'User {user.email} connected with SID: {request.sid}')
            return True
            
        except Exception as e:
            print(f'WebSocket authentication failed: {str(e)}')
            return False  # Reject connection
    
    @socketio.on('disconnect')
    def handle_disconnect():
        """Handle WebSocket disconnection"""
        print(f'Client disconnected: {request.sid}')
        
        if hasattr(request, 'user_id'):
            # Leave all rooms when disconnecting
            leave_room(f'user_{request.user_id}')
    
    @socketio.on('join_event')
    def handle_join_event(data):
        """Join a room for a specific event"""
        if not hasattr(request, 'user_id'):
            return False
            
        event_id = data.get('event_id')
        if not event_id:
            return False
            
        # In a real app, verify the user has access to this event
        room = f'event_{event_id}'
        join_room(room)
        print(f'User {request.user_id} joined room: {room}')
    
    @socketio.on('leave_event')
    def handle_leave_event(data):
        """Leave a room for a specific event"""
        if not hasattr(request, 'user_id'):
            return False
            
        event_id = data.get('event_id')
        if not event_id:
            return False
            
        room = f'event_{event_id}'
        leave_room(room)
        print(f'User {request.user_id} left room: {room}')
    
    @socketio.on('send_message')
    def handle_send_message(data):
        """Handle sending a message to a room"""
        if not hasattr(request, 'user_id'):
            return False
            
        room = data.get('room')
        message = data.get('message')
        
        if not room or not message:
            return False
            
        # In a real app, you would:
        # 1. Validate the user has access to this room
        # 2. Save the message to the database
        # 3. Broadcast the message to the room
        
        user = User.query.get(request.user_id)
        if not user:
            return False
            
        # Broadcast the message to the room
        emit('new_message', {
            'user_id': user.id,
            'user_name': f'{user.first_name} {user.last_name}',
            'message': message,
            'timestamp': str(datetime.utcnow())
        }, room=room)
    
    # Add more WebSocket event handlers as needed

# Import datetime for timestamp
datetime = __import__('datetime').datetime
