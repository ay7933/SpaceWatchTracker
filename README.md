
# SpaceWatch 🛰️

A modern web application that provides real-time and historical satellite imagery for any location on Earth, combined with weather overlays and interactive mapping capabilities.

![SpaceWatch Interface](https://img.shields.io/badge/Status-Live-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB) ![Express](https://img.shields.io/badge/Express.js-404D59?logo=express)

## 🌟 Features

### Satellite Imagery
- **10+ Visualization Layers**: True Color, NDVI Vegetation, Agriculture, Color Infrared, False Color Urban, Geology, Moisture Index, SWIR, Atmospheric Penetration, and Bathymetric
- **Sentinel-2 Data**: High-resolution satellite imagery with 10-60m resolution
- **Real-time & Historical**: Access current and past satellite data
- **Interactive Controls**: Zoom, pan, and explore any location on Earth

### Weather Integration
- **Weather Overlays**: Temperature maps, precipitation, wind patterns
- **Real-time Data**: Current weather conditions from OpenWeatherMap
- **Location-specific**: Weather info updates based on map location

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Space-themed UI optimized for satellite imagery
- **Smart Caching**: Fast loading with intelligent data caching
- **Download Capability**: Save satellite images directly

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon Database account)
- Sentinel Hub account with Processing API access
- OpenWeatherMap API key

### Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# Sentinel Hub API
SENTINEL_HUB_INSTANCE_ID="your_instance_id"
SENTINEL_HUB_CLIENT_ID="your_client_id"
SENTINEL_HUB_CLIENT_SECRET="your_client_secret"

# OpenWeatherMap API
OPENWEATHER_API_KEY="your_openweather_api_key"

# Server
NODE_ENV="development"
PORT=5000
```

### Installation & Running

1. **Clone and Install**
   ```bash
   git clone https://github.com/ay7933/SpaceWatchTracker.git
   cd SpaceWatchTracker
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   - Open your browser to `http://localhost:5000`
   - The app will automatically load with a default view

## 🗺️ How to Use

### Basic Navigation
1. **Search Locations**: Use the search bar to find any place on Earth
2. **Select Layers**: Choose from 10+ satellite visualization layers
3. **Set Date Range**: View historical imagery using the date picker
4. **Weather Overlays**: Toggle temperature, precipitation, and wind overlays
5. **Download Images**: Save current satellite views as PNG files

### Available Satellite Layers

| Layer | Purpose | Best For |
|-------|---------|----------|
| **True Color** | Natural Earth view | General overview, urban planning |
| **NDVI Vegetation** | Plant health monitoring | Agriculture, forest management |
| **Agriculture** | Crop analysis | Precision farming, yield prediction |
| **Color Infrared** | Vegetation mapping | Land use classification |
| **False Color Urban** | Urban development | City planning, infrastructure |
| **Geology** | Rock and mineral detection | Mining, geological surveys |
| **Moisture Index** | Surface water content | Drought monitoring, irrigation |
| **SWIR** | Fire scars, minerals | Fire mapping, mineral exploration |
| **Atmospheric Penetration** | Clear surface views | Hazy conditions, desert monitoring |
| **Bathymetric** | Water depth visualization | Coastal mapping, marine navigation |

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Leaflet.js** for interactive mapping
- **Radix UI + shadcn/ui** for components
- **Tailwind CSS** for styling
- **React Query** for state management
- **Vite** for build tooling

### Backend Stack
- **Node.js + Express** server
- **TypeScript** with ES modules
- **PostgreSQL** with Drizzle ORM
- **Zod** for schema validation

### External APIs
- **Sentinel Hub Processing API** - Satellite imagery
- **OpenWeatherMap API** - Weather data
- **Neon Database** - Serverless PostgreSQL

### Project Structure
```
SpaceWatch/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and configs
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript definitions
├── server/               # Express backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared schemas
└── attached_assets/      # Documentation files
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
```

### Key Features Implementation

#### Satellite Layer System
```typescript
// Each layer has detailed metadata
const AVAILABLE_LAYERS: LayerInfo[] = [
  {
    id: 'TRUE_COLOR',
    name: 'True Color',
    bands: 'B04 (Red), B03 (Green), B02 (Blue)',
    visualization: 'Natural color imagery',
    bestFor: ['General overview', 'Urban planning']
  }
  // ... more layers
];
```

#### Smart Caching
- Satellite images cached for 24 hours
- Weather data cached for optimal performance
- PostgreSQL session storage

#### Responsive Design
- Mobile-first approach
- Collapsible sidebar for mobile
- Touch-friendly controls

## 📡 API Endpoints

### Satellite Imagery
```
POST /api/satellite
```
Fetches satellite imagery for specified coordinates, layer, and date range.

### Weather Data
```
GET /api/weather?lat={lat}&lon={lon}
```
Returns current weather conditions for given coordinates.

### Location Search
```
GET /api/geocode?q={query}
```
Geocoding service for location search functionality.

### Weather Tiles
```
GET /api/weather-tiles/{type}/{z}/{x}/{y}.png
```
Weather overlay tiles for temperature, precipitation, and wind.

## 🌍 Deployment

### On Replit (Recommended)
1. Fork this repository on Replit
2. Set up environment variables in Secrets
3. Click Run to start the application
4. Deploy using Replit's deployment features

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SENTINEL_HUB_INSTANCE_ID` - Your Sentinel Hub instance
- `SENTINEL_HUB_CLIENT_ID` - OAuth client ID
- `SENTINEL_HUB_CLIENT_SECRET` - OAuth client secret  
- `OPENWEATHER_API_KEY` - OpenWeatherMap API key

## 🔐 Security

- Environment variables for API keys
- PostgreSQL session management
- Input validation with Zod schemas
- CORS configuration for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Sentinel Hub** for satellite imagery API
- **OpenWeatherMap** for weather data
- **European Space Agency** for Sentinel-2 satellite data
- **Radix UI** and **shadcn/ui** for component libraries

## 📞 Support

If you encounter any issues or have questions:
1. Check the documentation above
2. Open an issue on GitHub
3. Contact the development team

---

**SpaceWatch** - Bringing the power of satellite imagery to everyone 🌍✨
