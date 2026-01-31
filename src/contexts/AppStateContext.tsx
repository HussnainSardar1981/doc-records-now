
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface SearchResult {
  name: string;
  docNumber: string;
  location: string;
  status: string;
  age?: string;
  vineLink?: string;
}

interface AppState {
  // Search state
  selectedState: string | null;
  searchQuery: string;
  inmateId: string;
  searchResults: SearchResult[];
  searchLoading: boolean;
  searchError: string | null;
  
  // Order state
  selectedRecords: string[];
  paymentMethod: string;
}

interface AppStateContextType {
  state: AppState;
  updateSearchState: (updates: Partial<Pick<AppState, 'selectedState' | 'searchQuery' | 'inmateId'>>) => void;
  updateSearchResults: (results: SearchResult[], loading: boolean, error: string | null) => void;
  updateOrderState: (updates: Partial<Pick<AppState, 'selectedRecords' | 'paymentMethod'>>) => void;
  toggleRecordSelection: (recordId: string) => void;
  clearSearchResults: () => void;
  saveStateBeforeLogin: () => void;
  restoreStateAfterLogin: () => void;
}

const defaultState: AppState = {
  selectedState: 'Washington',
  searchQuery: '',
  inmateId: '',
  searchResults: [],
  searchLoading: false,
  searchError: null,
  selectedRecords: [],
  paymentMethod: 'stripe'
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>(defaultState);
  const { user } = useAuth();

  const updateSearchState = (updates: Partial<Pick<AppState, 'selectedState' | 'searchQuery' | 'inmateId'>>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const updateSearchResults = (results: SearchResult[], loading: boolean, error: string | null) => {
    setState(prev => ({
      ...prev,
      searchResults: results,
      searchLoading: loading,
      searchError: error
    }));
  };

  const updateOrderState = (updates: Partial<Pick<AppState, 'selectedRecords' | 'paymentMethod'>>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleRecordSelection = (recordId: string) => {
    setState(prev => ({
      ...prev,
      selectedRecords: prev.selectedRecords.includes(recordId)
        ? prev.selectedRecords.filter(id => id !== recordId)
        : [...prev.selectedRecords, recordId]
    }));
  };

  const clearSearchResults = () => {
    setState(prev => ({
      ...prev,
      searchResults: [],
      searchLoading: false,
      searchError: null
    }));
  };

  const saveStateBeforeLogin = () => {
    const stateToSave = {
      ...state,
      timestamp: Date.now()
    };
    localStorage.setItem('appState', JSON.stringify(stateToSave));
    console.log('App state saved before login:', stateToSave);
  };

  const restoreStateAfterLogin = () => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only restore if the saved state is recent (within 1 hour)
        if (Date.now() - parsed.timestamp < 3600000) {
          const { timestamp, ...restoreState } = parsed;
          setState(restoreState);
          console.log('App state restored after login:', restoreState);
        }
        // Clean up the saved state
        localStorage.removeItem('appState');
      } catch (error) {
        console.error('Failed to restore app state:', error);
        localStorage.removeItem('appState');
      }
    }
  };

  // Auto-restore state when user logs in
  useEffect(() => {
    if (user) {
      restoreStateAfterLogin();
    }
  }, [user]);

  const value: AppStateContextType = {
    state,
    updateSearchState,
    updateSearchResults,
    updateOrderState,
    toggleRecordSelection,
    clearSearchResults,
    saveStateBeforeLogin,
    restoreStateAfterLogin
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
