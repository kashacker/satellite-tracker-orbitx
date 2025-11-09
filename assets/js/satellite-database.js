/**
 * Satellite Information Database
 * 
 * Contains detailed information about satellites including:
 * - Purpose and mission
 * - Launch date and country
 * - Operator and owner
 * - Technical specifications
 * - Current status
 */

const SATELLITE_DATABASE = {
    // International Space Station
    25544: {
        name: "ISS (ZARYA)",
        purpose: "Space Research & Human Habitation",
        description: "The International Space Station is a modular space station in low Earth orbit. It serves as a microgravity and space environment research laboratory where scientific research is conducted in astrobiology, astronomy, meteorology, physics, and other fields.",
        launchDate: "November 20, 1998",
        country: "International (USA, Russia, Europe, Japan, Canada)",
        operator: "NASA, Roscosmos, ESA, JAXA, CSA",
        type: "Space Station",
        mass: "419,725 kg",
        orbit: "Low Earth Orbit (LEO)",
        status: "Operational",
        crew: "Typically 6-7 astronauts",
        website: "https://www.nasa.gov/mission_pages/station/main/index.html"
    },

    // Hubble Space Telescope
    20580: {
        name: "HST (Hubble Space Telescope)",
        purpose: "Space Telescope & Astronomical Observations",
        description: "The Hubble Space Telescope is one of the largest and most versatile space telescopes. It has revolutionized astronomy by providing unprecedented deep space images and has been instrumental in many astronomical discoveries.",
        launchDate: "April 24, 1990",
        country: "United States",
        operator: "NASA, ESA",
        type: "Space Telescope",
        mass: "11,110 kg",
        orbit: "Low Earth Orbit (LEO) - 547 km",
        status: "Operational",
        instruments: "Wide Field Camera 3, Cosmic Origins Spectrograph, Advanced Camera for Surveys",
        website: "https://www.nasa.gov/mission_pages/hubble/main/index.html"
    },

    // Tiangong Space Station
    37820: {
        name: "Tiangong Space Station",
        purpose: "Space Research & Human Habitation",
        description: "Tiangong is China's space station in low Earth orbit. It serves as a platform for scientific research and technology demonstrations, supporting long-duration human spaceflight missions.",
        launchDate: "April 29, 2021",
        country: "China",
        operator: "CNSA (China National Space Administration)",
        type: "Space Station",
        mass: "~66,000 kg",
        orbit: "Low Earth Orbit (LEO) - 340-450 km",
        status: "Operational",
        crew: "Typically 3 astronauts",
        website: "http://www.cnsa.gov.cn/"
    },

    // Starlink Satellites
    48274: {
        name: "Starlink-3090",
        purpose: "Global Internet Coverage",
        description: "Starlink is a satellite internet constellation operated by SpaceX providing satellite Internet access coverage to most of the Earth. The constellation consists of thousands of mass-produced small satellites in low Earth orbit.",
        launchDate: "2021",
        country: "United States",
        operator: "SpaceX",
        type: "Communications Satellite",
        mass: "~260 kg",
        orbit: "Low Earth Orbit (LEO) - 550 km",
        status: "Operational",
        constellation: "Starlink (5000+ satellites planned)",
        website: "https://www.starlink.com/"
    },

    // GPS Satellites (example)
    32711: {
        name: "GPS BIIR-2 (PRN 13)",
        purpose: "Global Navigation & Positioning",
        description: "Part of the Global Positioning System (GPS) constellation providing positioning, navigation, and timing services to users worldwide. Essential for navigation, mapping, and timing applications.",
        launchDate: "July 23, 1997",
        country: "United States",
        operator: "US Space Force",
        type: "Navigation Satellite",
        orbit: "Medium Earth Orbit (MEO) - 20,200 km",
        status: "Operational",
        constellation: "GPS (31 satellites)",
        website: "https://www.gps.gov/"
    },

    // NOAA Weather Satellites
    33591: {
        name: "NOAA 18",
        purpose: "Weather Monitoring & Earth Observation",
        description: "NOAA weather satellites provide critical weather data including atmospheric temperature, humidity, cloud cover, and Earth surface temperature. Used for weather forecasting and climate monitoring.",
        launchDate: "May 20, 2005",
        country: "United States",
        operator: "NOAA (National Oceanic and Atmospheric Administration)",
        type: "Weather Satellite",
        mass: "1,457 kg",
        orbit: "Sun-Synchronous Orbit - 854 km",
        status: "Operational",
        instruments: "AVHRR, HIRS, AMSU, MHS",
        website: "https://www.noaa.gov/"
    },

    // Terra (EOS AM-1)
    25994: {
        name: "Terra (EOS AM-1)",
        purpose: "Earth Observation & Climate Research",
        description: "Terra is a multi-national scientific research satellite studying Earth's atmosphere, land, oceans, and energy balance. It's part of NASA's Earth Observing System and provides critical climate data.",
        launchDate: "December 18, 1999",
        country: "United States",
        operator: "NASA",
        type: "Earth Observation Satellite",
        mass: "5,190 kg",
        orbit: "Sun-Synchronous Orbit - 705 km",
        status: "Operational",
        instruments: "MODIS, ASTER, CERES, MISR, MOPITT",
        website: "https://terra.nasa.gov/"
    },

    // Aqua
    27424: {
        name: "Aqua (EOS PM-1)",
        purpose: "Water Cycle & Climate Monitoring",
        description: "Aqua is a NASA Earth Science satellite studying the Earth's water cycle, including evaporation, precipitation, and ice. It provides crucial data for weather forecasting and climate research.",
        launchDate: "May 4, 2002",
        country: "United States",
        operator: "NASA",
        type: "Earth Observation Satellite",
        mass: "2,934 kg",
        orbit: "Sun-Synchronous Orbit - 705 km",
        status: "Operational",
        instruments: "MODIS, AIRS, AMSU, CERES",
        website: "https://aqua.nasa.gov/"
    },

    // Iridium Satellites
    24792: {
        name: "Iridium 8",
        purpose: "Global Satellite Communications",
        description: "Part of the Iridium satellite constellation providing voice and data communications coverage to satellite phones and other devices. Offers truly global coverage including polar regions.",
        launchDate: "May 5, 1997",
        country: "United States",
        operator: "Iridium Communications",
        type: "Communications Satellite",
        mass: "689 kg",
        orbit: "Low Earth Orbit (LEO) - 780 km",
        status: "Operational",
        constellation: "Iridium (66 active satellites)",
        website: "https://www.iridium.com/"
    }
};

