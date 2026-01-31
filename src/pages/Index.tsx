
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InmateSearch from '@/components/InmateSearch';
import { useAppState } from '@/contexts/AppStateContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Index = () => {
  const { state } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex flex-col">
      <Header selectedState={state.selectedState} />

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl flex-1">
        <Alert className="mb-6 bg-blue-900/30 border-blue-500/50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-blue-200">
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
