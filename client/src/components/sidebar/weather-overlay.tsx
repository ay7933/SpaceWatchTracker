import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { MapState } from '@/types';

interface WeatherOverlayProps {
  overlays: MapState['weatherOverlays'];
  onOverlayChange: (overlays: MapState['weatherOverlays']) => void;
}

export function WeatherOverlay({ overlays, onOverlayChange }: WeatherOverlayProps) {
  const handleOverlayToggle = (key: keyof MapState['weatherOverlays'], checked: boolean) => {
    onOverlayChange({
      ...overlays,
      [key]: checked,
    });
  };

  const overlayOptions = [
    { 
      key: 'currentWeather' as const, 
      label: 'Current Weather',
      description: 'Shows weather info card in bottom-right corner'
    },
    { 
      key: 'temperature' as const, 
      label: 'Temperature',
      description: 'Red/orange = warm areas, blue = cold areas'
    },
    { 
      key: 'precipitation' as const, 
      label: 'Precipitation',
      description: 'Blue/green patterns show rainfall intensity'
    },
    { 
      key: 'windPatterns' as const, 
      label: 'Wind Patterns',
      description: 'Flow patterns show wind direction and speed'
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
        Weather Overlay
      </h3>
      <div className="space-y-2">
        {overlayOptions.map((option) => (
          <div key={option.key} className="space-y-1">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={option.key}
                checked={overlays[option.key]}
                onCheckedChange={(checked) => handleOverlayToggle(option.key, !!checked)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={option.key}
                className="text-text-primary cursor-pointer text-sm"
              >
                {option.label}
              </Label>
            </div>
            <div className="text-xs text-text-secondary ml-6">
              {option.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
