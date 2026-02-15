
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchResults from '@/components/SearchResults';
import { useAppState } from '@/contexts/AppStateContext';

const Results = () => {
  const { state } = useAppState();
  const navigate = useNavigate();

  // If no search has been performed, redirect to home
  if (!state.searchQuery && !state.searchLoading && state.searchResults.length === 0) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000B2E] via-[#001855] to-[#000B2E] flex flex-col relative overflow-hidden">
      <Header selectedState={state.selectedState} />

      <div className="mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 md:py-6 max-w-5xl w-full flex-1 animate-fadeIn">
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
