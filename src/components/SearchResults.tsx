
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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

  if (!query || results.length === 0) {
    return null;
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
