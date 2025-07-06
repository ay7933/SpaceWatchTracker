import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";

const SENTINEL_BANDS = [
  { band: 'B01', name: 'Coastal Aerosol', wavelength: '443', resolution: '60', use: 'Detecting atmospheric haze and coastal water quality' },
  { band: 'B02', name: 'Blue', wavelength: '490', resolution: '10', use: 'Creating natural color images and monitoring water bodies' },
  { band: 'B03', name: 'Green', wavelength: '560', resolution: '10', use: 'Natural color imaging and vegetation health assessment' },
  { band: 'B04', name: 'Red', wavelength: '665', resolution: '10', use: 'Natural color imaging and vegetation stress detection' },
  { band: 'B05', name: 'Red Edge 1', wavelength: '705', resolution: '20', use: 'Precision agriculture and vegetation classification' },
  { band: 'B06', name: 'Red Edge 2', wavelength: '740', resolution: '20', use: 'Crop monitoring and vegetation growth stages' },
  { band: 'B07', name: 'Red Edge 3', wavelength: '783', resolution: '20', use: 'Forest health and agricultural yield prediction' },
  { band: 'B08', name: 'Near-Infrared (NIR)', wavelength: '842', resolution: '10', use: 'Vegetation health, biomass estimation, and water detection' },
  { band: 'B8A', name: 'Narrow NIR', wavelength: '865', resolution: '20', use: 'Atmospheric correction and detailed vegetation analysis' },
  { band: 'B09', name: 'Water Vapour', wavelength: '945', resolution: '60', use: 'Atmospheric water content and cloud detection' },
  { band: 'B10', name: 'Cirrus', wavelength: '1375', resolution: '60', use: 'Detecting high-altitude cirrus clouds' },
  { band: 'B11', name: 'SWIR1', wavelength: '1610', resolution: '20', use: 'Soil moisture, geology, and urban area mapping' },
  { band: 'B12', name: 'SWIR2', wavelength: '2190', resolution: '20', use: 'Mineral detection, fire monitoring, and atmospheric penetration' },
];

export function BandsReference() {
  const [isOpen, setIsOpen] = useState(false);

  const getResolutionColor = (resolution: string) => {
    switch (resolution) {
      case '10': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '20': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case '60': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="bg-background border-border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-primary" />
                <CardTitle className="text-sm font-semibold text-text-primary">
                  Sentinel-2 Bands Reference
                </CardTitle>
              </div>
              <ChevronDown 
                size={16} 
                className={`text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} 
              />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <p className="text-xs text-text-secondary mb-3">
                Sentinel-2 satellites capture Earth imagery across 13 spectral bands. Each band detects specific wavelengths of light to reveal different features:
              </p>
              
              <div className="space-y-2">
                {SENTINEL_BANDS.map((band) => (
                  <div key={band.band} className="border border-border rounded-lg p-3 bg-muted/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {band.band}
                        </Badge>
                        <Badge className={`text-xs ${getResolutionColor(band.resolution)}`}>
                          {band.resolution}m
                        </Badge>
                      </div>
                      <span className="text-xs text-text-secondary">
                        {band.wavelength}nm
                      </span>
                    </div>
                    
                    <h4 className="text-xs font-medium text-text-primary mb-1">
                      {band.name}
                    </h4>
                    
                    <p className="text-xs text-text-secondary">
                      {band.use}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t border-border">
                <h4 className="text-xs font-medium text-text-primary mb-2">Understanding Resolution:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      10m
                    </Badge>
                    <span className="text-xs text-text-secondary">High detail - Can see buildings, roads, small fields</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      20m
                    </Badge>
                    <span className="text-xs text-text-secondary">Medium detail - Good for vegetation and land use</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      60m
                    </Badge>
                    <span className="text-xs text-text-secondary">Lower detail - Used for atmospheric conditions</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary mt-2">
                  Lower resolution numbers mean higher detail. A 10m resolution means each pixel represents a 10m×10m area on the ground.
                </p>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}