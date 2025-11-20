# 🛰️ Satellite Tracker - OrbitX

Real-time satellite tracking application powered by OrbitX API. Track 13,414+ satellites with no API key required!

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Satellites](https://img.shields.io/badge/satellites-13,414-orange)

## ✨ Features

- 🌍 **Real-time Tracking** - Track any satellite with live position updates
- 🗺️ **Interactive Map** - Dark-themed map with CartoDB tiles
- 🔍 **Smart Search** - Search through 13,414+ satellites instantly
- 📂 **22 Categories** - Filter by Starlink, GPS, Weather, Science, etc.
- 📡 **Satellite Info** - Detailed information for popular satellites
- 📱 **Fully Responsive** - Works on desktop, tablet, and mobile
- ⚡ **Auto-refresh** - Positions update every 5 seconds
- 🆓 **No API Key** - Completely free, no registration needed
- ♾️ **No Rate Limits** - Unlimited requests

## 🚀 Quick Start

### Option 1: Use Deployed Version

Visit: [Your Hosted URL]

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sat-tracker
   ```

2. **Start the backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend runs on http://localhost:3001

3. **Open the frontend**
   - Simply open `index.html` in your browser
   - Or use a local server:
   ```bash
   python -m http.server 8000
   # Visit http://localhost:8000
   ```

## 📦 Project Structure

```
sat-tracker/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   └── styles.css        # Styles
│   └── js/
│       ├── app.js            # Main application logic
│       ├── config.js         # Configuration
│       └── satellite-database.js  # Satellite info database
├── backend/
│   ├── custom-api-advanced.js    # OrbitX API server
│   ├── package.json              # Dependencies
│   ├── Procfile                  # Railway deployment
│   ├── railway.json              # Railway config
│   └── nixpacks.toml             # Nixpacks config
└── DEPLOY.md                 # Deployment guide
```

## 🔧 Configuration

Edit `assets/js/config.js`:

```javascript
const CONFIG = {
    // Backend URL (auto-detects localhost vs production)
    LOCAL_SERVER_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api'
        : 'https://your-backend-url.railway.app/api',
    
    // Observer location
    OBSERVER: {
        latitude: 40.7128,   // Your latitude
        longitude: -74.0060, // Your longitude
        altitude: 0          // Altitude in meters
    },
    
    // Update interval (milliseconds)
    UPDATE_INTERVAL: 5000  // 5 seconds
};
```

## 🛰️ OrbitX API

### Endpoints

**Get Satellite Position**
```
GET /api/position/:noradId/:lat/:lng/:alt
```

**Get TLE Data**
```
GET /api/tle/:noradId
```

**Get All Satellites**
```
GET /api/satellites
```

**Search Satellites**
```
GET /api/satellites/search?q=query
```

**Filter by Category**
```
GET /api/satellites/category/:category
```

**Health Check**
```
GET /api/health
```

### Example Requests

```bash
# Get ISS position
curl https://your-backend.railway.app/api/position/25544/40.7128/-74.0060/0

# Search for Starlink satellites
curl https://your-backend.railway.app/api/satellites/search?q=starlink

# Get all GPS satellites
curl https://your-backend.railway.app/api/satellites/category/GPS
```

## 🎯 Popular Satellites

| Name | NORAD ID | Category |
|------|----------|----------|
| ISS (International Space Station) | 25544 | Space Stations |
| Hubble Space Telescope | 20580 | Science |
| Tiangong (Chinese Space Station) | 37820 | Space Stations |
| Starlink Satellites | Various | Communications |

## 📡 Satellite Categories

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
- And 12 more...

## 🚀 Deployment

### Backend (Railway)

1. Push to GitHub
2. Connect to Railway
3. Auto-deploys!

See [DEPLOY.md](DEPLOY.md) for detailed instructions.

### Frontend (Any Static Host)

Deploy to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

## 🛠️ Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Leaflet.js (Maps)
- CartoDB (Map tiles)

**Backend:**
- Node.js
- satellite.js (Position calculations)
- Celestrak (TLE data source)

## 📊 Features in Detail

### Real-time Tracking
- Updates every 5 seconds
- Accurate position calculations using satellite.js
- Shows latitude, longitude, altitude, azimuth, elevation

### Search & Filter
- Search by satellite name or NORAD ID
- Filter by 22 different categories
- Instant results from 13,414+ satellites

### Satellite Information
- Detailed info for popular satellites
- Mission details
- Launch dates
- Orbital parameters

### Interactive Map
- Dark theme for better visibility
- Click to track satellites
- Zoom and pan
- Satellite path visualization

## 🔒 Privacy & Security

- No user data collected
- No API keys required
- No registration needed
- Open source

## 📝 License

MIT License - feel free to use for any purpose!

## 🙏 Credits

- **TLE Data**: [Celestrak](https://celestrak.org)
- **Map Tiles**: [CartoDB](https://carto.com)
- **Calculations**: [satellite.js](https://github.com/shashwatak/satellite-js)
- **Maps**: [Leaflet.js](https://leafletjs.com)

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check the [DEPLOY.md](DEPLOY.md) guide

## 🌟 Star This Project

If you find this useful, please give it a star! ⭐

---

Made with ❤️ by Kashinath | Powered by OrbitX API
