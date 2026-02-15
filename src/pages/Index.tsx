
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InmateSearch from '@/components/InmateSearch';
import { useAppState } from '@/contexts/AppStateContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Shield, Clock, FileText } from 'lucide-react';

const Index = () => {
  const { state } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00063d] to-[#0a1854] flex flex-col">
      <Header selectedState={state.selectedState} />

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl flex-1 animate-fadeIn">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Access Washington State
            <span className="block text-blue-400">DOC Records Instantly</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Search inmate phone records and visitor logs from the Washington Department of Corrections. Fast, secure, and reliable.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>PDF Reports</span>
            </div>
          </div>
        </div>

        <Alert className="mb-6 bg-[#00063d]/40 border-slate-400/30">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-slate-200">
            <strong>Washington State DOC</strong> records available now. More states coming soon.
          </AlertDescription>
        </Alert>

        <InmateSearch />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
