import { useEffect, useState } from 'react';

export type ThemeClassName = 'str-chat__theme-light' | 'str-chat__theme-dark';
export type Theme = 'light' | 'dark';

const SUPPORTED_THEMES: Record<Theme, ThemeClassName> = {
  'light': 'str-chat__theme-light',
  'dark': 'str-chat__theme-dark'
} as const;

/**
 * Internal, handles the communication between Stream's website related to UI theme toggling.
 *
 * @param targetOrigin the target origin (typically, the https://getstream.io/ domain).
 */
export const useTheme = (targetOrigin: string) => {
  const [theme, setTheme] = useState<ThemeClassName>('str-chat__theme-dark');
  useEffect(() => {
    const handleThemeChange = ({ data: theme, origin }: MessageEvent<Theme>) => {
      // handle events only from trusted origin
      if (origin === targetOrigin && Object.keys(SUPPORTED_THEMES).includes(theme)) {
        setTheme(SUPPORTED_THEMES[theme] || SUPPORTED_THEMES.light);
      }
    };

    window.addEventListener('message', handleThemeChange);
    return () => {
      window.removeEventListener('message', handleThemeChange);
    };
  }, [targetOrigin]);

  return theme;
};
