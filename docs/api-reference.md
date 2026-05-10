# API Reference

StillUp provides a robust REST API for integrating your services and extracting intelligence data.

## Authentication

### API Keys
External services (like your cron jobs or servers) should use **X-API-Key** header.
```bash
curl -X POST https://api.stillup.io/api/heartbeats \
     -H "X-API-Key: YOUR_API_KEY"
```

### Session (Web UI)
The web dashboard uses secure HttpOnly cookies for authentication. No manual header management is required for frontend-to-backend communication.

---

## Heartbeat API

### Send a Heartbeat
`POST /api/heartbeats`

Updates the status of the monitor associated with the API Key.

**Headers:**
- `X-API-Key`: Your monitor or project API Key.

**Body (Optional):**
```json
{
  "status": "success",
  "metadata": {
    "server": "us-east-1",
    "version": "1.0.4"
  }
}
```

---

## Intelligence API

### Get Project Overview
`GET /api/analytics/project/overview`

Returns health scores, statuses, and patterns for all monitors in a project.

**Query Params:**
- `projectId`: The ID of the project.

**Response:**
```json
{
  "monitors": [
    {
      "id": "mon_123",
      "name": "Production DB",
      "healthScore": 98,
      "status": "UP",
      "failurePatterns": []
    }
  ]
}
```

### Get Monitor Pulse
`GET /api/analytics/:monitorId/pulse`

Returns the last 24 hours of heartbeat status for grid visualization.

---

## Error Handling

StillUp uses standard HTTP status codes:
- `200/201`: Success.
- `400`: Validation Error (check response for details).
- `401`: Unauthorized (Invalid or missing API key).
- `403`: Forbidden (Insufficient role or membership).
- `429`: Too Many Requests (Rate limit exceeded).
- `500`: Internal Server Error.
