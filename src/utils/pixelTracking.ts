declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    ttq: {
      page: () => void;
      track: (event: string, params?: Record<string, any>) => void;
    };
  }
}

export const trackPageView = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
  }
  if (typeof window.ttq?.page === 'function') {
    window.ttq.page();
  }
};

export const trackSignup = () => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'CompleteRegistration');
  }
  if (typeof window.ttq?.track === 'function') {
    window.ttq.track('CompleteRegistration');
  }
};

export const trackPurchase = (value?: number) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Purchase', {
      value: value || 0,
      currency: 'USD',
    });
  }
  if (typeof window.ttq?.track === 'function') {
    window.ttq.track('CompletePayment', {
      value: value || 0,
      currency: 'USD',
    });
  }
};

export const trackSearch = (searchTerm: string) => {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Search', { search_string: searchTerm });
  }
  if (typeof window.ttq?.track === 'function') {
    window.ttq.track('Search', { query: searchTerm });
  }
};
