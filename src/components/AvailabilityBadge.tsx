import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

interface AvailabilityBadgeProps {
  status: 'available' | 'pending' | 'processing';
  availableDate?: string | null;
  compact?: boolean;
}

export const AvailabilityBadge = ({ status, availableDate, compact = false }: AvailabilityBadgeProps) => {
  const statusConfig = {
    available: {
      icon: CheckCircle,
      label: 'Available Now',
      className: 'bg-green-600 hover:bg-green-700 text-white',
      description: 'Records are ready to view'
    },
    pending: {
      icon: Clock,
      label: availableDate ? `Available ${new Date(availableDate).toLocaleDateString()}` : 'Coming Soon',
      className: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      description: availableDate
        ? `Records will be available on ${new Date(availableDate).toLocaleDateString()}`
        : 'Records are being prepared'
    },
    processing: {
      icon: Loader2,
      label: 'Being Processed',
      className: 'bg-blue-600 hover:bg-blue-700 text-white',
      description: 'Records will be manually processed after purchase'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  if (compact) {
    return (
      <Badge className={config.className}>
        <Icon className={`w-3 h-3 mr-1 ${status === 'processing' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
    );
  }

  return (
    <div className="flex items-start space-x-2">
      <Badge className={config.className}>
        <Icon className={`w-3 h-3 mr-1 ${status === 'processing' ? 'animate-spin' : ''}`} />
        {config.label}
      </Badge>
      <p className="text-xs text-slate-400 mt-0.5">{config.description}</p>
    </div>
  );
};
