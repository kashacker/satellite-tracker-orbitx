/**
 * Satellite Tracker Application
 * 
 * Real-time satellite tracking and visualization
 * 
 * @author Kashinath
 * @version 2.1.0
 * @license MIT
 * 
 * Features:
 * - Track 2800+ satellites in real-time
 * - Interactive map with Leaflet.js
 * - Comprehensive satellite information
 * - Visual passes calculation
 * - Fully responsive design
 * 
 * Made with ❤️ for satellite enthusiasts
 */

// Satellite Tracker Application
let map;
let satelliteMarker;
let satellitePath;
let updateInterval;
let currentSatelliteId = null;
let allSatellitesMarkers = [];
let allSatellitesInterval = null;
let allSatellitesData = [];

// Initialize the map
function initMap() {
    map = L.map('map').setView([20, 0], 2);
    
    // Use CartoDB Dark Matter tiles (free, no API key required)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);
}

// Create custom satellite icon
function createSatelliteIcon() {
    return L.divIcon({
        className: 'satellite-icon',
        html: '<div style="font-size: 30px;">🛰️</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

// Fetch satellite position
async function getSatellitePosition(noradId) {
    // Always use OrbitX API
    const url = `${CONFIG.LOCAL_SERVER_URL}/position/${noradId}/${CONFIG.OBSERVER.latitude}/${CONFIG.OBSERVER.longitude}/${CONFIG.OBSERVER.altitude}`;
    
    console.log('✅ Using OrbitX API:', url);
    console.log('📍 Config check:', {
        USE_LOCAL_SERVER: CONFIG.USE_LOCAL_SERVER,
        LOCAL_SERVER_URL: CONFIG.LOCAL_SERVER_URL,
        hostname: window.location.hostname
    });
    
    try {
        const response = await fetch(url);
        console.log('Response status:', response.status);
        console.log('Response URL:', response.url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            console.error('❌ Failed URL:', url);
            
            // Handle 401 Unauthorized error
            if (response.status === 401) {
                throw new Error(`API Authentication Error (401): The N2YO API key may be invalid or rate limit exceeded. Please wait a few minutes and try again.`);
            }
            
            throw new Error(`API Error: ${response.status} - ${errorText || 'Unknown error'}`);
        }
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        // Check if N2YO API returned an error
        if (data.error) {
            throw new Error(`N2YO API Error: ${data.error}`);
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching satellite position:', error);
        
        // Show user-friendly error message
        if (error.message.includes('401')) {
            showError('API rate limit reached. Please wait a few minutes and try again.');
        }
        
        throw error;
    }
}

// Fetch satellite TLE data
async function getSatelliteTLE(noradId) {
    // Always use OrbitX API
    const url = `${CONFIG.LOCAL_SERVER_URL}/tle/${noradId}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        
        // Check if N2YO API returned an error
        if (data.error) {
            throw new Error(`N2YO API Error: ${data.error}`);
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching TLE data:', error);
        throw error;
    }
}

// Fetch visual passes using OrbitX API
async function getVisualPasses(noradId, days = 10) {
    const url = `${CONFIG.LOCAL_SERVER_URL}/passes/${noradId}/${CONFIG.OBSERVER.latitude}/${CONFIG.OBSERVER.longitude}/${CONFIG.OBSERVER.altitude}/${days}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching visual passes:', error);
        return null;
    }
}

// Fetch satellites above location - Not supported by OrbitX yet
async function getSatellitesAbove(lat, lng, alt, radius = 90, category = 0) {
    // This feature is not supported by OrbitX API yet
    console.warn('Satellites above location not available in OrbitX API');
    return null;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        
        // Check if N2YO API returned an error
        if (data.error) {
            throw new Error(`N2YO API Error: ${data.error}`);
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching satellites above:', error);
        throw error;
    }
}

// Legacy function - replaced by OrbitX API version below
async function getSatellitesByCategoryLegacy(categoryId) {
    // This function is deprecated - use getSatellitesByCategory() instead
    console.warn('Using legacy category function - should use OrbitX API');
    return null;
}

// Fallback satellite list (when API fails)
function getFallbackSatellites() {
    return [
        { satid: 25544, satname: "ISS (ZARYA)", category: "Space Stations" },
        { satid: 20580, satname: "HST (HUBBLE)", category: "Science" },
        { satid: 37820, satname: "TIANGONG", category: "Space Stations" },
        { satid: 48274, satname: "STARLINK-3090", category: "Communications" },
        { satid: 25994, satname: "TERRA", category: "Earth Resources" },
        { satid: 27424, satname: "AQUA", category: "Earth Resources" },
        { satid: 33591, satname: "NOAA 18", category: "Weather" },
        { satid: 28654, satname: "NOAA 19", category: "Weather" },
        { satid: 43013, satname: "STARLINK-1007", category: "Communications" },
        { satid: 24792, satname: "IRIDIUM 8", category: "Communications" },
        { satid: 32711, satname: "GPS BIIR-2", category: "GPS" },
        { satid: 40128, satname: "GOES 16", category: "Weather" },
        { satid: 41866, satname: "GOES 17", category: "Weather" },
        { satid: 37849, satname: "BEIDOU-3 M1", category: "Beidou" },
        { satid: 41549, satname: "GALILEO 24", category: "Galileo" },
        { satid: 28474, satname: "GLONASS 730", category: "GLONASS" },
        { satid: 39634, satname: "SKYSAT-C1", category: "Earth Resources" },
        { satid: 43689, satname: "SENTINEL-6A", category: "Earth Resources" },
        { satid: 25338, satname: "NOAA 15", category: "Weather" },
        { satid: 29155, satname: "NOAA 16", category: "Weather" }
    ];
}

// Fetch all satellites from OrbitX API
async function getAllSatellites() {
    try {
        console.log('Fetching all satellites from OrbitX API...');
        
        // Use OrbitX API to get all satellites
        const url = `${CONFIG.LOCAL_SERVER_URL}/satellites`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Loaded ${data.total} satellites from OrbitX API`);
        
        return data.satellites;
    } catch (error) {
        console.error('Error fetching satellites from OrbitX API:', error);
        console.log('Using fallback satellite list...');
        return getFallbackSatellites();
    }
}

// Search satellites using OrbitX API
async function searchSatellites(query) {
    try {
        const url = `${CONFIG.LOCAL_SERVER_URL}/satellites/search?q=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Found ${data.total} satellites matching "${query}"`);
        
        return data.satellites;
    } catch (error) {
        console.error('Error searching satellites:', error);
        return [];
    }
}

// Get satellites by category using OrbitX API
async function getSatellitesByCategory(category) {
    try {
        const url = `${CONFIG.LOCAL_SERVER_URL}/satellites/category/${encodeURIComponent(category)}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`Found ${data.total} satellites in category "${category}"`);
        
        return data.satellites;
    } catch (error) {
        console.error('Error fetching category:', error);
        return [];
    }
}

// Legacy function - now uses OrbitX API
async function getAllSatellitesLegacy() {
    try {
        console.log('Fetching satellites (legacy method)...');
        
        // N2YO Categories:
        // 52 = Space Stations
        // 1 = Brightest satellites
        // 2 = ISS
        // 3 = Weather
        // 4 = NOAA
        // 5 = GOES
        // 6 = Earth Resources
        // 7 = Search & Rescue
        // 8 = Disaster Monitoring
        // 9 = Tracking and Data Relay
        // 10 = Geostationary
        // 11 = Intelsat
        // 12 = Gorizont
        // 13 = Raduga
        // 14 = Molniya
        // 15 = Iridium
        // 18 = Globalstar
        // 20 = Orbcomm
        // 25 = GPS Operational
        // 26 = Glonass Operational
        // 28 = Galileo
        // 29 = Beidou
        // 30 = Satellite-Based Augmentation System
        // 32 = Navy Navigation Satellite System
        // 33 = Russian LEO Navigation
        // 35 = Space & Earth Science
        // 37 = Geodetic
        // 38 = Engineering
        // 39 = Education
        // 40 = Military
        // 41 = Radar Calibration
        // 42 = CubeSats
        // 43 = XM and Sirius
        // 44 = TV
        // 45 = Amateur Radio
        // 46 = Experimental
        // 48 = Argos Data Collection System
        // 49 = Planet
        // 50 = Spire
        
        const categories = [52, 1, 15, 25, 26, 28, 29, 3, 6, 10, 42, 45, 35, 40];
        
        const promises = categories.map(cat => getSatellitesByCategory(cat));
        const results = await Promise.allSettled(promises);
        
        let allSats = [];
        const seenIds = new Set();
        
        results.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value) {
                // N2YO category endpoint returns different structure
                const sats = result.value.above || result.value.members || [];
                
                if (sats.length > 0) {
                    console.log(`Category ${categories[index]} (${getCategoryName(categories[index])}): ${sats.length} satellites`);
                }
                
                sats.forEach(sat => {
                    if (!seenIds.has(sat.satid)) {
                        seenIds.add(sat.satid);
                        allSats.push({
                            ...sat,
                            category: getCategoryName(categories[index])
                        });
                    }
                });
            } else if (result.status === 'rejected') {
                console.warn(`Category ${categories[index]} failed:`, result.reason);
            }
        });
        
        // If we got very few satellites, fallback to "above" endpoint
        if (allSats.length < 50) {
            console.log('Few satellites from categories, trying "above" endpoint...');
            try {
                const aboveData = await getSatellitesAbove(
                    CONFIG.OBSERVER.latitude,
                    CONFIG.OBSERVER.longitude,
                    CONFIG.OBSERVER.altitude,
                    90,
                    0
                );
                
                if (aboveData && aboveData.above) {
                    aboveData.above.forEach(sat => {
                        if (!seenIds.has(sat.satid)) {
                            seenIds.add(sat.satid);
                            allSats.push({
                                ...sat,
                                category: 'Visible'
                            });
                        }
                    });
                }
            } catch (error) {
                console.warn('Fallback to "above" endpoint failed:', error);
            }
        }
        
        console.log(`Fetched ${allSats.length} unique satellites from ${results.filter(r => r.status === 'fulfilled' && r.value).length} categories`);
        
        // If we got no satellites, use fallback list
        if (allSats.length === 0) {
            console.log('Using fallback satellite list...');
            return getFallbackSatellites();
        }
        
        return allSats;
        
    } catch (error) {
        console.error('Error fetching all satellites:', error);
        console.log('Using fallback satellite list...');
        return getFallbackSatellites();
    }
}

