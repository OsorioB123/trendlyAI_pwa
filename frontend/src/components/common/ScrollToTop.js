import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Force scroll to top using multiple methods
      window.scrollTo(0, 0);
      
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Immediate scroll
    scrollToTop();

    // Use requestAnimationFrame to ensure it happens after render
    requestAnimationFrame(() => {
      scrollToTop();
    });

    // Additional timeout as fallback
    const timer = setTimeout(() => {
      scrollToTop();
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Additional effect to handle route changes more aggressively
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
};

export default ScrollToTop;