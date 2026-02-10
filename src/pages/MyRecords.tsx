import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, ShoppingBag, AlertCircle, Phone, Users } from 'lucide-react';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useRecordData } from '@/hooks/useRecordData';
import { PhoneRecordDisplay } from '@/components/PhoneRecordDisplay';
import { VisitorRecordDisplay } from '@/components/VisitorRecordDisplay';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LoadingCard } from '@/components/LoadingCard';
import DisclaimerPopup from '@/components/DisclaimerPopup';

const OrderCard = ({ order, filter }: { order: any; filter: 'all' | 'telephone' | 'visitor' }) => {
  const { phoneRecord, visitorRecord, loading } = useRecordData({
    phoneRecordId: order.phone_record_id,
    visitorRecordId: order.visitor_record_id,
    recordsUnlocked: order.records_unlocked
  });

  const [availabilityDates, setAvailabilityDates] = useState<{
    phone_date: string | null;
    visitor_date: string | null;
  }>({ phone_date: null, visitor_date: null });
  const [inmateName, setInmateName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchInmateInfo = async () => {
      // Use inmate_doc_number if available, fallback to inmate_id for older orders
      const docNumber = order.inmate_doc_number || order.inmate_id;
      if (!docNumber) return;

      const { data } = await supabase
        .from('inmates')
        .select('full_name, phone_records_available_date, visitor_records_available_date')
        .eq('doc_number', docNumber)
        .single();

      if (data) {
        setAvailabilityDates({
          phone_date: data.phone_records_available_date,
          visitor_date: data.visitor_records_available_date
        });
        if (data.full_name) {
          setInmateName(data.full_name);
        }
      }
    };

    fetchInmateInfo();
  }, [order.inmate_doc_number, order.inmate_id]);

  const hasPhoneRecords = order.record_types.includes('telephone') && (filter === 'all' || filter === 'telephone');
  const hasVisitorRecords = order.record_types.includes('visitor') && (filter === 'all' || filter === 'visitor');

  const getFulfillmentBadge = () => {
    switch (order.fulfillment_status) {
      case 'fulfilled':
        return <Badge className="bg-green-600">Fulfilled</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case 'processing':
        return <Badge className="bg-blue-600">Processing</Badge>;
      default:
        return <Badge variant="secondary">{order.fulfillment_status}</Badge>;
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white mb-2">
              Order for DOC #{order.inmate_doc_number || order.inmate_id}
            </CardTitle>
            <p className="text-slate-400 text-sm">
              Purchased: {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-slate-400 text-sm">
              Order ID: {order.id.slice(0, 8)}...
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getFulfillmentBadge()}
            <span className="text-blue-400 font-semibold">
              ${order.paid_amount.toFixed(2)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="ml-2 text-slate-300">Loading records...</span>
          </div>
        )}

        {!loading && hasPhoneRecords && (
          <PhoneRecordDisplay
            record={phoneRecord}
            isUnlocked={order.records_unlocked && !!order.phone_record_id}
            fulfillmentStatus={order.fulfillment_status}
            availableDate={availabilityDates.phone_date}
            docNumber={order.inmate_doc_number || order.inmate_id}
            inmateName={inmateName}
          />
        )}

        {!loading && hasVisitorRecords && (
          <VisitorRecordDisplay
            record={visitorRecord}
            isUnlocked={order.records_unlocked && !!order.visitor_record_id}
            fulfillmentStatus={order.fulfillment_status}
            availableDate={availabilityDates.visitor_date}
            docNumber={order.inmate_doc_number || order.inmate_id}
            inmateName={inmateName}
          />
        )}

        {order.fulfillment_status === 'processing' && (
          <Alert className="bg-blue-900/20 border-blue-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              Your records are being manually processed. We'll notify you via email when they're ready.
            </AlertDescription>
          </Alert>
        )}

        {order.fulfillment_status === 'pending' && !order.records_unlocked && (
          <Alert className="bg-yellow-900/20 border-yellow-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-yellow-200">
              Your records are pending availability. Check back soon or we'll email you when ready.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const MyRecords = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, loading, error } = useUserOrders();

  // Get DOC number from navigation state (for free access users)
  const navState = location.state as { docNumber?: string; recordType?: string } | null;

  // Set initial filter based on navigation state
  const getInitialFilter = (): 'all' | 'telephone' | 'visitor' => {
    if (navState?.recordType === 'phone') return 'telephone';
    if (navState?.recordType === 'visitor') return 'visitor';
    return 'all';
  };

  const [recordFilter, setRecordFilter] = useState<'all' | 'telephone' | 'visitor'>(getInitialFilter());
  const [freeAccessRecord, setFreeAccessRecord] = useState<any>(null);
  const [loadingFreeAccess, setLoadingFreeAccess] = useState(false);

  // Fetch records for free access users
  useEffect(() => {
    const fetchFreeAccessRecords = async () => {
      if (!user || !navState?.docNumber) return;

      setLoadingFreeAccess(true);
      try {
        // Check if user has free access
        const { data: profile } = await supabase
          .from('profiles')
          .select('has_free_access')
          .eq('id', user.id)
          .single() as { data: { has_free_access: boolean } | null };

        if (!profile?.has_free_access) {
          setLoadingFreeAccess(false);
          return;
        }

        // Fetch inmate info
        const { data: inmate } = await supabase
          .from('inmates')
          .select('*')
          .eq('doc_number', navState.docNumber)
          .single();

        if (!inmate) {
          setLoadingFreeAccess(false);
          return;
        }

        // Fetch phone and visitor records
        const { data: phoneRecord } = await supabase
          .from('phone_records')
          .select('*')
          .eq('inmate_id', inmate.id)
          .maybeSingle();

        const { data: visitorRecord } = await supabase
          .from('visitation_records')
          .select('*')
          .eq('inmate_id', inmate.id)
          .maybeSingle();

        setFreeAccessRecord({
          inmate,
          phoneRecord,
          visitorRecord
        });
      } catch (err) {
        console.error('Error fetching free access records:', err);
      } finally {
        setLoadingFreeAccess(false);
      }
    };

    fetchFreeAccessRecords();
  }, [user, navState?.docNumber]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#00063d] to-[#0a1854] flex flex-col">
        <Header />
        <div className="container mx-auto px-6 py-12 flex-1">
          <Alert className="bg-red-900/20 border-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              Please log in to view your records.
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => navigate('/login')}
            className="mt-4 bg-[#00063d] hover:bg-[#0a1854]"
          >
            Log In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00063d] to-[#0a1854] flex flex-col">
      <DisclaimerPopup />
      <Header />
      <div className="container mx-auto px-6 py-12 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            My Records
          </h1>
          <p className="text-slate-300">View and access your purchased inmate records</p>

          <div className="flex gap-2 mt-4 flex-wrap">
            <Button
              variant={recordFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setRecordFilter('all')}
              className={recordFilter === 'all'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
              size="sm"
            >
              <FileText className="w-4 h-4 mr-1.5" />
              All Records
            </Button>
            <Button
              variant={recordFilter === 'telephone' ? 'default' : 'outline'}
              onClick={() => setRecordFilter('telephone')}
              className={recordFilter === 'telephone'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
              size="sm"
            >
              <Phone className="w-4 h-4 mr-1.5" />
              Phone Records
            </Button>
            <Button
              variant={recordFilter === 'visitor' ? 'default' : 'outline'}
              onClick={() => setRecordFilter('visitor')}
              className={recordFilter === 'visitor'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
              size="sm"
            >
              <Users className="w-4 h-4 mr-1.5" />
              Visitor Records
            </Button>
          </div>
        </div>

        {loading && (
          <div className="space-y-6">
            <LoadingCard rows={4} />
            <LoadingCard rows={4} />
          </div>
        )}

        {error && (
          <Alert className="bg-red-900/20 border-red-500">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-200">
              Error loading orders: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Free access record display */}
        {loadingFreeAccess && (
          <div className="space-y-6">
            <LoadingCard rows={4} />
          </div>
        )}

        {!loadingFreeAccess && freeAccessRecord && (
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white mb-2">
                Records for DOC #{freeAccessRecord.inmate.doc_number}
              </CardTitle>
              <p className="text-slate-300">{freeAccessRecord.inmate.full_name}</p>
              <Badge className="bg-emerald-600 w-fit mt-2">Free Access</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {freeAccessRecord.phoneRecord && (recordFilter === 'all' || recordFilter === 'telephone') && (
                <PhoneRecordDisplay
                  record={freeAccessRecord.phoneRecord}
                  isUnlocked={true}
                  fulfillmentStatus="fulfilled"
                  availableDate={freeAccessRecord.inmate.phone_records_available_date}
                  docNumber={freeAccessRecord.inmate.doc_number}
                  inmateName={freeAccessRecord.inmate.full_name}
                />
              )}
              {freeAccessRecord.visitorRecord && (recordFilter === 'all' || recordFilter === 'visitor') && (
                <VisitorRecordDisplay
                  record={freeAccessRecord.visitorRecord}
                  isUnlocked={true}
                  fulfillmentStatus="fulfilled"
                  availableDate={freeAccessRecord.inmate.visitor_records_available_date}
                  docNumber={freeAccessRecord.inmate.doc_number}
                  inmateName={freeAccessRecord.inmate.full_name}
                />
              )}
            </CardContent>
          </Card>
        )}

        {!loading && !error && !freeAccessRecord && orders.length === 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <ShoppingBag className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-white text-xl font-semibold mb-2">No Orders Yet</h3>
              <p className="text-slate-400 mb-6">
                You haven't purchased any records yet. Start by searching for an inmate.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-[#00063d] hover:bg-[#0a1854]"
              >
                Start Searching
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && orders.length > 0 && (() => {
          const filteredOrders = recordFilter === 'all'
            ? orders
            : orders.filter(o => o.record_types.includes(recordFilter));

          return filteredOrders.length > 0 ? (
            <div>
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} filter={recordFilter} />
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="py-12 text-center">
                <ShoppingBag className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  No {recordFilter === 'telephone' ? 'Phone' : 'Visitor'} Records
                </h3>
                <p className="text-slate-400 mb-6">
                  You haven't purchased any {recordFilter === 'telephone' ? 'phone' : 'visitor'} records yet.
                </p>
                <Button
                  onClick={() => setRecordFilter('all')}
                  className="bg-[#00063d] hover:bg-[#0a1854]"
                >
                  View All Records
                </Button>
              </CardContent>
            </Card>
          );
        })()}
      </div>
      <Footer />
    </div>
  );
};

export default MyRecords;
