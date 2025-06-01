import pytest
import os
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta

from app.services.ai_service import AIService

def test_ai_service_initialization():
    """Test that the AI service initializes with the correct configuration."""
    # Test with default configuration
    ai_service = AIService()
    assert ai_service.api_key == "b514b8e59e5c44e49b0cd67342dfa9e7"
    assert ai_service.base_url == "https://api.example.com/ai-ml"
    assert ai_service.timeout == 30
    assert ai_service.enabled is True
    
    # Test with custom API key
    ai_service = AIService(api_key="custom_key_123")
    assert ai_service.api_key == "custom_key_123"

@patch('app.services.ai_service.requests.post')
def test_analyze_event_data(mock_post):
    """Test the analyze_event_data method."""
    # Setup mock response
    mock_response = MagicMock()
    mock_response.json.return_value = {"analysis": "success", "score": 0.95}
    mock_response.raise_for_status.return_value = None
    mock_post.return_value = mock_response
    
    # Initialize service and make request
    ai_service = AIService()
    event_data = {"title": "Test Event", "description": "A test event"}
    result = ai_service.analyze_event_data(event_data)
    
    # Assertions
    assert result == {"analysis": "success", "score": 0.95}
    mock_post.assert_called_once()
    
    # Test with API error
    mock_post.side_effect = Exception("API Error")
    result = ai_service.analyze_event_data(event_data)
    assert "error" in result

def test_cache_operations():
    """Test caching functionality."""
    ai_service = AIService()
    cache_key = "test_key"
    test_data = {"data": "test"}
    
    # Test setting and getting from cache
    ai_service._set_cached_result(cache_key, test_data)
    assert ai_service._get_cached_result(cache_key) == test_data
    
    # Test cache expiration
    ai_service._cache_expiry[cache_key] = datetime.now() - timedelta(seconds=1)
    assert ai_service._get_cached_result(cache_key) is None

@patch('app.services.ai_service.requests.post')
def test_predict_attendance(mock_post):
    """Test the predict_attendance method."""
    # Setup mock response
    mock_response = MagicMock()
    mock_response.json.return_value = {"prediction": 150, "confidence": 0.85}
    mock_response.raise_for_status.return_value = None
    mock_post.return_value = mock_response
    
    # Initialize service and make request
    ai_service = AIService()
    historical_data = {"past_events": [{"attendance": 100}, {"attendance": 120}]}
    result = ai_service.predict_attendance("event123", historical_data)
    
    # Assertions
    assert result["prediction"] == 150
    assert result["confidence"] == 0.85
    assert result["model"] == "event-prediction-v1"

@patch('app.services.ai_service.requests.post')
def test_get_recommendations(mock_post):
    """Test the get_recommendations method."""
    # Setup mock response
    mock_response = MagicMock()
    mock_response.json.return_value = {
        "recommendations": [
            {"title": "Venue Suggestion", "score": 0.92},
            {"title": "Time Slot Suggestion", "score": 0.87}
        ]
    }
    mock_response.raise_for_status.return_value = None
    mock_post.return_value = mock_response
    
    # Initialize service and make request
    ai_service = AIService()
    event_data = {"title": "Test Event", "category": "conference"}
    result = ai_service.get_recommendations(event_data)
    
    # Assertions
    assert len(result["recommendations"]) == 2
    assert result["recommendations"][0]["title"] == "Venue Suggestion"
    assert result["model"] == "event-prediction-v1"

def test_feature_status():
    """Test the get_feature_status method."""
    ai_service = AIService()
    status = ai_service.get_feature_status()
    
    # Assertions
    assert isinstance(status, dict)
    assert "enabled" in status
    assert "cache_enabled" in status
    assert "features" in status
    assert "analytics" in status["features"]
    assert "predictions" in status["features"]
    assert "recommendations" in status["features"]
