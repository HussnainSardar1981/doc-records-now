import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Lock, Calendar, Download } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateVisitorRecordsPDF } from '@/utils/pdfGenerator';

type VisitorRecord = Tables<'visitation_records'>;

interface ApprovedVisitor {
  name?: string;
  relationship?: string;
  approval_date?: string;
  status?: string;
}

interface Visit {
  date?: string;
  start_time?: string;
  visitor_name?: string;
  visitor_age?: number | string;
  relationship?: string;
  visit_type?: string;
  check_in?: string;
  check_out?: string;
  duration?: string;
  location?: string;
}

interface VisitorRecordDisplayProps {
  record: VisitorRecord | null;
  isUnlocked: boolean;
  fulfillmentStatus: string;
  availableDate?: string | null;
  docNumber?: string;
}

export const VisitorRecordDisplay = ({
  record,
  isUnlocked,
  fulfillmentStatus,
  availableDate,
  docNumber
}: VisitorRecordDisplayProps) => {
  const handleDownloadPDF = () => {
    if (!record || !docNumber) return;
    const approvedVisitors = (record.approved_visitors as ApprovedVisitor[]) || [];
    const visitHistory = (record.visit_history as Visit[]) || [];
    generateVisitorRecordsPDF(
      docNumber,
      record.total_approved_visitors || 0,
      record.total_visits || 0,
      approvedVisitors,
      visitHistory,
      record.last_updated || undefined
    );
  };

  if (!isUnlocked) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-slate-900/60 z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">Visitor Records Locked</h3>
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
            <Users className="w-5 h-5" />
            Visitor Records
          </CardTitle>
        </CardHeader>
        <CardContent className="blur-md select-none">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Total Visits</p>
                <p className="text-white text-2xl font-bold">18</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Approved Visitors</p>
                <p className="text-white text-2xl font-bold">3</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-slate-300 font-medium">Approved Visitors</p>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-700/30 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-300">John Doe</span>
                    <span className="text-slate-400 text-sm">Family</span>
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
          Visitor records data is being prepared. Please check back soon.
        </AlertDescription>
      </Alert>
    );
  }

  const approvedVisitors = (record.approved_visitors as ApprovedVisitor[]) || [];
  const visitHistory = (record.visit_history as Visit[]) || [];

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Visitor Records
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-600">Unlocked</Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadPDF}
              className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
            >
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
        {record.last_updated && (
          <p className="text-slate-400 text-sm">
            Last Updated: {new Date(record.last_updated).toLocaleDateString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Total Visits</p>
            <p className="text-white text-3xl font-bold">{record.total_visits}</p>
          </div>
          <div className="bg-slate-700/30 p-4 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Approved Visitors</p>
            <p className="text-white text-3xl font-bold">{record.total_approved_visitors}</p>
          </div>
        </div>

        {approvedVisitors.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Approved Visitors ({approvedVisitors.length})
            </h3>
            <div className="space-y-2">
              {approvedVisitors.map((visitor, index) => (
                <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{visitor.name || 'N/A'}</p>
                      <p className="text-slate-400 text-sm">{visitor.relationship || visitor.status || 'N/A'}</p>
                    </div>
                    {visitor.approval_date && (
                      <Badge variant="outline" className="text-xs">
                        Approved: {new Date(visitor.approval_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {visitHistory.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Visit History ({visitHistory.length} visits)
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {visitHistory.map((visit, index) => (
                <div key={index} className="bg-slate-700/30 p-4 rounded-lg border border-slate-600/50">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-400">Visitor:</span>
                      <span className="text-white ml-2">{visit.visitor_name || 'N/A'}</span>
                    </div>
                    {visit.visitor_age && (
                      <div>
                        <span className="text-slate-400">Age:</span>
                        <span className="text-white ml-2">{visit.visitor_age}</span>
                      </div>
                    )}
                    {visit.relationship && (
                      <div>
                        <span className="text-slate-400">Relationship:</span>
                        <span className="text-white ml-2">{visit.relationship}</span>
                      </div>
                    )}
                    {visit.start_time && (
                      <div>
                        <span className="text-slate-400">Visit Time:</span>
                        <span className="text-white ml-2">
                          {new Date(visit.start_time).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {visit.visit_type && (
                      <div>
                        <span className="text-slate-400">Visit Type:</span>
                        <span className="text-white ml-2">{visit.visit_type}</span>
                      </div>
                    )}
                    {visit.check_in && (
                      <div>
                        <span className="text-slate-400">Check In:</span>
                        <span className="text-white ml-2">{visit.check_in}</span>
                      </div>
                    )}
                    {visit.check_out && (
                      <div>
                        <span className="text-slate-400">Check Out:</span>
                        <span className="text-white ml-2">{visit.check_out}</span>
                      </div>
                    )}
                    {visit.duration && (
                      <div>
                        <span className="text-slate-400">Duration:</span>
                        <span className="text-white ml-2">{visit.duration}</span>
                      </div>
                    )}
                    {visit.location && (
                      <div>
                        <span className="text-slate-400">Location:</span>
                        <span className="text-white ml-2">{visit.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {approvedVisitors.length === 0 && visitHistory.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No visitor records available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
