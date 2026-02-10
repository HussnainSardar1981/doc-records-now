import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/utils/pixelTracking';

const PixelRouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  return null;
};

export default PixelRouteTracker;
