import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGeocoding } from '@/hooks/use-weather-data';
import { Search, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { LocationResult } from '@/types';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const { data: results, isLoading } = useGeocoding(query, query.length > 2);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowResults(value.length > 2);
  };

  const handleLocationClick = (location: LocationResult) => {
    onLocationSelect(location.lat, location.lon);
    setQuery(location.displayName);
    setShowResults(false);
    toast({
      title: "Location Selected",
      description: `Navigated to ${location.displayName}`,
    });
  };

  const parseCoordinates = (input: string): { lat: number; lon: number } | null => {
    // Try to parse coordinates in various formats
    const coordPatterns = [
      /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/, // "lat,lon"
      /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/, // "lat lon"
    ];

    for (const pattern of coordPatterns) {
      const match = input.match(pattern);
      if (match) {
        const lat = parseFloat(match[1]);
        const lon = parseFloat(match[2]);
        if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          return { lat, lon };
        }
      }
    }
    return null;
  };

  const handleSubmit = () => {
    const coords = parseCoordinates(query);
    if (coords) {
      onLocationSelect(coords.lat, coords.lon);
      setShowResults(false);
      toast({
        title: "Coordinates Entered",
        description: `Navigated to ${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}`,
      });
    } else if (results && results.length > 0) {
      handleLocationClick(results[0]);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search location or enter coordinates..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full bg-input text-text-primary placeholder-text-secondary border-border pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={16} />
      </div>

      {/* Search Results */}
      {showResults && results && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
          {results.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationClick(location)}
              className="w-full text-left px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border/50 last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <MapPin size={14} className="text-text-secondary flex-shrink-0" />
                <div>
                  <div className="text-text-primary font-medium">{location.name}</div>
                  <div className="text-xs text-text-secondary">
                    {location.state && `${location.state}, `}{location.country}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 p-4">
          <div className="text-text-secondary text-sm">Searching...</div>
        </div>
      )}
    </div>
  );
}
