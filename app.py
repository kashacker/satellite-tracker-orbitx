"""
OrbitX - Satellite Tracking API (Python)

Advanced satellite tracking API with accurate position calculations
Uses skyfield library and free Celestrak TLE data
No API key required!
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from datetime import datetime, timedelta
from skyfield.api import load, wgs84, EarthSatellite
from skyfield.toposlib import GeographicPosition
import time
import math

app = Flask(__name__)
CORS(app)

PORT = 10000

# TLE data cache
tle_cache = {}
last_tle_update = {}
TLE_CACHE_DURATION = 6 * 60 * 60  # 6 hours in seconds

# Satellite catalog cache
satellite_catalog = []
catalog_last_update = 0
CATALOG_CACHE_DURATION = 24 * 60 * 60  # 24 hours in seconds

# Celestrak TLE sources
CELESTRAK_SOURCES = [
    {'url': 'https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&FORMAT=tle', 'category': 'Space Stations'},
    {'url': 'https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=tle', 'category': 'Brightest'},
    {'url': 'https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle', 'category': 'Active'},
    {'url': 'https://celestrak.org/NORAD/elements/gp.php?GROUP=weather&FORMAT=tle', 'category': 'Weather'},
    {'url': 'https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle', 'category': 'Starlink'},
]

# Load timescale
ts = load.timescale()


def fetch_tle(norad_id):
    """Fetch TLE from Celestrak"""
    url = f'https://celestrak.org/NORAD/elements/gp.php?CATNR={norad_id}&FORMAT=TLE'
    response = requests.get(url, timeout=10)
    
    if response.status_code == 200 and response.text.strip():
        lines = response.text.strip().split('\n')
        if len(lines) >= 3:
            return {
                'name': lines[0].strip(),
                'line1': lines[1].strip(),
                'line2': lines[2].strip()
            }
    raise Exception(f'Failed to fetch TLE for {norad_id}')


def fetch_tle_catalog(source_url):
    """Fetch TLE catalog from Celestrak"""
    try:
        response = requests.get(source_url, timeout=15)
        if response.status_code == 200 and response.text.strip():
            satellites = []
            lines = response.text.strip().split('\n')
            
            for i in range(0, len(lines), 3):
                if i + 2 < len(lines):
                    name = lines[i].strip()
                    line1 = lines[i + 1].strip()
                    line2 = lines[i + 2].strip()
                    
                    norad_id = int(line1[2:7])
                    
                    if norad_id and name:
                        satellites.append({
                            'satid': norad_id,
                            'satname': name
                        })
            return satellites
    except Exception as e:
        print(f'Error fetching catalog: {e}')
    return []


def fetch_all_satellites():
    """Fetch ALL satellites from Celestrak"""
    print('📡 Fetching satellite catalog from Celestrak...')
    all_satellites = []
    seen_ids = set()
    
    for source in CELESTRAK_SOURCES:
        sats = fetch_tle_catalog(source['url'])
        for sat in sats:
            if sat['satid'] not in seen_ids:
                seen_ids.add(sat['satid'])
                sat['category'] = source['category']
                all_satellites.append(sat)
    
    print(f'✅ Loaded {len(all_satellites)} satellites from Celestrak')
    return all_satellites


def get_satellite_catalog():
    """Get satellite catalog with caching"""
    global satellite_catalog, catalog_last_update
    now = time.time()
    
    if not satellite_catalog or (now - catalog_last_update) > CATALOG_CACHE_DURATION:
        satellite_catalog = fetch_all_satellites()
        catalog_last_update = now
    
    return satellite_catalog


def get_tle(norad_id):
    """Get TLE with caching"""
    now = time.time()
    
    if norad_id in tle_cache and (now - last_tle_update.get(norad_id, 0)) < TLE_CACHE_DURATION:
        return tle_cache[norad_id]
    
    tle = fetch_tle(norad_id)
    tle_cache[norad_id] = tle
    last_tle_update[norad_id] = now
    
    return tle


def calculate_position(tle, observer_lat, observer_lng, observer_alt, date=None):
    """Calculate satellite position"""
    if date is None:
        date = datetime.utcnow()
    
    satellite = EarthSatellite(tle['line1'], tle['line2'], tle['name'], ts)
    observer = wgs84.latlon(observer_lat, observer_lng, observer_alt)
    
    t = ts.utc(date.year, date.month, date.day, date.hour, date.minute, date.second)
    
    geocentric = satellite.at(t)
    subpoint = wgs84.subpoint(geocentric)
    
    difference = satellite - observer
    topocentric = difference.at(t)
    alt, az, distance = topocentric.altaz()
    
    return {
        'satlatitude': subpoint.latitude.degrees,
        'satlongitude': subpoint.longitude.degrees,
        'sataltitude': subpoint.elevation.km,
        'azimuth': az.degrees,
        'elevation': alt.degrees,
        'rangeSat': distance.km,
        'timestamp': int(date.timestamp())
    }


def calculate_passes(tle, observer_lat, observer_lng, observer_alt, days=10):
    """Calculate upcoming passes"""
    passes = []
    satellite = EarthSatellite(tle['line1'], tle['line2'], tle['name'], ts)
    observer = wgs84.latlon(observer_lat, observer_lng, observer_alt)
    
    t0 = ts.utc(datetime.utcnow())
    t1 = ts.utc(datetime.utcnow() + timedelta(days=days))
    
    difference = satellite - observer
    
    # Find events (rise, culminate, set)
    t, events = satellite.find_events(observer, t0, t1, altitude_degrees=0.0)
    
    # Group events into passes
    current_pass = {}
    for ti, event in zip(t, events):
        if event == 0:  # Rise
            current_pass = {'start': ti}
        elif event == 1:  # Culminate
            if 'start' in current_pass:
                current_pass['max'] = ti
        elif event == 2:  # Set
            if 'start' in current_pass and 'max' in current_pass:
                topocentric = difference.at(current_pass['max'])
                alt, az_start, _ = difference.at(current_pass['start']).altaz()
                max_alt, _, _ = topocentric.altaz()
                _, az_end, _ = difference.at(ti).altaz()
                
                if max_alt.degrees > 10:
                    start_time = current_pass['start'].utc_datetime()
                    max_time = current_pass['max'].utc_datetime()
                    end_time = ti.utc_datetime()
                    
                    passes.append({
                        'startUTC': int(start_time.timestamp()),
                        'maxUTC': int(max_time.timestamp()),
                        'endUTC': int(end_time.timestamp()),
                        'duration': int((end_time - start_time).total_seconds()),
                        'maxEl': round(max_alt.degrees),
                        'startAz': round(az_start.degrees),
                        'endAz': round(az_end.degrees),
                        'mag': -2.5 if max_alt.degrees > 45 else -1.5 if max_alt.degrees > 30 else -0.5
                    })
            current_pass = {}
    
    return passes


@app.route('/api/position/<int:norad_id>/<float:lat>/<float:lng>/<float:alt>')
def get_position(norad_id, lat, lng, alt):
    """Get satellite position"""
    try:
        tle = get_tle(norad_id)
        position = calculate_position(tle, lat, lng, alt)
        
        return jsonify({
            'info': {
                'satname': tle['name'],
                'satid': norad_id,
                'transactionscount': 0
            },
            'positions': [position]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/passes/<int:norad_id>/<float:lat>/<float:lng>/<float:alt>/<int:days>')
def get_passes(norad_id, lat, lng, alt, days):
    """Get satellite passes"""
    try:
        tle = get_tle(norad_id)
        passes = calculate_passes(tle, lat, lng, alt, days)
        
        return jsonify({
            'info': {
                'satname': tle['name'],
                'satid': norad_id,
                'passescount': len(passes)
            },
            'passes': passes
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/tle/<int:norad_id>')
def get_tle_endpoint(norad_id):
    """Get TLE data"""
    try:
        tle = get_tle(norad_id)
        
        return jsonify({
            'info': {
                'satid': norad_id,
                'satname': tle['name'],
                'transactionscount': 0
            },
            'tle': f"{tle['line1']}\r\n{tle['line2']}"
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/satellites')
def get_satellites():
    """Get all satellites"""
    satellites = get_satellite_catalog()
    return jsonify({
        'satellites': satellites,
        'total': len(satellites),
        'source': 'Celestrak'
    })


@app.route('/api/satellites/search')
def search_satellites():
    """Search satellites"""
    query = request.args.get('q', '').lower()
    satellites = get_satellite_catalog()
    
    filtered = [
        sat for sat in satellites
        if query in sat['satname'].lower() or
           query in str(sat['satid']) or
           query in sat.get('category', '').lower()
    ]
    
    return jsonify({
        'satellites': filtered[:100],
        'total': len(filtered),
        'query': query
    })


@app.route('/api/satellites/category/<category>')
def get_satellites_by_category(category):
    """Get satellites by category"""
    satellites = get_satellite_catalog()
    filtered = [sat for sat in satellites if sat.get('category', '').lower() == category.lower()]
    
    return jsonify({
        'satellites': filtered,
        'total': len(filtered),
        'category': category
    })


@app.route('/api/health')
def health():
    """Health check"""
    return jsonify({
        'status': 'ok',
        'name': 'OrbitX API',
        'version': '1.0.0',
        'message': 'Satellite tracking API powered by Skyfield',
        'satellites': len(satellite_catalog),
        'cached_tle': len(tle_cache),
        'source': 'Celestrak'
    })


if __name__ == '__main__':
    print('🛰️  OrbitX API starting...')
    print('📡 Accurate satellite tracking with Skyfield')
    print('📡 TLE data from Celestrak (no API key needed!)')
    print('\n✨ Endpoints:')
    print('   GET /api/position/:noradId/:lat/:lng/:alt')
    print('   GET /api/passes/:noradId/:lat/:lng/:alt/:days')
    print('   GET /api/tle/:noradId')
    print('   GET /api/satellites')
    print('   GET /api/satellites/search?q=query')
    print('   GET /api/satellites/category/:category')
    print('   GET /api/health')
    print('\n📥 Loading satellite catalog...')
    
    # Preload satellite catalog
    get_satellite_catalog()
    
    print(f'✅ Ready! Tracking {len(satellite_catalog)} satellites')
    print(f'🚀 Running on port {PORT}\n')
    
    app.run(host='0.0.0.0', port=PORT)
