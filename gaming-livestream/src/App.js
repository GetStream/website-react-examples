import React, { useEffect, useState } from 'react';

import './App.scss';

import { ChatUpgrades } from './components/ChatUpgrades/ChatUpgrades';
import { GamingHeader } from './components/GamingHeader/GamingHeader';
import { GamingVideo } from './components/GamingVideo/GamingVideo';
import { GamingFooter } from './components/GamingFooter/GamingFooter';
import { GamingChat } from './components/GamingChat/GamingChat';
import { GamingChatPopUp } from './components/GamingChat/GamingChatPopUp';

const App = () => {
  const [showMembers, setShowMembers] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpText, setPopUpText] = useState('');

  useEffect(() => {
    const popUpTimer = () => {
      setTimeout(() => {
        setShowPopUp(false);
        setPopUpText('');
      }, 3000);
    };
    if (showPopUp) popUpTimer();
  }, [showPopUp]);

  return (
    <main>
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
            </div>
          </div>
          <GamingVideo isFullScreen={isFullScreen} />
          {showPopUp && <GamingChatPopUp text={popUpText} />}
          <GamingFooter showMembers={showMembers} isFullScreen={isFullScreen} />
        </div>
        <GamingChat
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
          setShowMembers={setShowMembers}
          setShowUpgrade={setShowUpgrade}
          showMembers={showMembers}
          showUpgrade={showUpgrade}
        />
        {showUpgrade && <ChatUpgrades {...{ setPopUpText, setShowPopUp, setShowUpgrade }} />}
      </div>
    </main>
  );
};

export default App;