// Get category name
function getCategoryName(categoryId) {
    const categories = {
        52: 'Space Stations',
        1: 'Brightest',
        15: 'Iridium',
        25: 'GPS',
        26: 'GLONASS',
        28: 'Galileo',
        29: 'Beidou',
        3: 'Weather',
        6: 'Earth Resources',
        10: 'Geostationary',
        42: 'CubeSats',
        45: 'Amateur Radio',
        35: 'Science',
        40: 'Military'
    };
    return categories[categoryId] || 'Other';
}

// Update satellite information display
function updateSatelliteInfo(data, category = null) {
    const infoContent = document.getElementById('infoContent');
    const noradId = data.info.satid;
    
    // Get detailed information from database
    let satInfo = getSatelliteInfo(noradId);
    
    // If not in database, use generic info based on category
    if (!satInfo && category) {
        const genericInfo = getGenericSatelliteInfo(category);
        satInfo = {
            name: data.info.satname,
            purpose: genericInfo.purpose,
            description: genericInfo.description,
            type: genericInfo.type,
            operator: genericInfo.operator || 'Unknown',
            country: genericInfo.country || 'Unknown',
            orbit: genericInfo.orbit || 'Low Earth Orbit (LEO)',
            status: 'Operational'
        };
    }
    
    // Build comprehensive information display
    let html = `
        <div class="info-item">
            <strong>Name:</strong> ${data.info.satname}
        </div>
        <div class="info-item">
            <strong>NORAD ID:</strong> ${data.info.satid}
        </div>
    `;
    
    // Add detailed information if available
    if (satInfo) {
        html += `
            <div class="info-item info-highlight">
                <strong>Purpose:</strong> ${satInfo.purpose}
            </div>
            <div class="info-item info-description">
                <strong>Description:</strong><br>
                ${satInfo.description}
            </div>
            <div class="info-item">
                <strong>Type:</strong> ${satInfo.type}
            </div>
        `;
        
        if (satInfo.operator) {
            html += `
                <div class="info-item">
                    <strong>Operator:</strong> ${satInfo.operator}
                </div>
            `;
        }
        
        if (satInfo.country) {
            html += `
                <div class="info-item">
                    <strong>Country:</strong> ${satInfo.country}
                </div>
            `;
        }
        
        if (satInfo.launchDate) {
            html += `
                <div class="info-item">
                    <strong>Launch Date:</strong> ${satInfo.launchDate}
                </div>
            `;
        }
        
        if (satInfo.mass) {
            html += `
                <div class="info-item">
                    <strong>Mass:</strong> ${satInfo.mass}
                </div>
            `;
        }
        
        if (satInfo.orbit) {
            html += `
                <div class="info-item">
                    <strong>Orbit Type:</strong> ${satInfo.orbit}
                </div>
            `;
        }
        
        if (satInfo.status) {
            const statusClass = satInfo.status === 'Operational' ? 'status-active' : 'status-inactive';
            html += `
                <div class="info-item">
                    <strong>Status:</strong> <span class="${statusClass}">${satInfo.status}</span>
                </div>
            `;
        }
        
        if (satInfo.crew) {
            html += `
                <div class="info-item">
                    <strong>Crew:</strong> ${satInfo.crew}
                </div>
            `;
        }
        
        if (satInfo.constellation) {
            html += `
                <div class="info-item">
                    <strong>Constellation:</strong> ${satInfo.constellation}
                </div>
            `;
        }
        
        if (satInfo.instruments) {
            html += `
                <div class="info-item">
                    <strong>Instruments:</strong> ${satInfo.instruments}
                </div>
            `;
        }
        
        if (satInfo.website) {
            html += `
                <div class="info-item">
                    <strong>Website:</strong> <a href="${satInfo.website}" target="_blank" rel="noopener" style="color: #00d4ff;">Learn More</a>
                </div>
            `;
        }
    }
    
    // Add current orbital parameters
    html += `
        <div class="info-item">
            <strong>Current Altitude:</strong> ${data.positions[0].sataltitude.toFixed(2)} km
        </div>
        <div class="info-item">
            <strong>Velocity:</strong> ${(data.positions[0].sataltitude * 0.001).toFixed(2)} km/s
        </div>
    `;
    
    infoContent.innerHTML = html;
}

