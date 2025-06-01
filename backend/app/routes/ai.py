from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.ai_service import AIService
from app.services.event_service import EventService

bp = Blueprint('ai', __name__, url_prefix='/api/ai')
ai_service = AIService()
event_service = EventService()

@bp.route('/analyze-event/<int:event_id>', methods=['GET'])
@jwt_required()
def analyze_event(event_id):
    """
    Analyze an event using AI/ML.
    ---
    tags:
      - AI/ML
    security:
      - JWT: []
    parameters:
      - name: event_id
        in: path
        type: integer
        required: true
        description: ID of the event to analyze
    responses:
      200:
        description: AI analysis results
      404:
        description: Event not found
      500:
        description: Internal server error
    """
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Get event data
        event = event_service.get_event_by_id(event_id)
        if not event or event.organizer_id != current_user_id:
            return jsonify({"error": "Event not found or access denied"}), 404
        
        # Convert event to dict for analysis
        event_data = {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "start_time": event.start_time.isoformat() if event.start_time else None,
            "end_time": event.end_time.isoformat() if event.end_time else None,
            "location": event.location,
            "capacity": event.capacity,
            "category": event.category,
            "tags": [tag.name for tag in event.tags] if hasattr(event, 'tags') else []
        }
        
        # Get AI analysis
        analysis = ai_service.analyze_event_data(event_data)
        
        return jsonify({
            "success": True,
            "analysis": analysis
        })
        
    except Exception as e:
        current_app.logger.error(f"Error analyzing event: {str(e)}")
        return jsonify({"error": "Failed to analyze event"}), 500

@bp.route('/predict-attendance/<int:event_id>', methods=['GET'])
@jwt_required()
def predict_attendance(event_id):
    """
    Predict attendance for an event using AI/ML.
    ---
    tags:
      - AI/ML
    security:
      - JWT: []
    parameters:
      - name: event_id
        in: path
        type: integer
        required: true
        description: ID of the event to predict attendance for
    responses:
      200:
        description: Attendance prediction results
      404:
        description: Event not found
      500:
        description: Internal server error
    """
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Get event data and historical data
        event = event_service.get_event_by_id(event_id)
        if not event or event.organizer_id != current_user_id:
            return jsonify({"error": "Event not found or access denied"}), 404
        
        # Get historical event data (simplified example)
        historical_data = {
            "past_events": event_service.get_user_events(current_user_id, limit=10),
            "similar_events": event_service.get_similar_events(event_id, limit=5)
        }
        
        # Get prediction
        prediction = ai_service.predict_attendance(str(event_id), historical_data)
        
        return jsonify({
            "success": True,
            "prediction": prediction
        })
        
    except Exception as e:
        current_app.logger.error(f"Error predicting attendance: {str(e)}")
        return jsonify({"error": "Failed to predict attendance"}), 500

@bp.route('/recommendations/<int:event_id>', methods=['GET'])
@jwt_required()
def get_recommendations(event_id):
    """
    Get AI-powered recommendations for an event.
    ---
    tags:
      - AI/ML
    security:
      - JWT: []
    parameters:
      - name: event_id
        in: path
        type: integer
        required: true
        description: ID of the event to get recommendations for
    responses:
      200:
        description: AI-generated recommendations
      404:
        description: Event not found
      500:
        description: Internal server error
    """
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        
        # Get event data
        event = event_service.get_event_by_id(event_id)
        if not event or event.organizer_id != current_user_id:
            return jsonify({"error": "Event not found or access denied"}), 404
        
        # Convert event to dict for analysis
        event_data = {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "start_time": event.start_time.isoformat() if event.start_time else None,
            "end_time": event.end_time.isoformat() if event.end_time else None,
            "location": event.location,
            "capacity": event.capacity,
            "category": event.category,
            "tags": [tag.name for tag in event.tags] if hasattr(event, 'tags') else []
        }
        
        # Get recommendations
        recommendations = ai_service.get_recommendations(event_data)
        
        return jsonify({
            "success": True,
            "recommendations": recommendations
        })
        
    except Exception as e:
        current_app.logger.error(f"Error getting recommendations: {str(e)}")
        return jsonify({"error": "Failed to get recommendations"}), 500
