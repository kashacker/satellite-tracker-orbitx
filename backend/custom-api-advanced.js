/**
 * OrbitX - Satellite Tracking API
 * 
 * Advanced satellite tracking API with accurate position calculations
 * Uses satellite.js library and free Celestrak TLE data
 * No API key required!
 */

const http = require('http');
const https = require('https');
const satellite = require('satellite.js');

const PORT = process.env.PORT || 3001;

// TLE data cache
let tleCache = {};
let lastTLEUpdate = {};
const TLE_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

// Satellite catalog cache - stores ALL satellites
let satelliteCatalog = [];
let catalogLastUpdate = 0;
const CATALOG_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Celestrak TLE sources for ALL satellite categories
const CELESTRAK_SOURCES = [
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle', category: 'Space Stations' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle', category: 'Brightest' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle', category: 'Active' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle', category: 'Weather' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=noaa&FORMAT=tle', category: 'NOAA' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=goes&FORMAT=tle', category: 'GOES' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=resource&FORMAT=tle', category: 'Earth Resources' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=geo&FORMAT=tle', category: 'Geostationary' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=gps-ops&FORMAT=tle', category: 'GPS' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=glo-ops&FORMAT=tle', category: 'GLONASS' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=galileo&FORMAT=tle', category: 'Galileo' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=beidou&FORMAT=tle', category: 'Beidou' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=science&FORMAT=tle', category: 'Science' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=engineering&FORMAT=tle', category: 'Engineering' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=education&FORMAT=tle', category: 'Education' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=military&FORMAT=tle', category: 'Military' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=cubesat&FORMAT=tle', category: 'CubeSats' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=other-comm&FORMAT=tle', category: 'Communications' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=iridium-NEXT&FORMAT=tle', category: 'Iridium NEXT' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle', category: 'Starlink' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=oneweb&FORMAT=tle', category: 'OneWeb' },
    { url: 'https://celestrak.org/NORAD/elements/gp.php?GROUP=planet&FORMAT=tle', category: 'Planet' }
];

// Fetch TLE from Celestrak
async function fetchTLE(noradId) {
    return new Promise((resolve, reject) => {
        const url = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${noradId}&FORMAT=TLE`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 && data.trim()) {
                    const lines = data.trim().split('\n');
                    if (lines.length >= 3) {
                        resolve({
                            name: lines[0].trim(),
                            line1: lines[1].trim(),
                            line2: lines[2].trim()
                        });
                    } else {
                        reject(new Error('Invalid TLE format'));
                    }
                } else {
                    reject(new Error(`Celestrak returned ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

// Fetch TLE catalog from a Celestrak source
async function fetchTLECatalog(sourceUrl) {
    return new Promise((resolve, reject) => {
        https.get(sourceUrl, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 && data.trim()) {
                    const satellites = [];
                    const lines = data.trim().split('\n');
                    
                    // Parse TLE format (3 lines per satellite)
                    for (let i = 0; i < lines.length; i += 3) {
                        if (i + 2 < lines.length) {
                            const name = lines[i].trim();
                            const line1 = lines[i + 1].trim();
                            const line2 = lines[i + 2].trim();
                            
                            // Extract NORAD ID from line 1
                            const noradId = parseInt(line1.substring(2, 7));
                            
                            if (noradId && name) {
                                satellites.push({
                                    satid: noradId,
                                    satname: name
                                });
                            }
                        }
                    }
                    resolve(satellites);
                } else {
                    resolve([]);
                }
            });
        }).on('error', () => resolve([]));
    });
}

// Fetch ALL satellites from Celestrak
async function fetchAllSatellites() {
    console.log('📡 Fetching satellite catalog from Celestrak...');
    const allSatellites = [];
    const seenIds = new Set();
    
    // Fetch from all sources in parallel
    const promises = CELESTRAK_SOURCES.map(async (source) => {
        try {
            const sats = await fetchTLECatalog(source.url);
            return sats.map(sat => ({ ...sat, category: source.category }));
        } catch (error) {
            console.warn(`Failed to fetch ${source.category}:`, error.message);
            return [];
        }
    });
    
    const results = await Promise.all(promises);
    
    // Combine and deduplicate
    results.forEach(sats => {
        sats.forEach(sat => {
            if (!seenIds.has(sat.satid)) {
                seenIds.add(sat.satid);
                allSatellites.push(sat);
            }
        });
    });
    
    console.log(`✅ Loaded ${allSatellites.length} satellites from Celestrak`);
    return allSatellites;
}

// Get satellite catalog with caching
async function getSatelliteCatalog() {
    const now = Date.now();
    
    // Check if catalog needs refresh
    if (satelliteCatalog.length === 0 || (now - catalogLastUpdate) > CATALOG_CACHE_DURATION) {
        satelliteCatalog = await fetchAllSatellites();
        catalogLastUpdate = now;
    }
    
    return satelliteCatalog;
}

// Get TLE with caching
async function getTLE(noradId) {
    const now = Date.now();
    
    // Check cache
    if (tleCache[noradId] && (now - lastTLEUpdate[noradId]) < TLE_CACHE_DURATION) {
        return tleCache[noradId];
    }
    
    // Fetch new TLE
    const tle = await fetchTLE(noradId);
    tleCache[noradId] = tle;
    lastTLEUpdate[noradId] = now;
    
    return tle;
}

