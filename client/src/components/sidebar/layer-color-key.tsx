import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette } from 'lucide-react';
import { getLayerById } from '@/lib/sentinel-hub';

interface LayerColorKeyProps {
  selectedLayer: string;
}

export function LayerColorKey({ selectedLayer }: LayerColorKeyProps) {
  const layerInfo = getLayerById(selectedLayer);

  if (!layerInfo || !layerInfo.colorKey || layerInfo.colorKey.length === 0) {
    return null;
  }

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Palette className="text-primary" size={18} />
          <CardTitle className="text-sm font-semibold text-text-primary">
            Color Legend - {layerInfo.name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-xs text-text-secondary mb-3">
            Colors you'll see in the {layerInfo.name.toLowerCase()} imagery:
          </p>
          
          <div className="space-y-2">
            {layerInfo.colorKey.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-6 h-4 rounded border border-border flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                  title={item.color}
                />
                <span className="text-xs text-text-primary flex-1">
                  {item.meaning}
                </span>
              </div>
            ))}
          </div>
          
          {layerInfo.visualization && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-text-secondary">
                <span className="font-medium">How it works:</span> {layerInfo.visualization}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
