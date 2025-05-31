from flask import Blueprint
from flask_restx import Api
from flask_cors import CORS

# Import route modules here
from . import auth, events, users, venues, tasks, budget

api_bp = Blueprint('api', __name__)
CORS(api_bp, resources={r"/*": {"origins": "*"}})

# Initialize API with custom error handlers
def create_api(blueprint):
    api = Api(blueprint, 
             title='Event Management API',
             version='1.0',
             description='A comprehensive event management system API',
             doc='/docs',
             prefix='/api')
    
    # Add namespaces
    from .auth import api as auth_ns
    from .events import api as events_ns
    from .users import api as users_ns
    from .venues import api as venues_ns
    from .tasks import api as tasks_ns
    from .budget import api as budget_ns
    
    api.add_namespace(auth_ns)
    api.add_namespace(users_ns)
    api.add_namespace(events_ns)
    api.add_namespace(venues_ns)
    api.add_namespace(tasks_ns)
    api.add_namespace(budget_ns)
    
    return api

# Create API instance
api = create_api(api_bp)

# Import all routes to register them with the blueprint
from . import routes  # noqa: F401
