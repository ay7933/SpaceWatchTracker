import { useState, useEffect } from 'react';
import type { CommunityReport } from '@/types';

export function useCommunityReports() {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reports from localStorage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('spacewatch-community-reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (error) {
        console.error('Error loading reports from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save reports to localStorage whenever reports change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('spacewatch-community-reports', JSON.stringify(reports));
    }
  }, [reports, isLoading]);

  const addReport = (reportData: Omit<CommunityReport, 'id' | 'timestamp' | 'verified'>) => {
    const newReport: CommunityReport = {
      ...reportData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      verified: false,
    };
    
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  const verifyReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, verified: true } : report
    ));
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const getReportsByLocation = (coordinates: [number, number], radiusKm: number = 10) => {
    return reports.filter(report => {
      const distance = calculateDistance(coordinates, report.coordinates);
      return distance <= radiusKm;
    });
  };

  const getReportsByType = (type: CommunityReport['type']) => {
    return reports.filter(report => report.type === type);
  };

  const getUrgentReports = () => {
    return reports.filter(report => 
      report.severity === 'critical' || report.severity === 'high'
    );
  };

  return {
    reports,
    isLoading,
    addReport,
    verifyReport,
    deleteReport,
    getReportsByLocation,
    getReportsByType,
    getUrgentReports,
  };
}

// Helper function to calculate distance between two coordinates
function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