// Update position display
function updatePositionDisplay(position) {
    const positionContent = document.getElementById('positionContent');
    
    const timestamp = new Date(position.timestamp * 1000);
    
    positionContent.innerHTML = `
        <div class="info-item">
            <strong>Latitude:</strong> ${position.satlatitude.toFixed(4)}°
        </div>
        <div class="info-item">
            <strong>Longitude:</strong> ${position.satlongitude.toFixed(4)}°
        </div>
        <div class="info-item">
            <strong>Altitude:</strong> ${position.sataltitude.toFixed(2)} km
        </div>
        <div class="info-item">
            <strong>Azimuth:</strong> ${position.azimuth.toFixed(2)}°
        </div>
        <div class="info-item">
            <strong>Elevation:</strong> ${position.elevation.toFixed(2)}°
        </div>
        <div class="info-item">
            <strong>Last Update:</strong> ${timestamp.toLocaleString()}
        </div>
    `;
}

// Update passes display
function updatePassesDisplay(passes) {
    const passesContent = document.getElementById('passesContent');
    
    if (!passes || !passes.passes || passes.passes.length === 0) {
        passesContent.innerHTML = '<p class="loading">No visible passes in the next 10 days (elevation > 10°)</p>';
        return;
    }
    
    let html = `<div style="margin-bottom: 10px; padding: 8px; background: rgba(0,212,255,0.1); border-radius: 4px; font-size: 0.9em;">
        Found <strong>${passes.passes.length}</strong> visible passes in the next 10 days
    </div>`;
    
    passes.passes.slice(0, 10).forEach((pass, index) => {
        const startTime = new Date(pass.startUTC * 1000);
        const maxTime = new Date(pass.maxUTC * 1000);
        const endTime = new Date(pass.endUTC * 1000);
        
        // Determine visibility quality
        let quality = 'Good';
        let qualityColor = '#00d4ff';
        if (pass.maxEl > 60) {
            quality = 'Excellent';
            qualityColor = '#00ff88';
        } else if (pass.maxEl > 40) {
            quality = 'Very Good';
            qualityColor = '#00ffcc';
        } else if (pass.maxEl < 20) {
            quality = 'Fair';
            qualityColor = '#ffaa00';
        }
        
        // Get direction names
        const startDir = getDirectionName(pass.startAz);
        const endDir = getDirectionName(pass.endAz);
        
        html += `
            <div class="pass-item" style="border-left: 3px solid ${qualityColor};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <div class="pass-time" style="font-size: 1em; font-weight: bold;">${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
                    <div style="background: ${qualityColor}; color: #000; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; font-weight: bold;">${quality}</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 0.9em;">
                    <div><strong>Duration:</strong> ${Math.floor(pass.duration / 60)}m ${pass.duration % 60}s</div>
                    <div><strong>Max Elevation:</strong> ${pass.maxEl}°</div>
                    <div><strong>Rises:</strong> ${startDir} (${pass.startAz}°)</div>
                    <div><strong>Sets:</strong> ${endDir} (${pass.endAz}°)</div>
                    <div><strong>Peak Time:</strong> ${maxTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
                    <div><strong>Brightness:</strong> ${pass.mag > 0 ? '+' : ''}${pass.mag}</div>
                </div>
            </div>
        `;
    });
    
    if (passes.passes.length > 10) {
        html += `<div style="text-align: center; padding: 10px; color: #888; font-size: 0.9em;">
            Showing 10 of ${passes.passes.length} passes
        </div>`;
    }
    
    passesContent.innerHTML = html;
}

