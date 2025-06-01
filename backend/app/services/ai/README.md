# AI/ML Integration

This directory contains the AI/ML integration for the Event Management System. The AI service provides various capabilities including event analysis, attendance prediction, and personalized recommendations.

## Features

1. **Event Analysis**
   - Analyze event data to extract insights
   - Sentiment analysis of event feedback
   - Topic modeling for event content

2. **Attendance Prediction**
   - Predict event attendance based on historical data
   - Confidence scoring for predictions
   - Caching for improved performance

3. **Recommendations**
   - Personalized event recommendations
   - Venue suggestions
   - Time slot optimization
   - Content recommendations

## Configuration

Configuration is managed through environment variables and the `ai_config.py` file. Here are the available settings:

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_ML_API_KEY` | `b514b8e59e5c44e49b0cd67342dfa9e7` | API key for the AI/ML service |
| `AI_ML_BASE_URL` | `https://api.example.com/ai-ml` | Base URL for the AI/ML API |
| `AI_ML_ENABLED` | `true` | Enable/disable AI features |
| `AI_CACHE_ENABLED` | `true` | Enable/disable caching |
| `AI_CACHE_TTL` | `3600` | Cache time-to-live in seconds |
| `AI_DEFAULT_MODEL` | `event-prediction-v1` | Default model to use |

## API Endpoints

### Analyze Event

```
GET /api/ai/analyze-event/<int:event_id>
```

Analyze an event using AI/ML.

**Authentication Required**: Yes

**Parameters**:
- `event_id` (path, required): ID of the event to analyze

**Response**:
```json
{
  "success": true,
  "analysis": {
    "sentiment": "positive",
    "key_topics": ["technology", "innovation"],
    "engagement_score": 0.87
  }
}
```

### Predict Attendance

```
GET /api/ai/predict-attendance/<int:event_id>
```

Predict attendance for an event.

**Authentication Required**: Yes

**Parameters**:
- `event_id` (path, required): ID of the event to predict attendance for

**Response**:
```json
{
  "success": true,
  "prediction": 150,
  "confidence": 0.85,
  "model": "event-prediction-v1"
}
```

### Get Recommendations

```
GET /api/ai/recommendations/<int:event_id>
```

Get AI-powered recommendations for an event.

**Authentication Required**: Yes

**Parameters**:
- `event_id` (path, required): ID of the event to get recommendations for

**Response**:
```json
{
  "success": true,
  "recommendations": [
    {
      "type": "venue",
      "title": "Downtown Conference Center",
      "score": 0.92,
      "reason": "Matches your event size and budget"
    },
    {
      "type": "time_slot",
      "title": "Morning Slot (9 AM - 12 PM)",
      "score": 0.87,
      "reason": "Higher attendance based on similar events"
    }
  ]
}
```

## Testing

Run the test suite with:

```bash
pytest tests/test_ai_service.py -v
```

## Error Handling

The service includes comprehensive error handling and logging. All API errors are caught and returned with appropriate status codes and error messages.

## Dependencies

- Python 3.8+
- requests
- python-dotenv
- pytest (for testing)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
