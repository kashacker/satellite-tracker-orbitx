/**
 * Satellite Tracker Configuration
 * OrbitX API - Version 2.0
 * 
 * This file contains all configuration settings for the satellite tracker application.
 * Modify these settings according to your needs.
 */

const CONFIG = {
    VERSION: '2.0.0',
    // ===== OrbitX Backend Configuration =====
    // Using OrbitX API (no API key required!)
    USE_LOCAL_SERVER: true,
    LOCAL_SERVER_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:10000/api'
        : 'https://satellite-tracker-orbitx.onrender.com/api',
    
    // ===== CORS Configuration =====
    USE_CORS_PROXY: false,
    CORS_PROXY_URL: '',
    
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
