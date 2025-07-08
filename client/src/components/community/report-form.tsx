import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MapPin, Send, Plus } from 'lucide-react';
import type { CommunityReport } from '@/types';

interface ReportFormProps {
  coordinates: [number, number];
  onSubmit: (report: Omit<CommunityReport, 'id' | 'timestamp' | 'verified'>) => void;
  trigger?: React.ReactNode;
}

export function ReportForm({ coordinates, onSubmit, trigger }: ReportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'other' as CommunityReport['type'],
    title: '',
    description: '',
    reporter: '',
    severity: 'medium' as CommunityReport['severity'],
  });

  const reportTypes = [
    { value: 'deforestation', label: 'Deforestation', icon: '🌲' },
    { value: 'disaster', label: 'Natural Disaster', icon: '⚠️' },
    { value: 'pollution', label: 'Pollution', icon: '🏭' },
    { value: 'urban_sprawl', label: 'Urban Sprawl', icon: '🏙️' },
    { value: 'agriculture', label: 'Agricultural Issues', icon: '🌾' },
    { value: 'other', label: 'Other', icon: '📍' },
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const report = {
      ...formData,
      coordinates,
    };

    onSubmit(report);
    setIsOpen(false);
    setFormData({
      type: 'other',
      title: '',
      description: '',
      reporter: '',
      severity: 'medium',
    });
  };

  const selectedType = reportTypes.find(t => t.value === formData.type);
  const selectedSeverity = severityLevels.find(s => s.value === formData.severity);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Plus size={14} />
            Report Issue
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-primary" />
            Report Environmental Issue
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <MapPin size={14} />
            <span>
              {coordinates[0].toFixed(4)}, {coordinates[1].toFixed(4)}
            </span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Issue Type</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value as CommunityReport['type'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <span>{type.icon}</span>
                      <span>{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level</Label>
            <Select 
              value={formData.severity} 
              onValueChange={(value) => setFormData({ ...formData, severity: value as CommunityReport['severity'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                {severityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <Badge className={`${level.color} text-xs`}>
                      {level.label}
                    </Badge>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of what you observed..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reporter">Your Name/Organization</Label>
            <Input
              id="reporter"
              value={formData.reporter}
              onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
              placeholder="Your name or organization (optional)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Send size={14} />
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
