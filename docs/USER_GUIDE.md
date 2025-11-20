# 📖 User Guide - Satellite Tracker

Complete guide to using the Satellite Tracker application.

## 🚀 Getting Started

### Accessing the Application

Visit the deployed application at: [Your URL]

Or run locally:
1. Open `index.html` in your browser
2. Start tracking satellites!

---

## 🎯 Main Features

### 1. Search Satellites

**Search Bar** (Top of satellite list)
- Type satellite name (e.g., "ISS", "Starlink")
- Type NORAD ID (e.g., "25544")
- Results appear instantly as you type
- Minimum 2 characters required

**Tips:**
- Search is case-insensitive
- Partial matches work (e.g., "star" finds all Starlink)
- Clear search to see all satellites

---

### 2. Filter by Category

**Category Buttons** (Below search bar)

Available categories:
- **All** - Show all 13,414 satellites
- **Stations** - Space stations (ISS, Tiangong, etc.)
- **Starlink** - SpaceX Starlink constellation
- **Weather** - Weather satellites
- **GPS** - GPS navigation satellites
- **Science** - Scientific satellites

Click any category to filter the list.

---

### 3. Track a Satellite

**Method 1: From List**
1. Search or browse the satellite list
2. Click on any satellite
3. Map centers on satellite
4. Info panel shows details

**Method 2: Quick Access**
- Click "ISS" button for International Space Station
- Click "HST (Hubble)" for Hubble Telescope
- Click "Starlink" for a Starlink satellite
- Click "Tiangong" for Chinese Space Station

**Method 3: Manual Entry**
1. Enter NORAD ID in search box
2. Click "Track Satellite" button

---

### 4. Understanding the Display

#### Map View
- **🛰️ Icon** - Current satellite position
- **Dark background** - Better visibility
- **Zoom controls** - +/- buttons on map
- **Pan** - Click and drag to move map

#### Satellite Information Panel
Shows:
- Satellite name
- Purpose and mission
- Launch date
- Orbit type
- Country of origin
- Additional details

#### Current Position Panel
Shows:
- **Latitude** - North/South position
- **Longitude** - East/West position
- **Altitude** - Height above Earth (km)
- **Azimuth** - Compass direction (0-360°)
- **Elevation** - Angle above horizon (-90 to 90°)
- **Last Update** - Timestamp

---

## 🗺️ Using the Map

### Navigation
- **Zoom In/Out** - Use +/- buttons or scroll wheel
- **Pan** - Click and drag
- **Reset View** - Click satellite again

### Satellite Marker
- **Click marker** - Show satellite info
- **Hover** - See name and coordinates
- **Auto-update** - Position updates every 5 seconds

---

## 📊 Satellite List Panel

### Features
- **Collapsible** - Click ◀ to hide/show
- **Scrollable** - Browse all satellites
- **Search** - Filter by name or ID
- **Categories** - Quick filter buttons
- **Count** - Shows total satellites

### Satellite Item Details
Each item shows:
- Satellite name
- NORAD ID
- Category badge
- Status indicator (● Active / ○ Inactive)

---

## 🎨 Interface Elements

### Header
- **Title** - "🛰️ Satellite Tracker"
- **Description** - App tagline

### Controls Section
- **Search box** - Enter NORAD ID
- **Track button** - Start tracking
- **Quick access buttons** - Popular satellites

### Sidebar (Left)
- **Satellite list** - All available satellites
- **Search filter** - Find satellites
- **Category filters** - Quick filtering

### Main Area (Center)
- **Interactive map** - Satellite visualization
- **Zoom controls** - Map navigation

### Info Panels (Right)
- **Satellite info** - Details about satellite
- **Position data** - Current location
- **Visual passes** - Upcoming visibility

---

## 💡 Tips & Tricks

### Finding Satellites