// Get compass direction name from azimuth
function getDirectionName(azimuth) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(azimuth / 22.5) % 16;
    return directions[index];
}

// Update satellite marker on map
function updateSatelliteMarker(lat, lng, name) {
    if (satelliteMarker) {
        map.removeLayer(satelliteMarker);
    }
    
    satelliteMarker = L.marker([lat, lng], {
        icon: createSatelliteIcon()
    }).addTo(map);
    
    satelliteMarker.bindPopup(`<b>${name}</b><br>Lat: ${lat.toFixed(4)}°<br>Lng: ${lng.toFixed(4)}°`);
    
    map.setView([lat, lng], 4);
}

// Clear all satellite markers
function clearAllSatelliteMarkers() {
    allSatellitesMarkers.forEach(marker => {
        map.removeLayer(marker);
    });
    allSatellitesMarkers = [];
}

// Update satellites list in sidebar
function updateSatellitesList(satellites) {
    const listContainer = document.getElementById('satellitesList');
    const countElement = document.getElementById('satCount');
    const panelHeader = document.querySelector('.panel-header');
    
    allSatellitesData = satellites;
    countElement.textContent = satellites.length;
    
    // Update data attribute for collapsed state display
    if (panelHeader) {
        panelHeader.setAttribute('data-count', satellites.length);
    }
    
    if (satellites.length === 0) {
        listContainer.innerHTML = '<p class="loading">No satellites found</p>';
        return;
    }
    
    listContainer.innerHTML = '';
    
    // Sort satellites by name
    const sortedSats = [...satellites].sort((a, b) => a.satname.localeCompare(b.satname));
    
    sortedSats.forEach(sat => {
        const item = document.createElement('div');
        item.className = 'satellite-item';
        item.dataset.satid = sat.satid;
        
        // Determine if satellite is active
        const hasPosition = sat.satlat !== undefined && sat.satlng !== undefined;
        const isActive = hasPosition ? sat.satalt > 200 : true; // Assume active if no position data
        
        const categoryBadge = sat.category ? `<span class="sat-category">${sat.category}</span>` : '';
        
        item.innerHTML = `
            <span class="sat-name">${sat.satname}</span>
            <div class="sat-details">
                <span>ID: ${sat.satid}</span>
                ${hasPosition ? `
                    <span>Alt: ${sat.satalt.toFixed(2)} km</span>
                    <span>Lat: ${sat.satlat.toFixed(2)}°</span>
                    <span>Lng: ${sat.satlng.toFixed(2)}°</span>
                ` : '<span>Position: Not available</span>'}
                ${categoryBadge}
            </div>
            <span class="sat-status ${isActive ? 'active' : 'inactive'}">
                ${isActive ? '● Active' : '○ Low Orbit'}
            </span>
        `;
        
        item.addEventListener('click', () => {
            // Remove active class from all items
            document.querySelectorAll('.satellite-item').forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            // Track the satellite with category info
            trackSatellite(sat.satid, sat.category);
        });
        
        listContainer.appendChild(item);
    });
}

