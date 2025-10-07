import React, { useEffect } from 'react';

interface GlobalFooterProps {
  globalCode?: string;
}

export function GlobalFooter({ globalCode }: GlobalFooterProps) {
  useEffect(() => {
    if (globalCode) {
      // Create a script element for global code
      const script = document.createElement('script');
      script.textContent = globalCode;
      
      // Append to document body (footer scripts typically go here)
      document.body.appendChild(script);
      
      // Cleanup function to remove the script when component unmounts
      return () => {
        try {
          document.body.removeChild(script);
        } catch (e) {
          // Script might have already been removed
          console.log('Script cleanup: script already removed');
        }
      };
    }
  }, [globalCode]);

  return null; // This component doesn't render anything visible
}