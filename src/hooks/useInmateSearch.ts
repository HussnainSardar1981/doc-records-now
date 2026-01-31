
import { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';

export const useInmateSearch = () => {
  const [showStateDialog, setShowStateDialog] = useState(false);
  const { updateSearchState } = useAppState();

  const isStateAvailable = (state: string): boolean => {
    return state === 'Washington';
  };

  const handleStateSelect = (state: string) => {
    if (!isStateAvailable(state)) {
      setShowStateDialog(true);
      return;
    }
    
    updateSearchState({ selectedState: state });
    console.log(`Selected state: ${state}`);
  };

  return {
    isStateAvailable,
    showStateDialog,
    setShowStateDialog,
    handleStateSelect
  };
};