// Calculate satellite position
function calculatePosition(tle, observerLat, observerLng, observerAlt, date = new Date()) {
    // Initialize satellite record
    const satrec = satellite.twoline2satrec(tle.line1, tle.line2);
    
    // Get position and velocity
    const positionAndVelocity = satellite.propagate(satrec, date);
    
    if (positionAndVelocity.position === false) {
        throw new Error('Satellite position calculation failed');
    }
    
    const positionEci = positionAndVelocity.position;
    
    // Convert to geodetic coordinates
    const gmst = satellite.gstime(date);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);
    
    // Convert to degrees
    const latitude = satellite.degreesLat(positionGd.latitude);
    const longitude = satellite.degreesLong(positionGd.longitude);
    const altitude = positionGd.height; // km
    
    // Calculate look angles from observer
    const observerGd = {
        latitude: observerLat * Math.PI / 180,
        longitude: observerLng * Math.PI / 180,
        height: observerAlt / 1000 // convert to km
    };
    
    const positionEcf = satellite.eciToEcf(positionEci, gmst);
    const lookAngles = satellite.ecfToLookAngles(observerGd, positionEcf);
    
    return {
        satlatitude: latitude,
        satlongitude: longitude,
        sataltitude: altitude,
        azimuth: lookAngles.azimuth * 180 / Math.PI,
        elevation: lookAngles.elevation * 180 / Math.PI,
        rangeSat: lookAngles.rangeSat,
        timestamp: Math.floor(date.getTime() / 1000)
    };
}

// HTTP Server
const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const path = req.url;
    
    try {
        // /api/position/:noradId/:lat/:lng/:alt
        if (path.match(/^\/api\/position\/\d+\/-?\d+\.?\d*\/-?\d+\.?\d*\/\d+/)) {
            const parts = path.split('/').filter(p => p);
            const noradId = parseInt(parts[2]);
            const lat = parseFloat(parts[3]);
            const lng = parseFloat(parts[4]);
            const alt = parseFloat(parts[5]);
            
            const tle = await getTLE(noradId);
            const position = calculatePosition(tle, lat, lng, alt);
            
            res.writeHead(200);
            res.end(JSON.stringify({
                info: {
                    satname: tle.name,
                    satid: noradId,
                    transactionscount: 0
                },
                positions: [position]
            }));
        }
        
        // /api/tle/:noradId
        else if (path.match(/^\/api\/tle\/\d+/)) {
            const parts = path.split('/').filter(p => p);
            const noradId = parseInt(parts[2]);
            
            const tle = await getTLE(noradId);
            
            res.writeHead(200);
            res.end(JSON.stringify({
                info: {
                    satid: noradId,
                    satname: tle.name,
                    transactionscount: 0
                },
                tle: `${tle.line1}\r\n${tle.line2}`
            }));
        }
        
        // /api/satellites - Returns ALL satellites from Celestrak
        else if (path === '/api/satellites') {
            const satellites = await getSatelliteCatalog();
            
            res.writeHead(200);
            res.end(JSON.stringify({ 
                satellites,
                total: satellites.length,
                source: 'Celestrak'
            }));
        }
        
        // /api/satellites/search?q=query - Search satellites
        else if (path.startsWith('/api/satellites/search')) {
            const urlParams = new URL(path, `http://localhost`).searchParams;
            const query = urlParams.get('q')?.toLowerCase() || '';
            
            const satellites = await getSatelliteCatalog();
            const filtered = satellites.filter(sat => 
                sat.satname.toLowerCase().includes(query) ||
                sat.satid.toString().includes(query) ||
                sat.category?.toLowerCase().includes(query)
            );
            
            res.writeHead(200);
            res.end(JSON.stringify({ 
                satellites: filtered.slice(0, 100), // Limit to 100 results
                total: filtered.length,
                query
            }));
        }
        
        // /api/satellites/category/:category - Get satellites by category
        else if (path.match(/^\/api\/satellites\/category\//)) {
            const parts = path.split('/').filter(p => p);
            const category = decodeURIComponent(parts[3]);
            
            const satellites = await getSatelliteCatalog();
            const filtered = satellites.filter(sat => 
                sat.category?.toLowerCase() === category.toLowerCase()
            );
            
            res.writeHead(200);
            res.end(JSON.stringify({ 
                satellites: filtered,
                total: filtered.length,
                category
            }));
        }
        
        // /api/health
        else if (path === '/api/health') {
            res.writeHead(200);
            res.end(JSON.stringify({
                status: 'ok',
                name: 'OrbitX API',
                version: '1.0.0',
                message: 'Satellite tracking API powered by satellite.js',
                satellites: satelliteCatalog.length,
                cached_tle: Object.keys(tleCache).length,
                source: 'Celestrak'
            }));
        }
        
        else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Not found' }));
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
    }
});

server.listen(PORT, '0.0.0.0', async () => {
    console.log(`🛰️  OrbitX API running on port ${PORT}`);
    console.log(`📡 Accurate satellite tracking with satellite.js`);
    console.log(`📡 TLE data from Celestrak (no API key needed!)`);
    console.log(`\n✨ Endpoints:`);
    console.log(`   GET /api/position/:noradId/:lat/:lng/:alt`);
    console.log(`   GET /api/tle/:noradId`);
    console.log(`   GET /api/satellites`);
    console.log(`   GET /api/satellites/search?q=query`);
    console.log(`   GET /api/satellites/category/:category`);
    console.log(`   GET /api/health`);
    console.log(`\n📥 Loading satellite catalog...`);
    
    // Preload satellite catalog
    await getSatelliteCatalog();
    
    console.log(`✅ Ready! Tracking ${satelliteCatalog.length} satellites`);
    console.log(`⏹️  Press Ctrl+C to stop\n`);
});
