import { useEffect } from 'react';

import './WindowControls.css';

type Props = {
  theme: string;
  setTheme: (theme: string) => void;
};

const WindowControls = ({ theme, setTheme }: Props) => {
  const setDarkTheme = () => {
    if (theme === 'str-chat__theme-dark') return;
    setTheme('str-chat__theme-dark');
  };

  const lightClick = () => {
    if (theme === 'str-chat__theme-light') return;
    setTheme('str-chat__theme-light');
  };

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('#root');
    if (theme === 'str-chat__theme-light' && root) {
      root.style.background = '#333';
    } else if (root) {
      root.style.background = '#fff';
    }
  }, [theme]);

  return (
    <div className='window-controls__container'>
      <div className={`window-controls__button-wrapper ${theme}`}>
        <div
          className={`window-controls__button ${theme === 'str-chat__theme-dark' && 'selected'} ${theme}`}
          onClick={setDarkTheme}
        >
          DARK UI
        </div>
        <div
          className={`window-controls__button ${theme === 'str-chat__theme-light' && 'selected'} ${theme}`}
          onClick={lightClick}
        >
          LIGHT UI
        </div>
      </div>
    </div>
  );
};

export default WindowControls;
