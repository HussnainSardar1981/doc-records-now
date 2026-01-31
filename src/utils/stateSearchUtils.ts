
import { stateUrls, StateUrlData } from '@/data/stateUrls';
import { SEARCH_VALIDATION } from '@/constants';

export interface SearchResult {
  url: string | null;
  status: 'active' | 'limited' | 'unavailable';
}

export const getStateSearchUrl = (state: string, query: string): SearchResult => {
  const isDocNumber = SEARCH_VALIDATION.docNumberPattern.test(query.trim());
  const cleanQuery = query.trim();
  
  const stateData = stateUrls[state];
  if (!stateData) {
    console.warn(`State data not found for: ${state}`);
    return { url: null, status: 'unavailable' };
  }

  // Handle Washington state DOC number search
  if (state === 'Washington' && cleanQuery && isDocNumber && stateData.docSearch) {
    return { url: stateData.docSearch + cleanQuery, status: stateData.status };
  }
  
  // Handle Ohio state DOC number search
  if (state === 'Ohio' && cleanQuery && isDocNumber && stateData.docSearch) {
    return { url: stateData.docSearch + cleanQuery, status: stateData.status };
  }
  
  return { url: stateData.general, status: stateData.status };
};

export const getSearchButtonText = (selectedState: string | null, searchQuery: string): string => {
  if (!selectedState) return "Select State First";
  const result = getStateSearchUrl(selectedState, searchQuery);
  if (result.status === 'unavailable') return "Search Unavailable";
  if (result.status === 'limited') return "Limited Search";
  return "Search Records";
};
