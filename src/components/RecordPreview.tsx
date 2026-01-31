import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Users, Lock, Eye } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * RecordPreview Component
 *
 * Shows a blurred TEASER/SAMPLE of record structure before purchase.
 * This is intentionally static sample data, NOT the actual inmate's data.
 * The purpose is to show users what TYPE of data they'll receive, not the actual content.
 * Actual records are only accessible after purchase when records_unlocked = true.
 */

interface RecordPreviewProps {
  recordType: 'telephone' | 'visitor';
  isAvailable?: boolean;
  availableDate?: string | null;
}

export const RecordPreview = ({ recordType, isAvailable = false, availableDate }: RecordPreviewProps) => {
  const isPhone = recordType === 'telephone';

  const config = {
    telephone: {
      icon: Phone,
      title: 'Phone Records Preview',
      lockIconClass: 'text-blue-400',
      badgeClass: 'bg-blue-600',
      sampleData: {
        totalCalls: '42',
        approvedNumbers: '5',
        recentCalls: [
          { number: '(555) 123-XXXX', duration: '15 min' },
          { number: '(555) 987-XXXX', duration: '8 min' },
          { number: '(555) 456-XXXX', duration: '22 min' }
        ]
      }
    },
    visitor: {
      icon: Users,
      title: 'Visitor Records Preview',
      lockIconClass: 'text-purple-400',
      badgeClass: 'bg-purple-600',
      sampleData: {
        totalVisits: '18',
        approvedVisitors: '3',
        recentVisitors: [
          { name: 'John Doe', relationship: 'Family' },
          { name: 'Jane Smith', relationship: 'Friend' },
          { name: 'Bob Johnson', relationship: 'Family' }
        ]
      }
    }
  };

  const data = config[recordType];
  const Icon = data.icon;

  return (
    <div className="space-y-3">
      <Card className="bg-slate-800/50 border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className={`w-12 h-12 ${data.lockIconClass} mx-auto mb-4`} />
            <h3 className="text-white text-lg font-semibold mb-2">Preview Mode</h3>
            <p className="text-slate-300 text-sm mb-3">
              This is a sample of what you'll receive
            </p>
            <Badge className={data.badgeClass}>
              <Eye className="w-3 h-3 mr-1" />
              Purchase to Unlock
            </Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {data.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="blur-md select-none">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">
                  {isPhone ? 'Total Calls' : 'Total Visits'}
                </p>
                <p className="text-white text-2xl font-bold">
                  {isPhone ? data.sampleData.totalCalls : data.sampleData.totalVisits}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">
                  {isPhone ? 'Approved Numbers' : 'Approved Visitors'}
                </p>
                <p className="text-white text-2xl font-bold">
                  {isPhone ? data.sampleData.approvedNumbers : data.sampleData.approvedVisitors}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 font-medium">
                {isPhone ? 'Recent Calls' : 'Approved Visitors'}
              </p>
              {isPhone
                ? data.sampleData.recentCalls.map((call, i) => (
                    <div key={i} className="bg-slate-700/30 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{call.number}</span>
                        <span className="text-slate-400 text-sm">{call.duration}</span>
                      </div>
                    </div>
                  ))
                : data.sampleData.recentVisitors.map((visitor, i) => (
                    <div key={i} className="bg-slate-700/30 p-3 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-slate-300">{visitor.name}</span>
                        <span className="text-slate-400 text-sm">{visitor.relationship}</span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {isAvailable && (
        <Alert className="bg-green-900/20 border-green-500">
          <AlertDescription className="text-green-200 text-sm">
            Records are available now - immediate access after payment
          </AlertDescription>
        </Alert>
      )}

      {!isAvailable && availableDate && (
        <Alert className="bg-yellow-900/20 border-yellow-500">
          <AlertDescription className="text-yellow-200 text-sm">
            Records will be available on {new Date(availableDate).toLocaleDateString()}
          </AlertDescription>
        </Alert>
      )}

      {!isAvailable && !availableDate && (
        <Alert className="bg-blue-900/20 border-blue-500">
          <AlertDescription className="text-blue-200 text-sm">
            Records will be processed manually after purchase
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
