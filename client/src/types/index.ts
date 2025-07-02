export interface LayerInfo {
  id: string;
  name: string;
  description: string;
  enabled?: boolean;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  cloudCover: number;
  weather: string;
  description: string;
  icon: string;
}

export interface LocationResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  displayName: string;
}

export interface ImageSettings {
  resolution: number;
  cloudCoverage: number;
  format: 'png' | 'jpg';
}

export interface MapState {
  center: [number, number];
  zoom: number;
  selectedLayer: string;
  dateFrom?: string;
  dateTo?: string;
  weatherOverlays: {
    currentWeather: boolean;
    temperature: boolean;
    precipitation: boolean;
    windPatterns: boolean;
  };
  imageSettings: ImageSettings;
  satelliteImageUrl?: string;
  satelliteImageBounds?: [number, number, number, number];
}

export interface SatelliteImageResponse {
  imageUrl: string;
  cached: boolean;
}

export interface ImageInfo {
  date: string;
  satellite: string;
  resolution: string;
  cloudCover: string;
}