**Popular Satellites:**
- ISS (25544) - Always visible, frequent passes
- Hubble (20580) - Famous space telescope
- Starlink - Thousands of satellites
- GPS satellites - Navigation constellation

**Search Tips:**
- Use partial names: "star" finds Starlink
- Use numbers: "255" finds satellites with that ID
- Use categories: Filter by type first

### Best Viewing Times

**When to Track:**
- **Dawn/Dusk** - Best visibility for naked eye
- **Clear nights** - Better satellite visibility
- **High elevation** - Satellite above 30° elevation

### Understanding Position

**Latitude/Longitude:**
- Shows where satellite is above Earth
- Updates every 5 seconds
- Negative = South/West, Positive = North/East

**Altitude:**
- Low Earth Orbit (LEO): 200-2,000 km
- Medium Earth Orbit (MEO): 2,000-35,786 km
- Geostationary (GEO): ~35,786 km

**Azimuth:**
- 0° = North
- 90° = East
- 180° = South
- 270° = West

**Elevation:**
- Negative = Below horizon (not visible)
- 0° = On horizon
- 90° = Directly overhead

---

## 📱 Mobile Usage

### Responsive Design
- Works on phones and tablets
- Touch-friendly interface
- Optimized layout

### Mobile Tips
- Use landscape mode for better map view
- Tap satellite list to expand/collapse
- Pinch to zoom on map
- Swipe to pan map

---

## ⚙️ Settings

### Observer Location

Default location: New York City (40.7128°N, 74.0060°W)

**To change:**
1. Open `assets/js/config.js`
2. Update `OBSERVER` coordinates:
```javascript
OBSERVER: {
    latitude: YOUR_LATITUDE,
    longitude: YOUR_LONGITUDE,
    altitude: YOUR_ALTITUDE_IN_METERS
}
```

**Find your coordinates:**
- Visit [latlong.net](https://www.latlong.net/)
- Use Google Maps (right-click → coordinates)
- Use GPS app on phone

### Update Frequency

Default: 5 seconds

**To change:**
1. Open `assets/js/config.js`
2. Update `UPDATE_INTERVAL`:
```javascript
UPDATE_INTERVAL: 10000  // 10 seconds
```

---

## 🔍 Troubleshooting

### Satellite Not Loading
- Check internet connection
- Refresh page (Ctrl+R or Cmd+R)
- Clear browser cache
- Try different browser

### Map Not Showing
- Check internet connection (map tiles need to load)
- Disable ad blockers
- Try different browser

### Position Not Updating
- Check console for errors (F12)
- Verify backend is running
- Check network tab for failed requests

### Search Not Working
- Type at least 2 characters
- Check spelling
- Try NORAD ID instead of name

---

## 🎓 Learning Resources

### Understanding Satellites
- [Celestrak](https://celestrak.org) - TLE data and info
- [N2YO](https://www.n2yo.com) - Satellite tracking
- [Heavens Above](https://www.heavens-above.com) - Visibility predictions

### Orbital Mechanics
- [Wikipedia - Orbital Elements](https://en.wikipedia.org/wiki/Orbital_elements)
- [NASA - Satellite Tracking](https://www.nasa.gov/audience/forstudents/5-8/features/nasa-knows/what-is-a-satellite-58.html)

---

## 📞 Support

### Getting Help
- Check this user guide
- Read [API.md](API.md) for technical details
- See [DEPLOY.md](DEPLOY.md) for deployment help
- Open GitHub issue for bugs

### Reporting Issues
Include:
- Browser and version
- Steps to reproduce
- Error messages (from console)
- Screenshots if helpful

---

## 🌟 Pro Tips

1. **Bookmark favorites** - Save URLs with specific satellites
2. **Use categories** - Faster than searching
3. **Track ISS** - Most popular and visible satellite
4. **Check elevation** - Positive = visible from your location
5. **Update regularly** - Positions change constantly

---

**Happy Satellite Tracking!** 🛰️✨

Made with ❤️ by Kashinath
