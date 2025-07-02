import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import type { ImageSettings } from '@/types';

interface ImageSettingsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: ImageSettings) => void;
}

export function ImageSettings({ settings, onSettingsChange }: ImageSettingsProps) {
  const handleResolutionChange = (value: string) => {
    onSettingsChange({
      ...settings,
      resolution: parseInt(value),
    });
  };

  const handleCloudCoverageChange = (value: number[]) => {
    onSettingsChange({
      ...settings,
      cloudCoverage: value[0],
    });
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
        Image Settings
      </h3>
      <div className="space-y-4">
        <div>
          <Label className="block text-xs text-text-secondary mb-1">Resolution</Label>
          <Select value={settings.resolution.toString()} onValueChange={handleResolutionChange}>
            <SelectTrigger className="w-full bg-input text-text-primary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10m - Highest Detail</SelectItem>
              <SelectItem value="20">20m - Standard Detail</SelectItem>
              <SelectItem value="60">60m - Lower Detail</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-xs text-text-secondary mb-1">
            Cloud Coverage (Max %)
          </Label>
          <Slider
            value={[settings.cloudCoverage]}
            onValueChange={handleCloudCoverageChange}
            max={100}
            min={0}
            step={5}
            className="w-full mt-2"
          />
          <div className="text-xs text-text-secondary mt-1">
            {settings.cloudCoverage}%
          </div>
        </div>
      </div>
    </div>
  );
}
