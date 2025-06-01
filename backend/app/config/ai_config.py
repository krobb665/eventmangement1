import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class AIConfig:
    """Configuration class for AI/ML service."""
    
    # API Key - using the provided key or from environment variable
    API_KEY = os.getenv('AI_ML_API_KEY', 'b514b8e59e5c44e49b0cd67342dfa9e7')
    
    # Base URL for the AI/ML service
    BASE_URL = os.getenv('AI_ML_BASE_URL', 'https://api.example.com/ai-ml')
    
    # Timeout for API requests in seconds
    REQUEST_TIMEOUT = int(os.getenv('AI_ML_REQUEST_TIMEOUT', '30'))
    
    # Enable/disable AI features
    ENABLED = os.getenv('AI_ML_ENABLED', 'true').lower() == 'true'
    
    # Cache settings
    CACHE_ENABLED = os.getenv('AI_CACHE_ENABLED', 'true').lower() == 'true'
    CACHE_TTL = int(os.getenv('AI_CACHE_TTL', '3600'))  # 1 hour in seconds
    
    # Model settings
    DEFAULT_MODEL = os.getenv('AI_DEFAULT_MODEL', 'event-prediction-v1')
    
    # Rate limiting
    RATE_LIMIT = int(os.getenv('AI_RATE_LIMIT', '100'))  # requests per hour
    
    # Logging level
    LOG_LEVEL = os.getenv('AI_LOG_LEVEL', 'INFO')
    
    # Feature flags
    FEATURE_ANALYTICS = os.getenv('AI_FEATURE_ANALYTICS', 'true').lower() == 'true'
    FEATURE_PREDICTIONS = os.getenv('AI_FEATURE_PREDICTIONS', 'true').lower() == 'true'
    FEATURE_RECOMMENDATIONS = os.getenv('AI_FEATURE_RECOMMENDATIONS', 'true').lower() == 'true'

# Create an instance of the config
config = AIConfig()
