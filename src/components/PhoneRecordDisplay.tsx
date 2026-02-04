import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Lock, Calendar, Clock, Download } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generatePhoneRecordsPDF } from '@/utils/pdfGenerator';

type PhoneRecord = Tables<'phone_records'>;

interface CallRecord {
  start_time?: string;
  end_time?: string;
  duration?: string;
  phone_number?: string;
  dialed_number?: string;
  call_count?: number;
  site?: string | null;
  billing_type?: string;
  call_status?: string;
  call_type?: string;
  facility?: string;
  termination_reason?: string;
}

interface PhoneRecordDisplayProps {
  record: PhoneRecord | null;
  isUnlocked: boolean;
  fulfillmentStatus: string;
  availableDate?: string | null;
  docNumber?: string;
}

export const PhoneRecordDisplay = ({
  record,
  isUnlocked,
  fulfillmentStatus,
  availableDate,
  docNumber
}: PhoneRecordDisplayProps) => {
  const handleDownloadPDF = () => {
    if (!record || !docNumber) return;
    const callHistory = (record.call_history as CallRecord[]) || [];
    generatePhoneRecordsPDF(
      docNumber,
      record.total_calls || 0,
      record.total_approved_numbers || 0,
      callHistory,
      record.last_updated || undefined
    );
  };

  if (!isUnlocked) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Phone Records Locked</h3>
            {fulfillmentStatus === 'pending' && availableDate && (
              <p className="text-slate-300 text-sm">
                Available on {new Date(availableDate).toLocaleDateString()}
              </p>
            )}
            {fulfillmentStatus === 'processing' && (
              <p className="text-slate-300 text-sm">
                Being processed - you'll be notified when ready
              </p>
            )}
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Phone Records
          </CardTitle>
        </CardHeader>
        <CardContent className="blur-md select-none">
          <div className="space-y-4">
            <div>
              <div>
                <p className="text-slate-400 text-sm">Approved Numbers</p>
                <p className="text-white text-2xl font-bold">5</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 font-medium">Recent Calls</p>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-700/30 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-300">(555) 123-XXXX</span>
                    <span className="text-slate-400 text-sm">15 min</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!record) {
    return (
      <Alert className="bg-yellow-900/20 border-yellow-500">
        <AlertDescription className="text-yellow-200">
          Phone records data is being prepared. Please check back soon.
        </AlertDescription>
      </Alert>
    );
  }

  const callHistory = (record.call_history as CallRecord[]) || [];
  const isSummary = callHistory.length > 0 && Object.prototype.hasOwnProperty.call(callHistory[0], 'call_count');

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
            <CardTitle className="text-white flex items-center gap-2 flex-shrink-0">
              <Phone className="w-5 h-5" />
              <span className="text-base sm:text-lg">Phone Records</span>
            </CardTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className="bg-green-600 text-xs">Unlocked</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDownloadPDF}
                className="border-blue-500 text-blue-400 hover:bg-blue-500/20 text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>
          {record.last_updated && (
            <p className="text-slate-400 text-xs sm:text-sm">
              Last Updated: {new Date(record.last_updated).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div>
          <div className="bg-slate-700/30 p-3 sm:p-4 rounded-lg">
            <p className="text-slate-400 text-xs sm:text-sm mb-1">Approved Numbers</p>
            <p className="text-white text-2xl sm:text-3xl font-bold">{record.total_approved_numbers}</p>
          </div>
        </div>

        {callHistory.length > 0 && isSummary && (
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2 text-sm sm:text-base">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>Top Dialed Numbers ({callHistory.length})</span>
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {callHistory.map((call, index) => (
                <div key={index} className="bg-slate-700/30 p-3 sm:p-4 rounded-lg border border-slate-600/50">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <span className="text-slate-400 text-xs sm:text-sm block mb-1">Number:</span>
                        <span className="text-white text-sm sm:text-base font-mono break-all">{call.dialed_number || 'N/A'}</span>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <span className="text-slate-400 text-xs sm:text-sm block mb-1">Calls:</span>
                        <span className="text-white text-sm sm:text-base font-semibold">{call.call_count ?? 0}</span>
                      </div>
                    </div>
                    {call.site && (
                      <div className="pt-2 border-t border-slate-600/30">
                        <span className="text-slate-400 text-xs sm:text-sm">Site: </span>
                        <span className="text-white text-xs sm:text-sm">{call.site}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {callHistory.length > 0 && !isSummary && (
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Call History ({callHistory.length} calls)
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {callHistory.map((call, index) => (
                <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400">Phone:</span>
                      <span className="text-white ml-2">{call.phone_number || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-white ml-2">{call.duration || 'N/A'}</span>
                    </div>
                    {call.start_time && (
                      <div>
                        <span className="text-slate-400">Start:</span>
                        <span className="text-white ml-2">{call.start_time}</span>
                      </div>
                    )}
                    {call.call_status && (
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <span className="text-white ml-2">{call.call_status}</span>
                      </div>
                    )}
                    {call.facility && (
                      <div className="col-span-2">
                        <span className="text-slate-400">Facility:</span>
                        <span className="text-white ml-2">{call.facility}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {callHistory.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Phone className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No call history available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