// Filter satellites list
function filterSatellitesList(searchTerm) {
    const items = document.querySelectorAll('.satellite-item');
    const term = searchTerm.toLowerCase();
    
    items.forEach(item => {
        const name = item.querySelector('.sat-name').textContent.toLowerCase();
        const id = item.dataset.satid;
        
        if (name.includes(term) || id.includes(term)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Display all satellites on map
async function displayAllSatellites() {
    try {
        console.log('Fetching all satellites from multiple categories...');
        
        // Show loading in list
        document.getElementById('satellitesList').innerHTML = '<p class="loading">Loading satellites from all categories...</p>';
        
        // Clear existing markers
        clearAllSatelliteMarkers();
        
        // Fetch all satellites from multiple categories
        const allSats = await getAllSatellites();
        
        if (!allSats || allSats.length === 0) {
            console.log('No satellites data received');
            document.getElementById('satellitesList').innerHTML = '<p class="loading">No satellites found</p>';
            return;
        }
        
        console.log(`Displaying ${allSats.length} satellites`);
        
        // Update the sidebar list with ALL satellites
        updateSatellitesList(allSats);
        
        // Only show satellites with position data on map
        const satellitesWithPosition = allSats.filter(sat => sat.satlat !== undefined && sat.satlng !== undefined);
        
        satellitesWithPosition.forEach(sat => {
            const smallIcon = L.divIcon({
                className: 'small-satellite-icon',
                html: '<div style="width: 8px; height: 8px; background: #00d4ff; border-radius: 50%; border: 1px solid #fff;"></div>',
                iconSize: [8, 8],
                iconAnchor: [4, 4]
            });
            
            const marker = L.marker([sat.satlat, sat.satlng], {
                icon: smallIcon
            }).addTo(map);
            
            marker.bindPopup(`
                <b>${sat.satname}</b><br>
                NORAD ID: ${sat.satid}<br>
                Category: ${sat.category || 'N/A'}<br>
                Alt: ${sat.satalt.toFixed(2)} km<br>
                <button onclick="trackSatellite(${sat.satid})" style="margin-top: 5px; padding: 5px 10px; cursor: pointer;">Track</button>
            `);
            
            allSatellitesMarkers.push(marker);
        });
        
        console.log(`Showing ${satellitesWithPosition.length} satellites on map`);
        
        // Update every 60 seconds (increased from 30 to reduce API calls)
        if (allSatellitesInterval) {
            clearInterval(allSatellitesInterval);
        }
        
        allSatellitesInterval = setInterval(async () => {
            if (!currentSatelliteId) { // Only update if not tracking a specific satellite
                await displayAllSatellites();
            }
        }, 60000);
        
    } catch (error) {
        console.error('Error displaying all satellites:', error);
        document.getElementById('satellitesList').innerHTML = '<p class="error">Error loading satellites</p>';
    }
}

// Track satellite
async function trackSatellite(noradId, category = null) {
    try {
        currentSatelliteId = noradId;
        
        // Clear all satellites view
        clearAllSatelliteMarkers();
        if (allSatellitesInterval) {
            clearInterval(allSatellitesInterval);
        }
        
        // Show loading state
        document.getElementById('infoContent').innerHTML = '<p class="loading">Loading satellite data...</p>';
        document.getElementById('positionContent').innerHTML = '<p class="loading">Loading position...</p>';
        document.getElementById('passesContent').innerHTML = '<p class="loading">Loading passes...</p>';
        
        // Try to fetch data, but show database info even if API fails
        try {
            const [positionData, passesData] = await Promise.all([
                getSatellitePosition(noradId),
                getVisualPasses(noradId)
            ]);
            
            // Update displays with category information
            updateSatelliteInfo(positionData, category);
            updatePositionDisplay(positionData.positions[0]);
            updatePassesDisplay(passesData);
        
            // Update map
            updateSatelliteMarker(
                positionData.positions[0].satlatitude,
                positionData.positions[0].satlongitude,
                positionData.info.satname
            );
            
            // Clear existing interval
            if (updateInterval) {
                clearInterval(updateInterval);
            }
            
            // Set up auto-update
            updateInterval = setInterval(async () => {
                try {
                    const data = await getSatellitePosition(currentSatelliteId);
                    updatePositionDisplay(data.positions[0]);
                    updateSatelliteMarker(
                        data.positions[0].satlatitude,
                        data.positions[0].satlongitude,
                        data.info.satname
                    );
                } catch (error) {
                    console.error('Error updating position:', error);
                }
            }, CONFIG.UPDATE_INTERVAL);
            
        } catch (apiError) {
            // API failed, show database info instead
            console.warn('API unavailable, showing database information:', apiError);
            
            // Get satellite info from database
            const satInfo = getSatelliteInfo(noradId);
            const satelliteName = satInfo ? satInfo.name : `Satellite ${noradId}`;
            
            // Show database information
            const mockData = {
                info: { satname: satelliteName, satid: noradId },
                positions: [{
                    sataltitude: satInfo?.orbit?.includes('LEO') ? 400 : 20000,
                    satlatitude: 0,
                    satlongitude: 0,
                    azimuth: 0,
                    elevation: 0,
                    timestamp: Date.now() / 1000
                }]
            };
            
            updateSatelliteInfo(mockData, category);
            
            document.getElementById('positionContent').innerHTML = `
                <div class="info-item" style="background: rgba(255, 165, 0, 0.1); border-left-color: orange;">
                    <strong>⚠️ Live Position Unavailable</strong><br>
                    OrbitX API connection failed. Please ensure the backend server is running.<br><br>
                    <strong>To enable live tracking:</strong><br>
                    1. Start the backend server: <code>cd backend && npm start</code><br>
                    2. Verify server is running at: ${CONFIG.LOCAL_SERVER_URL}<br>
                    3. Refresh the page
                </div>
            `;
            
            document.getElementById('passesContent').innerHTML = `
                <div class="info-item" style="background: rgba(255, 165, 0, 0.1); border-left-color: orange;">
                    <strong>⚠️ Pass Predictions Unavailable</strong><br>
                    Unable to calculate passes. Please ensure the backend server is running.
                </div>
            `;
        }
        
    } catch (error) {
        document.getElementById('infoContent').innerHTML = `
            <div class="error">
                <strong>Error:</strong> ${error.message}<br>
                Please check your API key in config.js and ensure the NORAD ID is valid.
            </div>
        `;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initMap();
    
    // Display all satellites on load
    displayAllSatellites();
    
    // Track button
    document.getElementById('trackBtn').addEventListener('click', () => {
        const noradId = document.getElementById('satelliteId').value.trim();
        if (noradId) {
            trackSatellite(noradId);
        }
    });
    
    // Enter key support
    document.getElementById('satelliteId').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const noradId = document.getElementById('satelliteId').value.trim();
            if (noradId) {
                trackSatellite(noradId);
            }
        }
    });
    
    // Popular satellite buttons
    document.querySelectorAll('.sat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const noradId = btn.getAttribute('data-id');
            document.getElementById('satelliteId').value = noradId;
            trackSatellite(noradId);
        });
    });
    
    // Show all satellites button
    document.getElementById('showAllBtn').addEventListener('click', () => {
        currentSatelliteId = null;
        
        // Clear tracking
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        if (satelliteMarker) {
            map.removeLayer(satelliteMarker);
        }
        
        // Remove active class from all list items
        document.querySelectorAll('.satellite-item').forEach(i => i.classList.remove('active'));
        
        // Reset info panels
        document.getElementById('infoContent').innerHTML = '<p>Click on a satellite from the list or map</p>';
        document.getElementById('positionContent').innerHTML = '<p>Click on any satellite marker to track it</p>';
        document.getElementById('passesContent').innerHTML = '<p>Select a satellite to see upcoming passes</p>';
        document.getElementById('satelliteId').value = '';
        
        // Display all satellites
        displayAllSatellites();
        
        // Reset map view
        map.setView([20, 0], 2);
    });
    
    // Toggle satellite list panel (header button)
    document.getElementById('toggleListBtn').addEventListener('click', () => {
        const panel = document.getElementById('satellitesListPanel');
        const btn = document.getElementById('toggleListBtn');
        const floatingBtn = document.getElementById('floatingToggleBtn');
        const panelHeader = document.querySelector('.panel-header');
        
        panel.classList.toggle('collapsed');
        btn.textContent = panel.classList.contains('collapsed') ? '▶' : '◀';
        
        // Update panel header title
        if (panel.classList.contains('collapsed')) {
            const count = panelHeader.getAttribute('data-count') || '0';
            panelHeader.title = `${count} Satellites - Click to expand`;
            floatingBtn.textContent = '▶';
            floatingBtn.title = 'Show Satellite List';
        } else {
            panelHeader.title = '';
            floatingBtn.textContent = '☰';
            floatingBtn.title = 'Hide Satellite List';
        }
    });
    
    // Floating toggle button (mobile)
    document.getElementById('floatingToggleBtn').addEventListener('click', () => {
        const panel = document.getElementById('satellitesListPanel');
        const btn = document.getElementById('toggleListBtn');
        const floatingBtn = document.getElementById('floatingToggleBtn');
        const panelHeader = document.querySelector('.panel-header');
        
        panel.classList.toggle('collapsed');
        btn.textContent = panel.classList.contains('collapsed') ? '▶' : '◀';
        
        // Update panel header title
        if (panel.classList.contains('collapsed')) {
            const count = panelHeader.getAttribute('data-count') || '0';
            panelHeader.title = `${count} Satellites - Click to expand`;
            floatingBtn.textContent = '▶';
            floatingBtn.title = 'Show Satellite List';
        } else {
            panelHeader.title = '';
            floatingBtn.textContent = '☰';
            floatingBtn.title = 'Hide Satellite List';
        }
    });
    
    // Click on collapsed panel header to expand
    document.querySelector('.panel-header').addEventListener('click', (e) => {
        const panel = document.getElementById('satellitesListPanel');
        const btn = document.getElementById('toggleListBtn');
        
        // Only expand if collapsed and not clicking the toggle button itself
        if (panel.classList.contains('collapsed') && e.target !== btn) {
            btn.click();
        }
    });
    
    // Search satellites
    document.getElementById('searchSatellite').addEventListener('input', (e) => {
        filterSatellitesList(e.target.value);
    });
});

