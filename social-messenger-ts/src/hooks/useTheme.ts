import { useEffect, useState } from 'react';

export type Theme = 'str-chat__theme-light' | 'str-chat__theme-dark';

const SUPPORTED_THEMES = [
  'str-chat__theme-light',
  'str-chat__theme-dark'
] as const;

/**
 * Internal, handles the communication between Stream's website related to UI theme toggling.
 *
 * @param targetOrigin the target origin (typically, the https://getstream.io/ domain).
 */
export const useTheme = (targetOrigin: string) => {
  const [theme, setTheme] = useState<Theme>('str-chat__theme-light');
  useEffect(() => {
    const handleThemeChange = ({ data: theme, origin }: MessageEvent<Theme>) => {
      // handle events only from trusted origin
      if (origin === targetOrigin && SUPPORTED_THEMES.includes(theme)) {
        setTheme(theme);
      }
    };

    window.addEventListener('message', handleThemeChange);
    return () => {
      window.removeEventListener('message', handleThemeChange);
    };
  }, [targetOrigin]);

  return theme;
};
