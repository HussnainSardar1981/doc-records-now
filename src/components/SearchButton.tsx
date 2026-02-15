
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchButtonProps {
  selectedState: string | null;
  searchQuery: string;
  onSearch: () => void;
  loading?: boolean;
}

const SearchButton = ({ selectedState, searchQuery, onSearch, loading = false }: SearchButtonProps) => {
  const { toast } = useToast();

  const handleSearch = () => {
    const isNameSearch = searchQuery.includes(' ') || searchQuery.includes(',');
    const docNumberPattern = /^[0-9]{3,8}$/;
    const sanitizedQuery = searchQuery.trim();

    if (!sanitizedQuery) {
      toast({
        title: "Enter DOC number or name",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!isNameSearch && !docNumberPattern.test(sanitizedQuery)) {
      toast({
        title: "Invalid DOC number",
        description: "Must be 3-8 digits",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (isNameSearch && sanitizedQuery.length < 3) {
      toast({
        title: "Name too short",
        description: "Enter full name",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    onSearch();
  };

  const isNameSearch = searchQuery.includes(' ') || searchQuery.includes(',');
  const docNumberPattern = /^[0-9]{3,8}$/;
  const sanitizedQuery = searchQuery.trim();
  const isValidQuery = sanitizedQuery && (
    (isNameSearch && sanitizedQuery.length >= 3) ||
    (!isNameSearch && docNumberPattern.test(sanitizedQuery))
  );

  return (
    <Button
      onClick={handleSearch}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-5 text-base transition-all duration-200 shadow shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30"
      disabled={!isValidQuery || loading}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Searching...
        </>
      ) : (
        <>
          <Search className="w-4 h-4 mr-2" />
          Search
        </>
      )}
    </Button>
  );
};

export default SearchButton;
