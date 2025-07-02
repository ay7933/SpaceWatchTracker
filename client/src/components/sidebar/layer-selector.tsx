import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Layers } from 'lucide-react';
import { AVAILABLE_LAYERS } from '@/lib/sentinel-hub';

interface LayerSelectorProps {
  selectedLayer: string;
  onLayerChange: (layer: string) => void;
}

export function LayerSelector({ selectedLayer, onLayerChange }: LayerSelectorProps) {
  const selectedLayerInfo = AVAILABLE_LAYERS.find(layer => layer.id === selectedLayer);

  // Group layers by category
  const groupedLayers = AVAILABLE_LAYERS.reduce((acc, layer) => {
    if (!acc[layer.category]) {
      acc[layer.category] = [];
    }
    acc[layer.category].push(layer);
    return acc;
  }, {} as Record<string, typeof AVAILABLE_LAYERS>);

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Layers className="text-primary" size={18} />
          <CardTitle className="text-sm font-semibold text-text-primary">Imagery Layer</CardTitle>
        </div>
        {selectedLayerInfo && (
          <Badge variant="secondary" className="text-xs w-fit">
            {selectedLayerInfo.category}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedLayers).map(([category, layers], categoryIndex) => (
          <div key={category}>
            {categoryIndex > 0 && <Separator />}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
                {category}
              </h4>
              <div className="space-y-1">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    onClick={() => onLayerChange(layer.id)}
                    className={`
                      bg-card rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors border
                      ${selectedLayer === layer.id ? 'border-primary bg-primary/5' : 'border-border'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-text-primary font-medium text-sm">{layer.name}</div>
                        <div className="text-xs text-text-secondary mt-1">{layer.description}</div>
                      </div>
                      {selectedLayer === layer.id && (
                        <Check className="text-primary ml-2 flex-shrink-0" size={16} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
