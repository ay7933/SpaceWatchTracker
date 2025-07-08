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

export interface CommunityReport {
  id: string;
  type: 'deforestation' | 'disaster' | 'pollution' | 'urban_sprawl' | 'agriculture' | 'other';
  title: string;
  description: string;
  coordinates: [number, number];
  reporter: string;
  timestamp: string;
  verified: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  images?: string[];
}

export interface ImpactMetrics {
  areaKm2: number;
  vegetationCoverage?: number;
  waterCoverage?: number;
  urbanCoverage?: number;
  changeDetected?: boolean;
  changePercentage?: number;
  estimatedCarbonImpact?: number;
}

export interface ChangeDetectionResult {
  hasSignificantChange: boolean;
  changeType: 'vegetation_loss' | 'vegetation_gain' | 'water_change' | 'urban_expansion' | 'other';
  affectedAreaKm2: number;
  changePercentage: number;
  confidenceLevel: number;
  description: string;
}

export interface ExportReport {
  id: string;
  title: string;
  location: string;
  coordinates: [number, number];
  bounds: [number, number, number, number];
  layer: string;
  dateRange: { from?: string; to?: string };
  metrics: ImpactMetrics;
  changeDetection?: ChangeDetectionResult;
  images: string[];
  timestamp: string;
  shareUrl?: string;
}
