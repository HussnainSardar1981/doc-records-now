
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
    <div className="min-h-screen bg-gradient-to-b from-[#000B2E] via-[#001855] to-[#000B2E] flex flex-col relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500 rounded-full opacity-[0.04] blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-purple-500 rounded-full opacity-[0.04] blur-3xl pointer-events-none" />

      <Header selectedState={state.selectedState} />

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl flex-1 animate-fadeIn relative z-10">
        <Alert className="mb-6 bg-blue-500/10 border-blue-500/20">
          <Info className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-300">
            <strong className="text-blue-400/80">Washington State DOC</strong> records available now. More states coming soon.
          </AlertDescription>
        </Alert>

        <InmateSearch />
      </div>

      <Footer />
    </div>
  );
};

export default Index;
