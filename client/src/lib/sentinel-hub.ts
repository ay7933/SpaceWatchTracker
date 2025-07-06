export interface LayerInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  bands: string;
  visualization: string;
  colorKey: Array<{
    color: string;
    meaning: string;
  }>;
  bestFor: string[];
}

export const AVAILABLE_LAYERS: LayerInfo[] = [
  {
    id: 'TRUE_COLOR',
    name: 'True Color',
    description: 'Natural color imagery showing Earth as you would see it from space',
    category: 'Natural Color & Basic Imagery',
    bands: 'B04 (Red), B03 (Green), B02 (Blue)',
    visualization: 'Displays landscapes in realistic colors',
    colorKey: [
      { color: '#0F4C0F', meaning: 'Dense forests and healthy vegetation' },
      { color: '#228B22', meaning: 'Grasslands and croplands' },
      { color: '#1E90FF', meaning: 'Deep water bodies' },
      { color: '#87CEEB', meaning: 'Shallow water and coastlines' },
      { color: '#696969', meaning: 'Urban areas and concrete' },
      { color: '#DEB887', meaning: 'Desert and bare soil' },
      { color: '#F5F5DC', meaning: 'Sandy beaches and dunes' },
      { color: '#FFFFFF', meaning: 'Clouds and snow cover' }
    ],
    bestFor: ['General overview', 'Urban planning', 'Natural disaster assessment']
  },
  {
    id: 'VEGETATION_INDEX',
    name: 'NDVI (Vegetation)',
    description: 'Normalized Difference Vegetation Index showing plant health and density',
    category: 'Vegetation & Agriculture',
    bands: 'B08 (NIR), B04 (Red)',
    visualization: 'Calculated as (B08-B04)/(B08+B04)',
    colorKey: [
      { color: '#006400', meaning: 'Very healthy vegetation (NDVI > 0.6)' },
      { color: '#32CD32', meaning: 'Healthy vegetation (NDVI 0.4-0.6)' },
      { color: '#9ACD32', meaning: 'Moderate vegetation (NDVI 0.2-0.4)' },
      { color: '#FFFF00', meaning: 'Sparse vegetation (NDVI 0.1-0.2)' },
      { color: '#DEB887', meaning: 'Very sparse/stressed (NDVI 0-0.1)' },
      { color: '#8B4513', meaning: 'Bare soil/rock (NDVI < 0)' },
      { color: '#0000FF', meaning: 'Water bodies (NDVI < -0.1)' }
    ],
    bestFor: ['Crop monitoring', 'Forest health', 'Environmental studies']
  },
  {
    id: 'AGRICULTURE',
    name: 'Agriculture',
    description: 'Specialized monitoring for crop analysis and farming',
    category: 'Vegetation & Agriculture',
    bands: 'B11 (SWIR1), B08 (NIR), B02 (Blue)',
    visualization: 'Highlights crop types and field boundaries',
    colorKey: [
      { color: '#FF0000', meaning: 'Healthy crops with high moisture' },
      { color: '#FFA500', meaning: 'Mature crops ready for harvest' },
      { color: '#FFFF00', meaning: 'Young or stressed crops' },
      { color: '#8B4513', meaning: 'Bare agricultural fields' },
      { color: '#0000FF', meaning: 'Water sources and irrigation' }
    ],
    bestFor: ['Precision farming', 'Crop yield prediction', 'Irrigation planning']
  },
  {
    id: 'COLOR_INFRARED',
    name: 'Color Infrared',
    description: 'False color that highlights vegetation in red tones',
    category: 'Natural Color & Basic Imagery',
    bands: 'B08 (NIR), B04 (Red), B03 (Green)',
    visualization: 'Healthy vegetation appears bright red',
    colorKey: [
      { color: '#DC143C', meaning: 'Very healthy, dense vegetation' },
      { color: '#FF6347', meaning: 'Healthy vegetation and crops' },
      { color: '#FF69B4', meaning: 'Moderate vegetation' },
      { color: '#FFB6C1', meaning: 'Sparse or stressed vegetation' },
      { color: '#000080', meaning: 'Deep water bodies' },
      { color: '#4169E1', meaning: 'Shallow water' },
      { color: '#C0C0C0', meaning: 'Urban areas and buildings' },
      { color: '#8B4513', meaning: 'Bare soil and rock' }
    ],
    bestFor: ['Vegetation mapping', 'Forest analysis', 'Land use classification']
  },
  {
    id: 'COLOR_INFRARED_URBAN_',
    name: 'False Color (Urban)',
    description: 'Optimized false color for urban area analysis',
    category: 'Natural Color & Basic Imagery',
    bands: 'B12 (SWIR2), B11 (SWIR1), B04 (Red)',
    visualization: 'Urban areas and man-made features stand out',
    colorKey: [
      { color: '#FF00FF', meaning: 'Dense urban development' },
      { color: '#FFA500', meaning: 'Suburban areas' },
      { color: '#FFFF00', meaning: 'Industrial zones' },
      { color: '#0000FF', meaning: 'Water bodies' },
      { color: '#228B22', meaning: 'Vegetation and parks' }
    ],
    bestFor: ['City planning', 'Infrastructure mapping', 'Urban sprawl analysis']
  },
  {
    id: 'GEOLOGY',
    name: 'Geology',
    description: 'Reveals geological features, rock types, and terrain structures',
    category: 'Geological & Environmental',
    bands: 'B12 (SWIR2), B11 (SWIR1), B02 (Blue)',
    visualization: 'Highlights minerals, rock outcrops, and geological faults',
    colorKey: [
      { color: '#FF4500', meaning: 'Iron-rich rocks and minerals' },
      { color: '#FFD700', meaning: 'Clay and sedimentary rocks' },
      { color: '#8A2BE2', meaning: 'Volcanic and igneous rocks' },
      { color: '#00CED1', meaning: 'Limestone and carbonate rocks' },
      { color: '#2F4F4F', meaning: 'Metamorphic rocks' }
    ],
    bestFor: ['Mineral exploration', 'Geological mapping', 'Mining surveys']
  },
  {
    id: 'MOISTURE_INDEX',
    name: 'Moisture Index',
    description: 'Shows surface moisture levels and water content in soil and vegetation',
    category: 'Vegetation & Agriculture',
    bands: 'B08 (NIR), B11 (SWIR1)',
    visualization: 'Calculated as (B08-B11)/(B08+B11)',
    colorKey: [
      { color: '#0000FF', meaning: 'Very high moisture content' },
      { color: '#00FFFF', meaning: 'High moisture content' },
      { color: '#FFFF00', meaning: 'Moderate moisture content' },
      { color: '#FFA500', meaning: 'Low moisture content' },
      { color: '#8B4513', meaning: 'Very dry conditions' }
    ],
    bestFor: ['Drought monitoring', 'Irrigation management', 'Flood assessment']
  },
  {
    id: 'SWIR',
    name: 'SWIR',
    description: 'Short-wave infrared for mineral detection and analysis',
    category: 'Geological & Environmental',
    bands: 'B12 (SWIR2), B08 (NIR), B04 (Red)',
    visualization: 'Penetrates clouds and reveals surface materials',
    colorKey: [
      { color: '#FF0000', meaning: 'Recent burn scars' },
      { color: '#8B4513', meaning: 'Exposed minerals and rocks' },
      { color: '#228B22', meaning: 'Healthy vegetation' },
      { color: '#4169E1', meaning: 'Water bodies' },
      { color: '#FFFFFF', meaning: 'Clouds and snow' }
    ],
    bestFor: ['Fire scar mapping', 'Mineral exploration', 'Cloud penetration']
  },
  {
    id: 'ATMOSPHERIC_PENETRATION',
    name: 'Atmospheric Penetration',
    description: 'Cuts through haze and atmosphere for clearer surface views',
    category: 'Geological & Environmental',
    bands: 'B12 (SWIR2), B11 (SWIR1), B8A (Narrow NIR)',
    visualization: 'Reduces atmospheric effects and enhances surface features',
    colorKey: [
      { color: '#8B4513', meaning: 'Clear surface features' },
      { color: '#228B22', meaning: 'Vegetation through haze' },
      { color: '#4169E1', meaning: 'Water bodies' },
      { color: '#FFD700', meaning: 'Desert and arid regions' },
      { color: '#808080', meaning: 'Rocky terrain' }
    ],
    bestFor: ['Hazy conditions', 'Desert monitoring', 'Surface mapping']
  },
  {
    id: 'BATHYMETRIC',
    name: 'Bathymetric',
    description: 'Water depth visualization for coastal and marine areas',
    category: 'Water & Coastal',
    bands: 'B04 (Red), B03 (Green), B02 (Blue)',
    visualization: 'Enhanced water penetration to show underwater features',
    colorKey: [
      { color: '#87CEEB', meaning: 'Very shallow water (0-2m)' },
      { color: '#4169E1', meaning: 'Shallow water (2-10m)' },
      { color: '#0000CD', meaning: 'Medium depth water (10-25m)' },
      { color: '#191970', meaning: 'Deep water (25m+)' },
      { color: '#8B4513', meaning: 'Underwater sediment' }
    ],
    bestFor: ['Coastal mapping', 'Marine navigation', 'Coral reef monitoring']
  }
];

export function getLayerById(id: string) {
  return AVAILABLE_LAYERS.find(layer => layer.id === id);
}

export function getBoundsFromMap(map: L.Map): [number, number, number, number] {
  const bounds = map.getBounds();
  return [
    bounds.getWest(),
    bounds.getSouth(),
    bounds.getEast(),
    bounds.getNorth()
  ];
}

export function calculateImageDimensions(map: L.Map, maxSize: number = 1024): { width: number; height: number } {
  const container = map.getContainer();
  const { clientWidth, clientHeight } = container;
  
  const aspectRatio = clientWidth / clientHeight;
  
  if (aspectRatio > 1) {
    return {
      width: Math.min(maxSize, clientWidth),
      height: Math.min(maxSize / aspectRatio, clientHeight)
    };
  } else {
    return {
      width: Math.min(maxSize * aspectRatio, clientWidth),
      height: Math.min(maxSize, clientHeight)
    };
  }
}
