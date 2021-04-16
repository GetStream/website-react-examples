import React from 'react';
import './LiveEventWindowControls.css';

export const LiveEventWindowControls = ({ currentTheme, setCurrentTheme }) => {
  return (
    <div className='window-controls-container'>
      <div className='window-controls-slider'>
        <div
          onClick={() => setCurrentTheme('light')}
          className={
            currentTheme === 'light' ? 'window-controls-selected' : 'window-controls-unselected'
          }
        >
          LIGHT UI
        </div>
        <div
          onClick={() => setCurrentTheme('dark')}
          className={
            currentTheme === 'dark' ? 'window-controls-selected' : 'window-controls-unselected'
          }
        >
          DARK UI
        </div>
      </div>
    </div>
  );
};
