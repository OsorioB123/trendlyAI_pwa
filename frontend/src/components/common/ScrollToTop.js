import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Multiple approaches to ensure scroll to top works
    const scrollToTop = () => {
      // Method 1: window.scrollTo with instant behavior
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });

      // Method 2: Direct property assignment as fallback
      window.scrollTo(0, 0);
      
      // Method 3: Document element scroll as fallback
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      // Method 4: Body scroll as fallback
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Immediate scroll
    scrollToTop();

    // Also scroll after a small delay to handle async loading
    const timer = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

export default ScrollToTop;