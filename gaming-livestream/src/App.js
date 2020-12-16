import React, { useState } from 'react';

import './App.scss';

import { GamingHeader } from './components/GamingHeader/GamingHeader';
import { GamingVideo } from './components/GamingVideo/GamingVideo';
import { GamingFooter } from './components/GamingFooter/GamingFooter';
import { GamingChat } from './components/GamingChat/GamingChat';

import { getImage, upgrades } from './assets/data';

const App = () => {
  const [showMembers, setShowMembers] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <main className='App'>
      <div className='live-stream'>
        <div className={`separator ${showMembers ? 'show-members' : ''}`}>
          <div className='header-container'>
            <GamingHeader
              showMembers={showMembers}
              setShowMembers={setShowMembers}
              isFullScreen={isFullScreen}
              className={`sub-header ${isFullScreen ? 'full-screen' : ''}`}
            />
            <div className={`sub-header ${isFullScreen ? 'show' : 'hide'}`}>
              <button onClick={() => setIsFullScreen(!isFullScreen)}></button>
              <p>Live Chat</p>
              <div></div>
            </div>
          </div>
          <GamingVideo isFullScreen={isFullScreen} />
          <GamingFooter showMembers={showMembers} isFullScreen={isFullScreen} />
        </div>
        <GamingChat
          showMembers={showMembers}
          setShowMembers={setShowMembers}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          showUpgrade={showUpgrade}
          setShowUpgrade={setShowUpgrade}
        />
        {showUpgrade && (
          <div className='upgrade-container'>
            <div className='upgrade-header'>
              <button onClick={() => setShowUpgrade(false)}></button>
              <p>Upgrade</p>
              <div></div>
            </div>
            <ul>
              {upgrades.map((option, i) => (
                <li key={i}>
                  {getImage(option.img)}
                  <div className='description-container'>
                    <p>{option.name}</p>
                    <p>{option.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button>Next</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
