import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Users, AlertCircle, Info } from 'lucide-react';
import { AvailabilityBadge } from './AvailabilityBadge';
import { useRecordAvailability, AvailabilityResponse } from '@/hooks/useRecordAvailability';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppState } from '@/contexts/AppStateContext';
import { RecordPreview } from './RecordPreview';

interface RecordAvailabilityPanelProps {
  docNumber: string;
  selectedRecordTypes: string[];
  onAvailabilityChecked?: (data: AvailabilityResponse) => void;
}

export const RecordAvailabilityPanel = ({
  docNumber,
  selectedRecordTypes,
  onAvailabilityChecked
}: RecordAvailabilityPanelProps) => {
  const { checkAvailability, loading, error } = useRecordAvailability();
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);
  const { state } = useAppState();

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!docNumber) return;

      // Determine the actual DOC number to use
      let actualDocNumber = docNumber;

      // If docNumber looks like a name (contains letters/spaces), try to get DOC from search results
      if (!/^[0-9]{3,8}$/.test(docNumber.trim())) {
        if (state.searchResults.length === 1) {
          // Use the DOC number from the single search result
          actualDocNumber = state.searchResults[0].docNumber;
          console.log('Using DOC number from search result:', actualDocNumber);
        } else if (state.searchResults.length > 1) {
          // Multiple results, can't determine which one
          console.warn('Multiple search results found, cannot determine DOC number');
          return;
        } else {
          // No search results and not a valid DOC number
          console.warn('Invalid DOC number format and no search results');
          return;
        }
      }

      const result = await checkAvailability(actualDocNumber);
      if (result) {
        setAvailability(result);
        onAvailabilityChecked?.(result);
      }
    };

    fetchAvailability();
  }, [docNumber, state.searchResults]);

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Checking Record Availability...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="bg-red-900/20 border-red-500">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-red-200">
          Failed to check availability: {error}
        </AlertDescription>
      </Alert>
    );
  }

  // Check if we have multiple search results and no valid DOC number
  const isNameSearch = !/^[0-9]{3,8}$/.test(docNumber.trim());
  if (isNameSearch && state.searchResults.length > 1) {
    return (
      <Alert className="bg-yellow-900/20 border-yellow-500">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-yellow-200">
          Multiple inmates found. Please enter the specific DOC number from the search results above to check record availability.
        </AlertDescription>
      </Alert>
    );
  }

  if (isNameSearch && state.searchResults.length === 0) {
    return (
      <Alert className="bg-blue-900/20 border-blue-500">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-blue-200">
          Please search for an inmate first, or enter a DOC number directly.
        </AlertDescription>
      </Alert>
    );
  }

  if (!availability) {
    return null;
  }

  const showPhone = selectedRecordTypes.includes('telephone');
  const showVisitor = selectedRecordTypes.includes('visitor');

  const allAvailable =
    (!showPhone || availability.phone_records.available) &&
    (!showVisitor || availability.visitor_records.available);

  const anyProcessing =
    (showPhone && availability.phone_records.status === 'processing') ||
    (showVisitor && availability.visitor_records.status === 'processing');

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Info className="w-5 h-5" />
            Record Availability for {availability.inmate_name || docNumber}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showPhone && (
            <div className="flex items-start justify-between p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium mb-1">Phone Records</h4>
                  <AvailabilityBadge
                    status={availability.phone_records.status}
                    availableDate={availability.phone_records.available_date}
                  />
                </div>
              </div>
            </div>
          )}

          {showVisitor && (
            <div className="flex items-start justify-between p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium mb-1">Visitor Records</h4>
                  <AvailabilityBadge
                    status={availability.visitor_records.status}
                    availableDate={availability.visitor_records.available_date}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!availability.exists && (
        <Alert className="bg-blue-900/20 border-blue-500">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-blue-200">
            This inmate is not yet in our records database. Your purchase will be processed manually,
            and you'll be notified when records are available.
          </AlertDescription>
        </Alert>
      )}

      {allAvailable && (
        <Alert className="bg-green-900/20 border-green-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-green-200">
            All requested records are available now! You'll have immediate access after payment.
          </AlertDescription>
        </Alert>
      )}

      {anyProcessing && (
        <Alert className="bg-yellow-900/20 border-yellow-500">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-yellow-200">
            Some records need manual processing. You can still purchase - we'll notify you when they're ready.
            <strong className="block mt-1">Purchase is never blocked.</strong>
          </AlertDescription>
        </Alert>
      )}

      {showPhone && (
        <RecordPreview
          recordType="telephone"
          isAvailable={availability.phone_records.available}
          availableDate={availability.phone_records.available_date}
        />
      )}

      {showVisitor && (
        <RecordPreview
          recordType="visitor"
          isAvailable={availability.visitor_records.available}
          availableDate={availability.visitor_records.available_date}
        />
      )}
    </div>
  );
};
