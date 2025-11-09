/**
 * Satellite Tracker Configuration
 * 
 * This file contains all configuration settings for the satellite tracker application.
 * Modify these settings according to your needs.
 */

const CONFIG = {
    // ===== Backend Server Configuration =====
    // Using OrbitX API (no API key required!)
    USE_LOCAL_SERVER: true,
    LOCAL_SERVER_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api'
        : 'https://satellite-tracker-production-6750.up.railway.app/api',
    
    // ===== CORS Proxy Configuration =====
    // Not needed - Railway backend handles CORS
    USE_CORS_PROXY: false,
    CORS_PROXY_URL: '',
    
    // ===== N2YO API Configuration =====
    // Get your API key from: https://www.n2yo.com/api/
    N2YO_API_KEY: '34G9M7-CA6GC5-UWSAU2-5LMI',
    N2YO_BASE_URL: 'https://api.n2yo.com/rest/v1/satellite',
    
    // ===== Observer Location =====
    // Set your location coordinates for accurate satellite tracking
    // You can find your coordinates at: https://www.latlong.net/
    OBSERVER: {
        latitude: 40.7128,   // New York City latitude
        longitude: -74.0060, // New York City longitude
        altitude: 0          // Altitude in meters above sea level
    },
    
    // ===== Update Settings =====
    // How often to update satellite positions (in milliseconds)
    UPDATE_INTERVAL: 5000,  // 5 seconds
    
    // ===== Satellite Categories =====
    // N2YO API category IDs for fetching different types of satellites
    CATEGORIES: {
        SPACE_STATIONS: 52,
        BRIGHTEST: 1,
        IRIDIUM: 15,
        GPS: 25,
        GLONASS: 26,
        GALILEO: 28,
        BEIDOU: 29,
        WEATHER: 3,
        EARTH_RESOURCES: 6,
        GEOSTATIONARY: 10,
        CUBESATS: 42,
        AMATEUR_RADIO: 45,
        SCIENCE: 35,
        MILITARY: 40
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
