
export const RECORD_PRICES = {
  telephone: 29.99,
  visitor: 29.99,
  feedback: 0
} as const;

export const PROCESSING_TIMES = {
  telephone: '3-5 business days',
  visitor: '2-4 business days',
  feedback: 'Immediate'
} as const;

export const TOAST_MESSAGES = {
  stateRequired: {
    title: "State Required",
    description: "Please select a state first to perform the search.",
    variant: "destructive" as const
  },
  searchUnavailable: {
    title: "Search Unavailable",
    description: "Online inmate search is not available for this state. Please contact the state DOC directly.",
    variant: "destructive" as const
  },
  limitedSearch: {
    title: "Limited Search Capability",
    description: "This state has limited online search functionality. You may need to search manually on their website.",
    variant: "default" as const
  },
  searchError: {
    title: "Search Error",
    description: "Unable to open the search page. Please try again or visit the state DOC website directly.",
    variant: "destructive" as const
  },
  inmateIdRequired: {
    title: "Inmate ID Required",
    description: "Please enter a valid inmate ID number.",
    variant: "destructive" as const
  },
  noRecordsSelected: {
    title: "No Records Selected",
    description: "Please select at least one record type to order.",
    variant: "destructive" as const
  }
} as const;

export const SEARCH_VALIDATION = {
  docNumberPattern: /^\d+$/
} as const;
