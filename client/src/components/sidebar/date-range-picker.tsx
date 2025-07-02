import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateRangePickerProps {
  dateFrom?: string;
  dateTo?: string;
  onDateChange: (dateFrom?: string, dateTo?: string) => void;
}

export function DateRangePicker({ dateFrom, dateTo, onDateChange }: DateRangePickerProps) {
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div>
      <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide mb-3">
        Date Range
      </h3>
      <div className="space-y-3">
        <div>
          <Label className="block text-xs text-text-secondary mb-1">From Date</Label>
          <Input
            type="date"
            value={dateFrom || thirtyDaysAgo}
            onChange={(e) => onDateChange(e.target.value, dateTo)}
            className="w-full bg-input text-text-primary border-border"
          />
        </div>
        <div>
          <Label className="block text-xs text-text-secondary mb-1">To Date</Label>
          <Input
            type="date"
            value={dateTo || today}
            onChange={(e) => onDateChange(dateFrom, e.target.value)}
            className="w-full bg-input text-text-primary border-border"
          />
        </div>
      </div>
    </div>
  );
}
