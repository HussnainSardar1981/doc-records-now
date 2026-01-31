
export interface SearchState {
  inmateId: string;
  searchQuery: string;
  selectedState: string | null;
}

export interface OrderState {
  selectedRecords: string[];
  paymentMethod: string;
}

export interface SearchActions {
  setInmateId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedState: (state: string | null) => void;
  handleStateSelect: (state: string) => void;
}

export interface OrderActions {
  toggleRecordSelection: (recordId: string) => void;
  setPaymentMethod: (method: string) => void;
  handleOrder: () => void;
}
