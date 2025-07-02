export const AVAILABLE_LAYERS: Array<{
  id: string;
  name: string;
  description: string;
}> = [
  {
    id: 'TRUE_COLOR',
    name: 'True Color',
    description: 'Natural color imagery'
  },
  {
    id: 'VEGETATION_INDEX',
    name: 'NDVI (Vegetation)',
    description: 'Vegetation health index'
  },
  {
    id: 'AGRICULTURE',
    name: 'Agriculture',
    description: 'Agricultural monitoring'
  },
  {
    id: 'COLOR_INFRARED',
    name: 'Color Infrared',
    description: 'False color vegetation'
  },
  {
    id: 'COLOR_INFRARED_URBAN_',
    name: 'False Color (Urban)',
    description: 'Urban false color'
  },
  {
    id: 'GEOLOGY',
    name: 'Geology',
    description: 'Geological features'
  },
  {
    id: 'MOISTURE_INDEX',
    name: 'Moisture Index',
    description: 'Surface moisture levels'
  },
  {
    id: 'SWIR',
    name: 'SWIR',
    description: 'Short-wave infrared'
  },
  {
    id: 'ATMOSPHERIC_PENETRATION',
    name: 'Atmospheric Penetration',
    description: 'Atmospheric clarity'
  },
  {
    id: 'BATHYMETRIC',
    name: 'Bathymetric',
    description: 'Water depth visualization'
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
