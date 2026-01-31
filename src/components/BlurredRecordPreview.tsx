import { Lock, Phone, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PhonePreview {
  top_numbers: Array<{
    dialed_number: string;
    site: string;
    call_count: number;
  }>;
  total_calls: number;
  total_unique_numbers: number;
}

interface VisitorPreview {
  top_visitors: Array<{
    name: string;
    relationship?: string;
    address?: string;
    phone?: string;
  }>;
  total_visitors: number;
}

interface BlurredRecordPreviewProps {
  type: 'phone' | 'visitor';
  preview: PhonePreview | VisitorPreview | null;
}

export const BlurredRecordPreview = ({ type, preview }: BlurredRecordPreviewProps) => {
  if (!preview) return null;

  const renderPhonePreview = (data: PhonePreview) => (
    <div className="relative">
      {/* Blurred Content */}
      <div className="filter blur-sm pointer-events-none select-none">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-white font-semibold mb-3">
            <span>Total Calls: {data.total_calls}</span>
            <span>Unique Numbers: {data.total_unique_numbers}</span>
          </div>

          <div className="space-y-1.5">
            {data.top_numbers.map((call, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-blue-500/60 rounded text-sm"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-mono font-bold">
                    ({call.dialed_number.slice(0, 3)}) {call.dialed_number.slice(3, 6)}-{call.dialed_number.slice(6)}
                  </span>
                </div>
                <span className="text-white font-semibold">{call.call_count} calls</span>
              </div>
            ))}
          </div>

          <div className="text-xs text-white font-semibold mt-2">
            + {data.total_unique_numbers - data.top_numbers.length} more numbers
          </div>
        </div>
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
        <div className="bg-slate-800/95 backdrop-blur-md rounded-lg p-4 border border-slate-600/50 text-center">
          <Lock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-white font-semibold mb-1">Preview</div>
          <div className="text-xs text-slate-300">Purchase to unlock full records</div>
        </div>
      </div>
    </div>
  );

  const renderVisitorPreview = (data: VisitorPreview) => (
    <div className="relative">
      {/* Blurred Content */}
      <div className="filter blur-sm pointer-events-none select-none">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-white font-semibold mb-3">
            <span>Total Visitors: {data.total_visitors}</span>
          </div>

          <div className="space-y-1.5">
            {data.top_visitors.map((visitor, idx) => (
              <div
                key={idx}
                className="p-2 bg-purple-500/60 rounded text-sm"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-3.5 h-3.5 text-white" />
                  <span className="text-white font-bold">{visitor.name}</span>
                </div>
                {visitor.relationship && (
                  <div className="text-xs text-white font-semibold ml-5">{visitor.relationship}</div>
                )}
              </div>
            ))}
          </div>

          <div className="text-xs text-white font-semibold mt-2">
            + {data.total_visitors - data.top_visitors.length} more visitors
          </div>
        </div>
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
        <div className="bg-slate-800/95 backdrop-blur-md rounded-lg p-4 border border-slate-600/50 text-center">
          <Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-white font-semibold mb-1">Preview</div>
          <div className="text-xs text-slate-300">Purchase to unlock full records</div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-slate-800/20 border-slate-700/50 mt-2">
      <CardContent className="p-3">
        {type === 'phone' && renderPhonePreview(preview as PhonePreview)}
        {type === 'visitor' && renderVisitorPreview(preview as VisitorPreview)}
      </CardContent>
    </Card>
  );
};
