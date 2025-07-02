# SpaceWatch - Satellite Imagery and Weather Visualization Platform

## Overview

SpaceWatch is a modern web application that provides users with real-time and historical satellite imagery for any location on Earth. The application combines satellite data visualization with weather overlays, offering multiple visualization layers and interactive mapping capabilities. Built with React and Express, it integrates with Sentinel Hub for satellite imagery and OpenWeatherMap for weather data.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Maps**: Leaflet.js for interactive mapping functionality
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Integration**: Sentinel Hub Processing API and OpenWeatherMap API
- **Authentication**: OAuth 2.0 for Sentinel Hub API access

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with Zod schema validation
- **Caching Strategy**: In-memory storage with expiration for satellite imagery
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

## Key Components

### Database Schema
- **Users Table**: User authentication and account management
- **Map Preferences Table**: User-specific map settings and view preferences
- **Satellite Image Cache Table**: Cached satellite imagery with expiration management

### Frontend Components
- **Interactive Map**: Leaflet-based mapping with layer switching and navigation
- **Sidebar**: Comprehensive control panel with location search, layer selection, date range picker, weather overlays, and image settings
- **Top Toolbar**: Coordinate display, zoom controls, and fullscreen functionality
- **Weather Info**: Real-time weather data display for selected locations
- **Image Info**: Metadata display for current satellite imagery

### API Layer
- **Satellite Imagery Endpoint**: `/api/satellite` - Fetches satellite images from Sentinel Hub
- **Weather Data Endpoint**: `/api/weather` - Retrieves weather information from OpenWeatherMap
- **Geocoding Endpoint**: `/api/geocode` - Location search and coordinate resolution

## Data Flow

1. **User Interaction**: Users interact with the map interface or sidebar controls
2. **State Management**: React Query manages API calls and caching
3. **API Requests**: Frontend sends requests to Express backend endpoints
4. **External API Integration**: Backend communicates with Sentinel Hub and OpenWeatherMap APIs
5. **Data Processing**: Backend processes and validates data before sending to frontend
6. **Cache Management**: Satellite imagery is cached to reduce API calls and improve performance
7. **UI Updates**: Frontend components re-render with new data using React Query's reactive patterns

## External Dependencies

### APIs and Services
- **Sentinel Hub Processing API**: Satellite imagery with multiple visualization layers
- **OpenWeatherMap API**: Current weather data and forecasts
- **Neon Database**: Serverless PostgreSQL hosting

### Key Libraries
- **React Ecosystem**: React, React Query, React Hook Form
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Mapping**: Leaflet.js for interactive maps
- **Database**: Drizzle ORM with Zod validation
- **Styling**: Tailwind CSS with class-variance-authority

### Available Satellite Layers
- True Color (natural imagery)
- NDVI Vegetation Index
- Agriculture monitoring
- Color Infrared (vegetation analysis)
- False Color Urban
- Geology visualization
- Moisture Index
- SWIR (Short-wave infrared)
- Atmospheric Penetration
- Bathymetric data

## Deployment Strategy

### Development Environment
- **Development Server**: Vite dev server with HMR
- **Backend Development**: tsx for TypeScript execution
- **Database Management**: Drizzle Kit for schema migrations

### Production Build
- **Frontend Build**: Vite production build with optimizations
- **Backend Build**: esbuild for Node.js bundle creation
- **Static Assets**: Served through Express static middleware
- **Environment Variables**: Secure API key management

### Configuration Requirements
- Sentinel Hub Instance ID and OAuth credentials
- OpenWeatherMap API key
- PostgreSQL database connection string
- Node.js environment configuration

## Changelog

```
Changelog:
- July 02, 2025. Initial setup
- July 02, 2025. Comprehensive layer information system implemented:
  * Added detailed layer metadata with band combinations and color guides
  * Created LayerInfo component with technical specifications and color keys
  * Implemented BandsReference component with complete Sentinel-2 band documentation
  * Enhanced LayerSelector with category grouping and improved UX
  * Updated ImageInfo component to display actual band information
  * Fixed vegetation (NDVI) layer evalscript for proper visualization
  * Added complete download functionality for satellite imagery
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```