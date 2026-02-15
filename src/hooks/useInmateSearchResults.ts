
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/contexts/AppStateContext';

interface SearchResult {
  name: string;
  docNumber: string;
  location: string;
  status: string;
  age?: string;
  vineLink?: string;
}

export const useInmateSearchResults = () => {
  const { toast } = useToast();
  const { updateSearchResults } = useAppState();

  const searchInmates = async (query: string, state: string): Promise<boolean> => {
    if (!query || !state) {
      updateSearchResults([], false, null);
      return false;
    }

    // Check if query looks like a name (contains space or comma) or DOC number
    const isNameSearch = query.includes(' ') || query.includes(',');
    const docNumberPattern = /^[0-9]{3,8}$/;

    if (!isNameSearch && !docNumberPattern.test(query.trim())) {
      const errorMsg = 'Please enter a valid DOC number (3-8 digits) or a full name';
      updateSearchResults([], false, errorMsg);
      return false;
    }

    if (isNameSearch && query.trim().length < 3) {
      const errorMsg = 'Please enter a full name with at least 3 characters';
      updateSearchResults([], false, errorMsg);
      return false;
    }

    updateSearchResults([], true, null);

    const searchType = isNameSearch ? 'name' : 'DOC number';

    toast({
      title: "Searching...",
      description: `Searching ${state} records by ${searchType}: ${query}`,
      duration: 2000,
    });
    
    try {
      const response = await fetch(`https://prisonserver.vercel.app/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query.trim(),
          isNameSearch,
          searchType
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        throw new Error('Server returned invalid JSON response');
      }

      if (data?.error) {
        console.error('🚨 Data error from API:', data.error);
        throw new Error(data.error);
      }

      // Transform the API response to match our SearchResult interface
      const searchResults = data?.results?.map((item: any) => ({
        id: `wa-${item.docNumber}`,
        name: item.name || 'Unknown',
        docNumber: item.docNumber || query,
        location: item.location || 'Unknown',
        status: 'In Custody',
        age: item.age,
        vineLink: item.vineLink
      })) || [];

      updateSearchResults(searchResults, false, null);

      if (searchResults.length === 0) {
        toast({
          title: "No Results Found",
          description: `No records found for ${searchType} ${query} in ${state}`,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Search Successful",
          description: `Found ${searchResults.length} record(s) for ${searchType} ${query}`,
          duration: 3000,
        });
      }

      return true;
    } catch (error: any) {
      console.error('🚨 Search failed with error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause
      });
      
      const errorMessage = error.message || 'Unknown error occurred';
      updateSearchResults([], false, `Search failed: ${errorMessage}`);
      
      toast({
        title: "Search Failed",
        description: `Error: ${errorMessage}`,
        variant: "destructive",
        duration: 3000,
      });

      return false;
    }
  };

  return {
    searchInmates
  };
};
