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
      const response = await apiRequest('POST', '/api/satellite', params);
      return response.json();
    },
  });
}
