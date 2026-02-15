
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
    <div className="min-h-screen bg-gradient-to-br from-[#00063d] to-[#0a1854] flex flex-col">
      <Header selectedState={state.selectedState} />

      <div className="container mx-auto px-4 md:px-6 py-6 max-w-4xl flex-1 animate-fadeIn">
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
