import { Check } from 'lucide-react';
import { AVAILABLE_LAYERS } from '@/lib/sentinel-hub';

interface LayerSelectorProps {
  selectedLayer: string;
  onLayerChange: (layer: string) => void;
}

export function LayerSelector({ selectedLayer, onLayerChange }: LayerSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
        Visualization Layers
      </h3>
      <div className="space-y-2">
        {AVAILABLE_LAYERS.map((layer) => (
          <div
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            className={`
              bg-card rounded-lg p-3 cursor-pointer hover:bg-accent/50 transition-colors
              ${selectedLayer === layer.id ? 'border-l-4 border-primary' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-text-primary font-medium">{layer.name}</div>
                <div className="text-xs text-text-secondary">{layer.description}</div>
              </div>
              {selectedLayer === layer.id && (
                <Check className="text-primary" size={16} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
