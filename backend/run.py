import os
from app import create_app, socketio
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create application instance
app = create_app(os.getenv('FLASK_ENV') or 'default')

if __name__ == '__main__':
    # Run the application with Socket.IO support
    socketio.run(
        app,
        host=os.getenv('FLASK_RUN_HOST', '0.0.0.0'),
        port=int(os.getenv('FLASK_RUN_PORT', 5000)),
        debug=os.getenv('FLASK_DEBUG', 'true').lower() == 'true',
        use_reloader=os.getenv('FLASK_DEBUG', 'true').lower() == 'true'
    )
