from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_socketio import SocketIO
from config import config
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    socketio.init_app(app, message_queue=app.config.get('MESSAGE_QUEUE'))
    
    # Create upload folder if it doesn't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Register blueprints
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Shell context
    @app.shell_context_processor
    def make_shell_context():
        return {'db': db, 'User': User, 'Event': Event}
    
    return app

# Import models to ensure they are registered with SQLAlchemy
from .models.user import User, UserRole
from .models.event import Event, EventType, EventStatus, EventGuest, EventVendor, EventStaff
from .models.venue import Venue
from .models.task import Task, TaskStatus, TaskAssignment
from .models.budget import Budget, BudgetItem, Expense
