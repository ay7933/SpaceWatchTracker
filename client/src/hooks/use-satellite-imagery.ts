import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { SatelliteImageResponse } from '@/types';

interface SatelliteImageryParams {
  bbox: [number, number, number, number];
  layer: string;
  width: number;
  height: number;
  dateFrom?: string;
  dateTo?: string;
  maxCloudCoverage?: number;
}

export function useSatelliteImagery() {
  return useMutation({
    mutationFn: async (params: SatelliteImageryParams): Promise<SatelliteImageResponse> => {
      const response = await fetch('/api/satellite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch satellite imagery: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Satellite API response:", { hasImageUrl: !!result.imageUrl, cached: result.cached });
      return result;
    },
  });
}