/**
 * Get satellite information by NORAD ID
 * @param {number} noradId - The NORAD catalog number
 * @returns {object|null} Satellite information or null if not found
 */
function getSatelliteInfo(noradId) {
    return SATELLITE_DATABASE[noradId] || null;
}

/**
 * Get generic satellite information based on category
 * @param {string} category - The satellite category
 * @returns {object} Generic information for the category
 */
function getGenericSatelliteInfo(category) {
    const categoryInfo = {
        'Space Stations': {
            purpose: 'Space Research & Human Habitation',
            description: 'Space stations serve as orbital laboratories for scientific research and technology development in microgravity environments.',
            type: 'Space Station'
        },
        'GPS': {
            purpose: 'Global Navigation & Positioning',
            description: 'GPS satellites provide positioning, navigation, and timing services essential for navigation, mapping, and various applications worldwide.',
            type: 'Navigation Satellite',
            operator: 'US Space Force'
        },
        'GLONASS': {
            purpose: 'Global Navigation & Positioning',
            description: 'GLONASS is Russia\'s global navigation satellite system, providing positioning and timing services similar to GPS.',
            type: 'Navigation Satellite',
            operator: 'Russian Space Forces',
            country: 'Russia'
        },
        'Galileo': {
            purpose: 'Global Navigation & Positioning',
            description: 'Galileo is Europe\'s global navigation satellite system, providing highly accurate positioning and timing information.',
            type: 'Navigation Satellite',
            operator: 'European Union',
            country: 'European Union'
        },
        'Beidou': {
            purpose: 'Global Navigation & Positioning',
            description: 'BeiDou is China\'s global navigation satellite system, providing positioning, navigation, and timing services.',
            type: 'Navigation Satellite',
            operator: 'CNSA',
            country: 'China'
        },
        'Iridium': {
            purpose: 'Global Satellite Communications',
            description: 'Iridium satellites provide global voice and data communications coverage, including polar regions.',
            type: 'Communications Satellite',
            operator: 'Iridium Communications',
            country: 'United States'
        },
        'Weather': {
            purpose: 'Weather Monitoring & Forecasting',
            description: 'Weather satellites monitor atmospheric conditions, providing critical data for weather forecasting and climate research.',
            type: 'Weather Satellite'
        },
        'Earth Resources': {
            purpose: 'Earth Observation & Resource Monitoring',
            description: 'Earth observation satellites monitor land use, vegetation, water resources, and environmental changes.',
            type: 'Earth Observation Satellite'
        },
        'CubeSats': {
            purpose: 'Research & Technology Demonstration',
            description: 'CubeSats are small, standardized satellites used for scientific research, technology demonstration, and educational purposes.',
            type: 'Small Satellite'
        },
        'Amateur Radio': {
            purpose: 'Amateur Radio Communications',
            description: 'Amateur radio satellites enable radio communications for ham radio operators worldwide, supporting education and emergency communications.',
            type: 'Amateur Radio Satellite'
        },
        'Science': {
            purpose: 'Scientific Research',
            description: 'Scientific satellites conduct research in various fields including astronomy, physics, and Earth sciences.',
            type: 'Research Satellite'
        },
        'Military': {
            purpose: 'Military & Defense Operations',
            description: 'Military satellites support defense operations including communications, reconnaissance, and navigation.',
            type: 'Military Satellite'
        },
        'Geostationary': {
            purpose: 'Communications & Broadcasting',
            description: 'Geostationary satellites remain fixed over one point on Earth, ideal for communications, broadcasting, and weather monitoring.',
            type: 'Geostationary Satellite',
            orbit: 'Geostationary Orbit (GEO) - 35,786 km'
        },
        'Brightest': {
            purpose: 'Various Missions',
            description: 'These are among the brightest satellites visible from Earth, often including space stations and large satellites.',
            type: 'Various'
        }
    };

    return categoryInfo[category] || {
        purpose: 'Satellite Operations',
        description: 'This satellite is part of the global satellite infrastructure.',
        type: 'Satellite'
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SATELLITE_DATABASE, getSatelliteInfo, getGenericSatelliteInfo };
}
