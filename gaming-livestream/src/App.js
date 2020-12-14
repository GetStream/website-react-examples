import './App.scss';
import React, { useState } from 'react';
import { GamingHeader } from './components/GamingHeader/GamingHeader';
import { GamingVideo } from './components/GamingVideo/GamingVideo';
import { GamingFooter } from './components/GamingFooter/GamingFooter';
import { GamingChat } from './components/GamingChat/GamingChat';

const App = () => {
  const [showMembers, setShowMembers] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
              <button
                onClick={() => {
                  setIsFullScreen(false);
                }}
              ></button>
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
        />
      </div>
    </main>
  );
};

export default App;
