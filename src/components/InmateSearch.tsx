
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import SearchButton from './SearchButton';
import { useInmateSearchResults } from '@/hooks/useInmateSearchResults';
import { useAppState } from '@/contexts/AppStateContext';
import { trackSearch } from '@/utils/pixelTracking';

const InmateSearch = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [searchType, setSearchType] = useState<'doc' | 'name'>('doc');
  const navigate = useNavigate();

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

  const handleSearch = async () => {
    if (state.selectedState && state.searchQuery) {
      trackSearch(state.searchQuery);
      navigate('/results');
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
    <Card className="bg-gradient-to-br from-white/5 to-white/10 border-white/20 transition-all duration-300">
      <CardHeader className="pb-3 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
        <CardTitle className="text-white text-xl flex items-center gap-2">
          <div className="bg-blue-500/20 p-1.5 rounded-lg">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          Search Inmate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-5 px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
        {/* DOC Number Search */}
        <div>
          <Input
            value={searchType === 'doc' ? state.searchQuery : ''}
            onChange={(e) => handleDocNumberChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="DOC Number (e.g., 885671)"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
            disabled={state.searchLoading}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-400 text-xs">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Name Search */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            value={firstName}
            onChange={(e) => handleNameChange(e.target.value, lastName)}
            onKeyDown={handleKeyDown}
            placeholder="First Name"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
            disabled={state.searchLoading}
          />
          <Input
            value={lastName}
            onChange={(e) => handleNameChange(firstName, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Last Name"
            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
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
  );
};

export default InmateSearch;
