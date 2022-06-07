import { useEffect, useState } from 'react';

/**
 * Internal, handles the communication between Stream's website related to UI theme toggling.
 *
 * @param targetOrigin the target origin (typically, the https://getstream.io/ domain).
 */
export const useTheme = (targetOrigin: string) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  useEffect(() => {
    const handleThemeChange = ({ data, origin }: MessageEvent<'light' | 'dark'>) => {
      // handle events only from trusted origin
      if (origin === targetOrigin && (data === 'light' || data === 'dark')) {
        setTheme(data);
      }
    };

    window.addEventListener('message', handleThemeChange);
    return () => {
      window.removeEventListener('message', handleThemeChange);
    };
  }, [targetOrigin]);

  return theme;
};
