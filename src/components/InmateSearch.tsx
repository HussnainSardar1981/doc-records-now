
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import SearchButton from './SearchButton';
import SearchResults from './SearchResults';
import { useInmateSearchResults } from '@/hooks/useInmateSearchResults';
import { useAppState } from '@/contexts/AppStateContext';
import { trackSearch } from '@/utils/pixelTracking';

const InmateSearch = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchType, setSearchType] = useState<'doc' | 'name'>('doc');

  const { searchInmates } = useInmateSearchResults();
  const { state, updateSearchState, updateSearchResults, clearSearchResults } = useAppState();

  const handleDocNumberChange = (value: string) => {
    updateSearchState({ searchQuery: value, inmateId: value });
    setSearchType('doc');

    if (!value) {
      clearSearchResults();
    }
  };

  const handleNameChange = (first: string, last: string) => {
    setFirstName(first);
    setLastName(last);

    const nameQuery = last && first ? `${last}, ${first}` : `${first} ${last}`.trim();
    updateSearchState({ searchQuery: nameQuery, inmateId: nameQuery });
    setSearchType('name');

    if (!nameQuery) {
      clearSearchResults();
    }
  };

  const handleSearch = () => {
    if (state.selectedState && state.searchQuery) {
      trackSearch(state.searchQuery);
      searchInmates(state.searchQuery, state.selectedState);
    }
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setSearchType('doc');
    updateSearchState({ searchQuery: '', inmateId: '' });
    clearSearchResults();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !state.searchLoading) {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/40 border-slate-600/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-xl flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Inmate
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* DOC Number Search */}
          <div>
            <Input
              value={searchType === 'doc' ? state.searchQuery : ''}
              onChange={(e) => handleDocNumberChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="DOC Number (e.g., 885671)"
              className="bg-slate-700/50 border-slate-500 text-white placeholder:text-slate-300"
              disabled={state.searchLoading}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-500"></div>
            <span className="text-slate-300 text-xs">OR</span>
            <div className="flex-1 h-px bg-slate-500"></div>
          </div>

          {/* Name Search */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={firstName}
              onChange={(e) => handleNameChange(e.target.value, lastName)}
              onKeyDown={handleKeyDown}
              placeholder="First Name"
              className="bg-slate-700/50 border-slate-500 text-white placeholder:text-slate-300"
              disabled={state.searchLoading}
            />
            <Input
              value={lastName}
              onChange={(e) => handleNameChange(firstName, e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Last Name"
              className="bg-slate-700/50 border-slate-500 text-white placeholder:text-slate-300"
              disabled={state.searchLoading}
            />
          </div>

          <SearchButton
            selectedState={state.selectedState}
            searchQuery={state.searchQuery}
            onSearch={handleSearch}
            loading={state.searchLoading}
          />
        </CardContent>
      </Card>

      <SearchResults
        results={state.searchResults}
        loading={state.searchLoading}
        error={state.searchError}
        query={state.searchQuery}
        selectedState={state.selectedState}
      />
    </div>
  );
};

export default InmateSearch;
