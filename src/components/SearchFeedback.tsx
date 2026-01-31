
import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface SearchFeedbackProps {
  selectedState: string | null;
}

const SearchFeedback = ({ selectedState }: SearchFeedbackProps) => {
  if (!selectedState) {
    return (
      <div className="flex items-center gap-2 text-amber-400 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        Please select a state first to enable search functionality
      </div>
    );
  }

  if (selectedState !== 'Washington') {
    return (
      <div className="flex items-center gap-2 text-amber-400 text-sm mt-1">
        <AlertCircle className="w-4 h-4" />
        Search is currently only available for Washington state
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
      <CheckCircle className="w-4 h-4" />
      Ready to search Washington inmate records
    </div>
  );
};

export default SearchFeedback;
