"""Test passes calculation"""
from datetime import datetime, timedelta
from skyfield.api import load, wgs84, EarthSatellite

# Load timescale
ts = load.timescale()

# ISS TLE (example)
line1 = "1 25544U 98067A   24325.50000000  .00016717  00000-0  10270-3 0  9990"
line2 = "2 25544  51.6416 208.5835 0001247  88.2588 271.8767 15.50030060123456"

# Create satellite
satellite = EarthSatellite(line1, line2, "ISS", ts)

# Observer location (New York)
observer = wgs84.latlon(40.7128, -74.0060, 0.0)  # altitude in km

# Time range
t0 = ts.utc(datetime.utcnow())
t1 = ts.utc(datetime.utcnow() + timedelta(days=10))

print("Finding passes...")
try:
    t, events = satellite.find_events(observer, t0, t1, altitude_degrees=0.0)
    print(f"Found {len(events)} events")
    
    for ti, event in zip(t, events):
        event_names = ['Rise', 'Culminate', 'Set']
        print(f"{ti.utc_datetime()} - {event_names[event]}")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
