import { useEffect } from 'react';

const useSecurity = () => {
  useEffect(() => {
    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac) - Console
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
         e.preventDefault();
         return false;
       }

      // Ctrl+Shift+C (Windows/Linux) or Cmd+Option+C (Mac) - Inspect
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
      }

      // Ctrl+U (Windows/Linux) or Cmd+Option+U (Mac) - View Source
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    };

    // Console Warning
    const consoleWarning = () => {
      console.log('%cSTOP!', 'color: red; font-size: 50px; font-weight: bold; text-shadow: 2px 2px black;');
      console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature or "hack" someone\'s account, it is a scam and will give them access to your account.', 'font-size: 18px; color: white; background: red; padding: 5px; border-radius: 5px;');
    };
    consoleWarning();

    // Prevent accidental reload
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; // Standard for Chrome/Firefox
      return ''; // Legacy
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

export default useSecurity;
