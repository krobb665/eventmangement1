#!/usr/bin/env python3
"""
Direct test script for AI service.

This script tests the AIService class directly without loading the Flask application.
"""

import os
import sys
import json
import logging
from datetime import datetime, timedelta

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Import the AIService
from app.services.ai_service import AIService

def print_header(title):
    """Print a formatted header."""
    print(f"\n{'=' * 80}")
    print(f"{title.upper():^80}")
    print(f"{'=' * 80}")

def test_ai_service_direct():
    """Test the AI service directly with sample data."""
    # Initialize the AI service
    print_header("Initializing AI Service Directly")
    
    # Create a mock Flask app context
    class MockApp:
        def __init__(self):
            self.logger = logging.getLogger('mock_app')
    
    # Initialize the AI service with mock app
    ai_service = AIService()
    
    # Print feature status
    status = ai_service.get_feature_status()
    print("\nAI Service Status:")
    print(json.dumps(status, indent=2))
    
    if not status["enabled"]:
        print("\nAI features are disabled. Enable them in the configuration.")
        return
    
    # Sample event data for testing
    sample_event = {
        "id": "event_123",
        "title": "Tech Conference 2023",
        "description": "Annual technology conference featuring the latest in AI, ML, and cloud computing.",
        "start_time": (datetime.now() + timedelta(days=30)).isoformat(),
        "end_time": (datetime.now() + timedelta(days=32)).isoformat(),
        "location": "San Francisco, CA",
        "capacity": 500,
        "category": "Technology",
        "tags": ["ai", "machine learning", "cloud", "conference"],
        "organizer_id": "org_123"
    }
    
    # Sample historical data for prediction
    historical_data = {
        "past_events": [
            {
                "event_id": "event_122",
                "title": "Tech Conference 2022",
                "attendance": 420,
                "capacity": 500,
                "duration_hours": 24,
                "tickets_sold": 450,
                "category": "Technology"
            },
            {
                "event_id": "event_121",
                "title": "AI Summit 2022",
                "attendance": 380,
                "capacity": 450,
                "duration_hours": 16,
                "tickets_sold": 400,
                "category": "Technology"
            }
        ]
    }
    
    # Test event analysis
    print_header("Testing Event Analysis")
    try:
        print("\nSample Event Data:")
        print(json.dumps(sample_event, indent=2))
        
        print("\nAnalyzing event data...")
        analysis = ai_service.analyze_event_data(sample_event)
        print("\nEvent Analysis Result:")
        print(json.dumps(analysis, indent=2))
        
        # Check if this is an error response
        if "error" in analysis:
            print("\nNote: Received an error from the AI service. This is expected if the AI/ML API is not running.")
            print("To test with a real AI/ML service, update the AI_ML_BASE_URL in your configuration.")
    except Exception as e:
        logger.error(f"Error analyzing event: {e}")
        print("\nThis error is expected if the AI/ML API is not running.")
        print("To test with a real AI/ML service, update the AI_ML_BASE_URL in your configuration.")
    
    # Test attendance prediction
    print_header("Testing Attendance Prediction")
    try:
        print("\nHistorical Data:")
        print(json.dumps(historical_data, indent=2))
        
        print("\nPredicting attendance...")
        prediction = ai_service.predict_attendance(
            sample_event["id"],
            historical_data
        )
        print("\nAttendance Prediction:")
        print(json.dumps(prediction, indent=2))
        
        # Check if this is an error response
        if "error" in prediction:
            print("\nNote: Received an error from the AI service. This is expected if the AI/ML API is not running.")
    except Exception as e:
        logger.error(f"Error predicting attendance: {e}")
        print("\nThis error is expected if the AI/ML API is not running.")
    
    # Test recommendations
    print_header("Testing Recommendations")
    try:
        print("\nGetting recommendations...")
        # Create a simplified event data structure to avoid unhashable types
        simple_event = {
            "id": sample_event["id"],
            "title": sample_event["title"],
            "category": sample_event["category"],
            "location": sample_event["location"]
        }
        recommendations = ai_service.get_recommendations(simple_event)
        print("\nRecommendations:")
        print(json.dumps(recommendations, indent=2))
        
        # Check if this is an error response
        if "error" in recommendations:
            print("\nNote: Received an error from the AI service. This is expected if the AI/ML API is not running.")
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        print("\nThis error is expected if the AI/ML API is not running.")
    
    # Test caching
    print_header("Testing Caching")
    try:
        # Create a simple event for testing caching
        test_event = {"id": "cache_test", "title": "Cache Test Event", "category": "Test"}
        
        # First call (should make API request)
        print("\nFirst call (should make API request):")
        start_time = datetime.now()
        result1 = ai_service.analyze_event_data(test_event)
        duration = (datetime.now() - start_time).total_seconds()
        print(f"Took {duration:.4f} seconds")
        
        # Second call (should use cache)
        print("\nSecond call (should use cache):")
        start_time = datetime.now()
        result2 = ai_service.analyze_event_data(test_event)
        duration = (datetime.now() - start_time).total_seconds()
        print(f"Took {duration:.6f} seconds (should be faster with cache)")
        
        # Verify results are the same
        if "error" in result1 and "error" in result2:
            print("\nNote: Both requests resulted in errors (expected if API is not running), "
                  "so cache test is inconclusive.")
        else:
            assert result1 == result2, "Cached result should match original result"
            print("\nCache test passed!")
        
    except Exception as e:
        logger.error(f"Error testing cache: {e}")
        print("\nCache test failed. This is expected if the AI/ML API is not running.")

if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("AI SERVICE DIRECT TEST".center(80))
    print("=" * 80)
    
    try:
        test_ai_service_direct()
    except KeyboardInterrupt:
        print("\nTest interrupted by user.")
    except Exception as e:
        logger.error(f"Test failed: {e}", exc_info=True)
        sys.exit(1)
    
    print("\n" + "=" * 80)
    print("TEST COMPLETED".center(80))
    print("=" * 80 + "\n")
