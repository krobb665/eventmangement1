#!/usr/bin/env python3
"""
Test script for AI service integration.

This script demonstrates how to use the AIService class to interact with the AI/ML API.
It includes examples of event analysis, attendance prediction, and getting recommendations.
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

def test_ai_service():
    """Test the AI service with sample data."""
    # Initialize the AI service
    print_header("Initializing AI Service")
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
        analysis = ai_service.analyze_event_data(sample_event)
        print("\nEvent Analysis Result:")
        print(json.dumps(analysis, indent=2))
    except Exception as e:
        logger.error(f"Error analyzing event: {e}", exc_info=True)
    
    # Test attendance prediction
    print_header("Testing Attendance Prediction")
    try:
        prediction = ai_service.predict_attendance(
            sample_event["id"],
            historical_data
        )
        print("\nAttendance Prediction:")
        print(json.dumps(prediction, indent=2))
    except Exception as e:
        logger.error(f"Error predicting attendance: {e}", exc_info=True)
    
    # Test recommendations
    print_header("Testing Recommendations")
    try:
        recommendations = ai_service.get_recommendations(sample_event)
        print("\nRecommendations:")
        print(json.dumps(recommendations, indent=2))
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}", exc_info=True)
    
    # Test caching
    print_header("Testing Caching")
    try:
        # First call (should make API request)
        print("\nFirst call (should make API request):")
        start_time = datetime.now()
        result1 = ai_service.analyze_event_data(sample_event)
        duration = (datetime.now() - start_time).total_seconds()
        print(f"Took {duration:.2f} seconds")
        
        # Second call (should use cache)
        print("\nSecond call (should use cache):")
        start_time = datetime.now()
        result2 = ai_service.analyze_event_data(sample_event)
        duration = (datetime.now() - start_time).total_seconds()
        print(f"Took {duration:.4f} seconds (should be faster with cache)")
        
        # Verify results are the same
        assert result1 == result2, "Cached result should match original result"
        print("\nCache test passed!")
        
    except Exception as e:
        logger.error(f"Error testing cache: {e}", exc_info=True)

if __name__ == "__main__":
    print("\n" + "=" * 80)
    print("AI SERVICE INTEGRATION TEST".center(80))
    print("=" * 80)
    
    try:
        test_ai_service()
    except KeyboardInterrupt:
        print("\nTest interrupted by user.")
    except Exception as e:
        logger.error(f"Test failed: {e}", exc_info=True)
        sys.exit(1)
    
    print("\n" + "=" * 80)
    print("TEST COMPLETED".center(80))
    print("=" * 80 + "\n")
