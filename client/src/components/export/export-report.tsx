import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Share2, Link, Copy, FileText, Image, MapPin, Calendar } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { ExportReport, ImpactMetrics, ChangeDetectionResult } from '@/types';

interface ExportReportProps {
  location: string;
  coordinates: [number, number];
  bounds: [number, number, number, number];
  layer: string;
  dateRange: { from?: string; to?: string };
  metrics: ImpactMetrics;
  changeDetection?: ChangeDetectionResult;
  images: string[];
  trigger?: React.ReactNode;
}

export function ExportReport({ 
  location, 
  coordinates, 
  bounds, 
  layer, 
  dateRange, 
  metrics, 
  changeDetection,
  images,
  trigger 
}: ExportReportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const { toast } = useToast();

  const generateReport = async (format: 'pdf' | 'json' | 'csv') => {
    setIsExporting(true);
    
    try {
      const report: ExportReport = {
        id: Date.now().toString(),
        title: reportTitle || `Environmental Analysis - ${location}`,
        location,
        coordinates,
        bounds,
        layer,
        dateRange,
        metrics,
        changeDetection,
        images,
        timestamp: new Date().toISOString(),
      };

      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (format === 'pdf') {
        await generatePDF(report);
      } else if (format === 'json') {
        await downloadJSON(report);
      } else if (format === 'csv') {
        await downloadCSV(report);
      }

      toast({
        title: "Report Generated",
        description: `${format.toUpperCase()} report downloaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDF = async (report: ExportReport) => {
    // Mock PDF generation
    const pdfContent = `
      Environmental Analysis Report
      
      Location: ${report.location}
      Coordinates: ${report.coordinates[0].toFixed(4)}, ${report.coordinates[1].toFixed(4)}
      Analysis Date: ${new Date(report.timestamp).toLocaleDateString()}
      
      Area Analyzed: ${report.metrics.areaKm2.toFixed(2)} km²
      ${report.metrics.vegetationCoverage ? `Vegetation Coverage: ${report.metrics.vegetationCoverage}%` : ''}
      ${report.metrics.waterCoverage ? `Water Coverage: ${report.metrics.waterCoverage}%` : ''}
      ${report.metrics.urbanCoverage ? `Urban Coverage: ${report.metrics.urbanCoverage}%` : ''}
      
      ${report.changeDetection ? `
      Change Detection Results:
      - Change Type: ${report.changeDetection.changeType.replace('_', ' ')}
      - Affected Area: ${report.changeDetection.affectedAreaKm2.toFixed(2)} km²
      - Change Percentage: ${report.changeDetection.changePercentage.toFixed(1)}%
      - Confidence: ${(report.changeDetection.confidenceLevel * 100).toFixed(0)}%
      - Description: ${report.changeDetection.description}
      ` : ''}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = async (report: ExportReport) => {
    const jsonContent = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = async (report: ExportReport) => {
    const csvContent = [
      'Field,Value',
      `Title,${report.title}`,
      `Location,${report.location}`,
      `Latitude,${report.coordinates[0]}`,
      `Longitude,${report.coordinates[1]}`,
      `Layer,${report.layer}`,
      `Area (km²),${report.metrics.areaKm2}`,
      `Vegetation Coverage (%),${report.metrics.vegetationCoverage || 'N/A'}`,
      `Water Coverage (%),${report.metrics.waterCoverage || 'N/A'}`,
      `Urban Coverage (%),${report.metrics.urbanCoverage || 'N/A'}`,
      `Analysis Date,${new Date(report.timestamp).toLocaleDateString()}`,
      ...(report.changeDetection ? [
        `Change Detected,${report.changeDetection.hasSignificantChange ? 'Yes' : 'No'}`,
        `Change Type,${report.changeDetection.changeType.replace('_', ' ')}`,
        `Affected Area (km²),${report.changeDetection.affectedAreaKm2}`,
        `Change Percentage,${report.changeDetection.changePercentage}`,
        `Confidence Level,${report.changeDetection.confidenceLevel * 100}%`,
      ] : [])
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}_report.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateShareUrl = () => {
    const params = new URLSearchParams({
      lat: coordinates[0].toString(),
      lng: coordinates[1].toString(),
      layer,
      ...(dateRange.from && { dateFrom: dateRange.from }),
      ...(dateRange.to && { dateTo: dateRange.to }),
    });
    
    const url = `${window.location.origin}?${params.toString()}`;
    setShareUrl(url);
    
    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Share URL Generated",
        description: "Link copied to clipboard!",
      });
    });
  };

  const formatArea = (area: number) => {
    if (area < 1) {
      return `${(area * 100).toFixed(1)} hectares`;
    }
    return `${area.toFixed(1)} km²`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={14} />
            Export Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Export Environmental Report
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Report Summary */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} />
                  <span className="font-medium">{location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <span>Area: {formatArea(metrics.areaKm2)}</span>
                  <span>•</span>
                  <span>Layer: {layer}</span>
                </div>
                {(dateRange.from || dateRange.to) && (
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar size={14} />
                    <span>
                      {dateRange.from && dateRange.to 
                        ? `${dateRange.from} to ${dateRange.to}`
                        : dateRange.from || dateRange.to}
                    </span>
                  </div>
                )}
                {changeDetection && changeDetection.hasSignificantChange && (
                  <Badge className="bg-orange-100 text-orange-800">
                    Change detected: {changeDetection.changeType.replace('_', ' ')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Report Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              placeholder={`Environmental Analysis - ${location}`}
            />
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary">Export Options</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => generateReport('pdf')}
                disabled={isExporting}
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <FileText size={16} />
                <span className="text-xs">PDF Report</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => generateReport('json')}
                disabled={isExporting}
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <Download size={16} />
                <span className="text-xs">JSON Data</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => generateReport('csv')}
                disabled={isExporting}
                className="flex flex-col items-center gap-2 h-auto py-3"
              >
                <FileText size={16} />
                <span className="text-xs">CSV Data</span>
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary">Share Analysis</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={generateShareUrl}
                className="w-full gap-2"
              >
                <Share2 size={14} />
                Generate Share Link
              </Button>
              
              {shareUrl && (
                <div className="flex items-center gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          {isExporting && (
            <Alert>
              <Download className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Generating report... This may take a moment.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
