
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchResults from '@/components/SearchResults';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';

const Results = () => {
  const { state } = useAppState();
  const navigate = useNavigate();

  // If no search has been performed, redirect to home
  if (!state.searchQuery && !state.searchLoading && state.searchResults.length === 0) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00063d] to-[#0a1854] flex flex-col">
      <Header selectedState={state.selectedState} />

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl flex-1 animate-fadeIn">
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white hover:bg-slate-700/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Search
          </Button>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Search className="w-4 h-4" />
            <span>Results for: <span className="text-white font-medium">{state.searchQuery}</span></span>
          </div>
        </div>

        <SearchResults
          results={state.searchResults}
          loading={state.searchLoading}
          error={state.searchError}
          query={state.searchQuery}
          selectedState={state.selectedState}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Results;
