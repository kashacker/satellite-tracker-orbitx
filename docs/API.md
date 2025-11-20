# 📡 OrbitX API Documentation

Complete API reference for the OrbitX Satellite Tracking API.

## Base URL

```
Production: https://satellite-tracker-production-008a.up.railway.app/api
Local: http://localhost:3001/api
```

## Authentication

**No authentication required!** OrbitX API is completely free and open.

## Rate Limits

**No rate limits!** Make as many requests as you need.

---

## Endpoints

### 1. Health Check

Check API status and statistics.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "name": "OrbitX API",
  "version": "1.0.0",
  "message": "Satellite tracking API powered by satellite.js",
  "satellites": 13414,
  "cached_tle": 150,
  "source": "Celestrak"
}
```

**Example:**
```bash
curl https://satellite-tracker-production-008a.up.railway.app/api/health
```

---

### 2. Get Satellite Position

Get real-time position of a satellite.

**Endpoint:** `GET /position/:noradId/:lat/:lng/:alt`

**Parameters:**
- `noradId` (required) - Satellite NORAD ID (e.g., 25544 for ISS)
- `lat` (required) - Observer latitude in degrees
- `lng` (required) - Observer longitude in degrees
- `alt` (required) - Observer altitude in meters

**Response:**
```json
{
  "info": {
    "satname": "ISS (ZARYA)",
    "satid": 25544,
    "transactionscount": 0
  },
  "positions": [{
    "satlatitude": 45.1234,
    "satlongitude": -122.5678,
    "sataltitude": 408.5,
    "azimuth": 180.5,
    "elevation": 45.2,
    "rangeSat": 1234.5,
    "timestamp": 1699545600
  }]
}
```

**Example:**
```bash
curl https://satellite-tracker-production-008a.up.railway.app/api/position/25544/40.7128/-74.0060/0
```

---

### 3. Get TLE Data

Get Two-Line Element (TLE) data for a satellite.

**Endpoint:** `GET /tle/:noradId`

**Parameters:**
- `noradId` (required) - Satellite NORAD ID

**Response:**
```json
{
  "info": {
    "satid": 25544,
    "satname": "ISS (ZARYA)",
    "transactionscount": 0
  },
  "tle": "1 25544U 98067A   25312.42041502  .00013418  00000-0  24734-3 0  9991\r\n2 25544  51.6332 312.3676 0004093  47.8963 312.2376 15.49442694123456"
}
```

**Example:**
```bash
curl https://satellite-tracker-production-008a.up.railway.app/api/tle/25544
```

---

### 4. Get All Satellites

Get list of all tracked satellites.

**Endpoint:** `GET /satellites`

**Response:**
```json
{
  "satellites": [
    {
      "satid": 25544,
      "satname": "ISS (ZARYA)",
      "category": "Space Stations"
    },
    {
      "satid": 48274,
      "satname": "STARLINK-3090",
      "category": "Starlink"
    }
    // ... 13,412 more satellites
  ],
  "total": 13414,
  "source": "Celestrak"
}
```

**Example:**
```bash
curl https://satellite-tracker-production-008a.up.railway.app/api/satellites
```

**Note:** Returns all 13,414 satellites. Response is ~700KB. Consider using search or category filters for better performance.

---

### 5. Search Satellites

Search satellites by name, ID, or category.

**Endpoint:** `GET /satellites/search?q=query`

**Parameters:**
- `q` (required) - Search query (minimum 2 characters)

**Response:**
```json
{
  "satellites": [
    {
      "satid": 44714,
      "satname": "STARLINK-1008",
      "category": "Starlink"
    },
    {
      "satid": 44716,
      "satname": "STARLINK-1010",
      "category": "Starlink"
    }
    // ... up to 100 results
  ],
  "total": 8800,
  "query": "starlink"
}
```

**Example:**
```bash
curl "https://satellite-tracker-production-008a.up.railway.app/api/satellites/search?q=starlink"
```

**Notes:**
- Case-insensitive search
- Searches name, ID, and category
- Returns maximum 100 results
- `total` shows total matches found

---

### 6. Get Satellites by Category

Get all satellites in a specific category.

**Endpoint:** `GET /satellites/category/:category`

**Parameters:**
- `category` (required) - Category name (case-insensitive)

**Available Categories:**
- Space Stations
- Starlink
- GPS
- GLONASS
- Galileo
- Beidou
- Weather
- Science
- Communications
- CubeSats
- Active
- Brightest
- NOAA
- GOES
- Earth Resources
- Geostationary
- Engineering
- Education
- Military
- Iridium NEXT
- OneWeb
- Planet

**Response:**
```json
{
  "satellites": [
    {
      "satid": 25544,
      "satname": "ISS (ZARYA)",
      "category": "Space Stations"
    },
    {
      "satid": 48274,
      "satname": "CSS (TIANHE)",
      "category": "Space Stations"
    }
  ],
  "total": 26,
  "category": "Space Stations"
}
```

**Example:**
```bash
curl "https://satellite-tracker-production-008a.up.railway.app/api/satellites/category/Space%20Stations"
```

---

## Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 404 | Endpoint not found |
| 500 | Server error |

---

## Error Handling

All errors return JSON:

```json
{
  "error": "Error message description"
}
```

---

## Data Sources

- **TLE Data**: [Celestrak](https://celestrak.org)
- **Calculations**: [satellite.js](https://github.com/shashwatak/satellite-js)
- **Update Frequency**: TLE data cached for 6 hours, catalog cached for 24 hours

---

## Performance

- **Response Time**: <100ms (cached data)
- **TLE Cache**: 6 hours
- **Catalog Cache**: 24 hours
- **Concurrent Requests**: Unlimited

---

## CORS

CORS is enabled for all origins:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Examples

### JavaScript (Fetch)

```javascript
// Get ISS position
const response = await fetch(
  'https://satellite-tracker-production-008a.up.railway.app/api/position/25544/40.7128/-74.0060/0'
);
const data = await response.json();
console.log(data.positions[0]);
```

### Python (Requests)

```python
import requests

# Search for Starlink satellites
response = requests.get(
    'https://satellite-tracker-production-008a.up.railway.app/api/satellites/search',
    params={'q': 'starlink'}
)
data = response.json()
print(f"Found {data['total']} Starlink satellites")
```

### cURL

```bash
# Get all GPS satellites
curl "https://satellite-tracker-production-008a.up.railway.app/api/satellites/category/GPS"
```

---

## Best Practices

1. **Cache responses** - TLE data doesn't change frequently
2. **Use search/category** - Instead of fetching all 13,414 satellites
3. **Batch requests** - If tracking multiple satellites
4. **Handle errors** - Check response status codes

---

## Support

For issues or questions:
- GitHub Issues
- API Status: Check `/health` endpoint

---

**OrbitX API** - Free satellite tracking for everyone! 🛰️
