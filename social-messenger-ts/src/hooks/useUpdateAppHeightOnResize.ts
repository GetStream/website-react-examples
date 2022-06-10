import { useEffect } from 'react';

/**
 * Internal, updates CSS variable with the current window height
 * upon window resize event.
 */
export const useUpdateAppHeightOnResize = () => {
  useEffect(() => {
    /*
     * Get the actual rendered window height to set the container size properly.
     * In some browsers (like Safari) the nav bar can override the app.
     */
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    setAppHeight();

    window.addEventListener('resize', setAppHeight);
    return () => {
      window.removeEventListener('resize', setAppHeight);
    };
  }, []);
};
