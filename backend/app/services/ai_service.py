import os
import requests
import logging
from typing import Dict, Any, Optional, List, Union
from flask import current_app as app
from datetime import datetime, timedelta
from functools import lru_cache

# Import configuration
from app.config.ai_config import config as ai_config

# Set up logging
logging.basicConfig(level=getattr(logging, ai_config.LOG_LEVEL))
logger = logging.getLogger(__name__)

class AIService:
    """Service for handling AI/ML related operations."""
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize the AI service with API key and configuration."""
        self.api_key = api_key or ai_config.API_KEY
        self.base_url = ai_config.BASE_URL
        self.timeout = ai_config.REQUEST_TIMEOUT
        self.enabled = ai_config.ENABLED
        self.cache_enabled = ai_config.CACHE_ENABLED
        self.cache_ttl = ai_config.CACHE_TTL
        self.default_model = ai_config.DEFAULT_MODEL
        
        # Initialize cache
        self._cache = {}
        self._cache_expiry = {}
        
        logger.info(f"AI Service initialized with base URL: {self.base_url}")
        
    def _get_cached_result(self, cache_key: str) -> Optional[Dict]:
        """Get a cached result if it exists and is not expired."""
        if not self.cache_enabled:
            return None
            
        now = datetime.now()
        if (cache_key in self._cache and 
            cache_key in self._cache_expiry and 
            now < self._cache_expiry[cache_key]):
            return self._cache[cache_key]
        return None
    
    def _set_cached_result(self, cache_key: str, result: Dict) -> None:
        """Cache a result with an expiry time."""
        if not self.cache_enabled:
            return
            
        self._cache[cache_key] = result
        self._cache_expiry[cache_key] = datetime.now() + timedelta(seconds=self.cache_ttl)
    
    def _make_api_request(self, endpoint: str, data: Dict) -> Dict:
        """Make an authenticated API request to the AI/ML service."""
        if not self.enabled:
            return {"error": "AI/ML features are currently disabled"}
            
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'X-API-Version': '1.0',
            'X-Request-ID': os.urandom(8).hex()
        }
        
        url = f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        
        try:
            logger.debug(f"Making request to {url} with data: {data}")
            response = requests.post(
                url,
                json=data,
                headers=headers,
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.RequestException as e:
            error_msg = f"AI/ML API request to {endpoint} failed: {str(e)}"
            logger.error(error_msg, exc_info=True)
            return {"error": error_msg}
    
    @lru_cache(maxsize=100)
    def analyze_event_data(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze event data using AI/ML.
        
        Args:
            event_data: Dictionary containing event data
            
        Returns:
            Dict containing analysis results
        """
        if not ai_config.FEATURE_ANALYTICS:
            return {"error": "Event analytics feature is disabled"}
            
        # Create a cache key based on the event data
        cache_key = f"analyze_{hash(frozenset(event_data.items()))}"
        
        # Check cache first
        cached_result = self._get_cached_result(cache_key)
        if cached_result:
            logger.debug("Returning cached analysis result")
            return cached_result
        
        # Make API request if not in cache
        result = self._make_api_request(
            "/analyze",
            {
                "event_data": event_data,
                "model": self.default_model,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        
        # Cache the result
        if "error" not in result:
            self._set_cached_result(cache_key, result)
            
        return result
    
    def predict_attendance(self, event_id: str, historical_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict event attendance using AI/ML.
        
        Args:
            event_id: ID of the event
            historical_data: Historical event data for prediction
            
        Returns:
            Dict containing prediction results with confidence scores
        """
        if not ai_config.FEATURE_PREDICTIONS:
            return {
                "error": "Attendance prediction feature is disabled",
                "prediction": None,
                "confidence": 0.0,
                "model": self.default_model
            }
            
        # Create a cache key based on the event ID and historical data
        cache_key = f"predict_{event_id}_{hash(frozenset(str(historical_data).encode()))}"
        
        # Check cache first
        cached_result = self._get_cached_result(cache_key)
        if cached_result:
            logger.debug(f"Returning cached prediction for event {event_id}")
            return cached_result
        
        # Make API request if not in cache
        result = self._make_api_request(
            "/predict/attendance",
            {
                "event_id": event_id,
                "historical_data": historical_data,
                "model": self.default_model,
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        
        # Add default values if prediction is successful
        if "error" not in result:
            result.setdefault("prediction", 0)
            result.setdefault("confidence", 0.0)
            result.setdefault("model", self.default_model)
            self._set_cached_result(cache_key, result)
            
        return result

    def get_recommendations(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Get AI-powered recommendations for an event.
        
        Args:
            event_data: Dictionary containing event data
            
        Returns:
            Dict containing recommendations with scores and metadata
        """
        if not ai_config.FEATURE_RECOMMENDATIONS:
            return {
                "error": "Recommendations feature is disabled",
                "recommendations": [],
                "model": self.default_model
            }
            
        # Create a cache key based on the event data
        cache_key = f"recs_{hash(frozenset(event_data.items()))}"
        
        # Check cache first
        cached_result = self._get_cached_result(cache_key)
        if cached_result:
            logger.debug("Returning cached recommendations")
            return cached_result
        
        # Make API request if not in cache
        result = self._make_api_request(
            "/recommendations",
            {
                "event_data": event_data,
                "model": self.default_model,
                "timestamp": datetime.utcnow().isoformat(),
                "max_recommendations": 5  # Default number of recommendations
            }
        )
        
        # Add default values if request was successful
        if "error" not in result:
            result.setdefault("recommendations", [])
            result.setdefault("model", self.default_model)
            self._set_cached_result(cache_key, result)
            
        return result
        
    def get_feature_status(self) -> Dict[str, bool]:
        """
        Get the status of AI/ML features.
        
        Returns:
            Dict containing the status of each feature
        """
        return {
            "enabled": self.enabled,
            "cache_enabled": self.cache_enabled,
            "features": {
                "analytics": ai_config.FEATURE_ANALYTICS,
                "predictions": ai_config.FEATURE_PREDICTIONS,
                "recommendations": ai_config.FEATURE_RECOMMENDATIONS
            },
            "cache_ttl_seconds": self.cache_ttl,
            "default_model": self.default_model
        }