// Show error message to user
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div style="background: #ff4444; color: white; padding: 15px; border-radius: 8px; 
                    position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 400px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: slideIn 0.3s ease;">
            <strong>⚠️ Error</strong><br>
            ${message}
            <button onclick="this.parentElement.remove()" 
                    style="background: white; color: #ff4444; border: none; padding: 5px 10px; 
                           border-radius: 4px; margin-top: 10px; cursor: pointer; font-weight: bold;">
                Close
            </button>
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 10000);
}


// Search satellites with debounce
let searchTimeout;
document.getElementById('searchSatellite').addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    // Debounce search (wait 500ms after user stops typing)
    searchTimeout = setTimeout(async () => {
        if (query.length === 0) {
            // Show all satellites if search is empty
            const allSats = await getAllSatellites();
            updateSatellitesList(allSats);
        } else if (query.length >= 2) {
            // Search with at least 2 characters
            document.getElementById('satellitesList').innerHTML = '<p class="loading">Searching...</p>';
            const results = await searchSatellites(query);
            updateSatellitesList(results);
        }
    }, 500);
});


// Category filter buttons
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const category = btn.getAttribute('data-category');
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(b => {
            b.style.background = 'rgba(255,255,255,0.1)';
            b.style.borderColor = 'rgba(255,255,255,0.2)';
        });
        btn.style.background = 'rgba(0,212,255,0.2)';
        btn.style.borderColor = '#00d4ff';
        
        // Clear search
        document.getElementById('searchSatellite').value = '';
        
        // Show loading
        document.getElementById('satellitesList').innerHTML = '<p class="loading">Loading...</p>';
        
        // Fetch and display
        if (category === 'all') {
            const allSats = await getAllSatellites();
            updateSatellitesList(allSats);
        } else {
            const catSats = await getSatellitesByCategory(category);
            updateSatellitesList(catSats);
        }
    });
});
