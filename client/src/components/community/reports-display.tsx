import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Users, MapPin, Calendar, CheckCircle, AlertTriangle, Search, Filter } from 'lucide-react';
import type { CommunityReport } from '@/types';

interface ReportsDisplayProps {
  reports: CommunityReport[];
  onReportClick?: (report: CommunityReport) => void;
  onVerifyReport?: (reportId: string) => void;
}

export function ReportsDisplay({ reports, onReportClick, onVerifyReport }: ReportsDisplayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const reportTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'deforestation', label: 'Deforestation', icon: '🌲' },
    { value: 'disaster', label: 'Natural Disaster', icon: '⚠️' },
    { value: 'pollution', label: 'Pollution', icon: '🏭' },
    { value: 'urban_sprawl', label: 'Urban Sprawl', icon: '🏙️' },
    { value: 'agriculture', label: 'Agricultural Issues', icon: '🌾' },
    { value: 'other', label: 'Other', icon: '📍' },
  ];

  const severityLevels = [
    { value: 'all', label: 'All Severity' },
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter;
    
    return matchesSearch && matchesType && matchesSeverity;
  });

  const getTypeInfo = (type: string) => {
    return reportTypes.find(t => t.value === type);
  };

  const getSeverityInfo = (severity: string) => {
    return severityLevels.find(s => s.value === severity);
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUrgentReports = () => {
    return filteredReports.filter(r => r.severity === 'critical' || r.severity === 'high').length;
  };

  const getVerifiedReports = () => {
    return filteredReports.filter(r => r.verified).length;
  };

  return (
    <Card className="bg-background border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="text-primary" size={18} />
            <CardTitle className="text-sm font-semibold text-text-primary">
              Community Reports
            </CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {filteredReports.length} reports
          </Badge>
        </div>
        
        {/* Stats */}
        <div className="flex space-x-4 text-xs text-text-secondary">
          <div className="flex items-center space-x-1">
            <AlertTriangle size={12} className="text-orange-500" />
            <span>{getUrgentReports()} urgent</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle size={12} className="text-green-500" />
            <span>{getVerifiedReports()} verified</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Search size={14} />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
          
          <div className="flex space-x-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon && <span>{type.icon}</span>}
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.value === 'all' ? (
                      <span>{level.label}</span>
                    ) : (
                      <Badge className={`${level.color} text-xs`}>
                        {level.label}
                      </Badge>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filteredReports.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm">No reports found</p>
              <p className="text-xs">Be the first to report an environmental issue!</p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const typeInfo = getTypeInfo(report.type);
              const severityInfo = getSeverityInfo(report.severity);
              
              return (
                <div
                  key={report.id}
                  className="border border-border rounded-lg p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onReportClick?.(report)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {typeInfo?.icon && <span className="text-sm">{typeInfo.icon}</span>}
                      <h4 className="text-sm font-medium text-text-primary">{report.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      {severityInfo && (
                        <Badge className={`${severityInfo.color} text-xs`}>
                          {severityInfo.label}
                        </Badge>
                      )}
                      {report.verified && (
                        <CheckCircle size={12} className="text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-text-secondary mb-2 line-clamp-2">
                    {report.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <MapPin size={10} />
                      <span>
                        {report.coordinates[0].toFixed(3)}, {report.coordinates[1].toFixed(3)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={10} />
                      <span>{formatDate(report.timestamp)}</span>
                    </div>
                  </div>
                  
                  {report.reporter && (
                    <div className="text-xs text-text-secondary mt-1">
                      Reported by: {report.reporter}
                    </div>
                  )}
                  
                  {onVerifyReport && !report.verified && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onVerifyReport(report.id);
                        }}
                        className="h-6 text-xs"
                      >
                        Verify Report
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
