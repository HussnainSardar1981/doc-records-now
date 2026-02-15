
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, SearchX } from 'lucide-react';
import { LoadingCard } from './LoadingCard';
import { InmateRecordCard } from './InmateRecordCard';

interface SearchResult {
  name: string;
  docNumber: string;
  location: string;
  status: string;
  age?: string;
  vineLink?: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  query: string;
  selectedState: string | null;
}

const SearchResults = ({ results, loading, error, query, selectedState }: SearchResultsProps) => {
  if (loading) {
    return <LoadingCard rows={3} />;
  }

  if (error) {
    return (
      <Alert className="bg-red-500/10 border-red-500/20">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <AlertDescription className="text-red-300">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!query) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-white/5 p-4 rounded-full mb-4">
          <SearchX className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-white text-lg font-semibold mb-2">No Results Found</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-md">
          We couldn't find any records matching "<span className="text-white font-medium">{query}</span>" in {selectedState || 'the selected state'}.
        </p>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-w-md w-full text-left space-y-2">
          <p className="text-gray-300 text-sm font-medium mb-2">Try the following:</p>
          <ul className="text-gray-400 text-sm space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">-</span>
              Search by DOC number for exact matches
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">-</span>
              Double-check the spelling of the name
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">-</span>
              Try using just the last name
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">-</span>
              Verify the correct state is selected
            </li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result, index) => (
        <InmateRecordCard
          key={`${result.docNumber}-${index}`}
          name={result.name}
          docNumber={result.docNumber}
          location={result.location}
          status={result.status}
          age={result.age}
        />
      ))}
    </div>
  );
};

export default SearchResults;
