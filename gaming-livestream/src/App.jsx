import './App.scss';
import React, { useState } from 'react';
import Header from './components/header';
import Video from './components/video';
import ChatBox from './components/chat';
import Footer from './components/footer';


const App = () => {
  const [showMembers, setShowMembers] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  return <main className="App">
    <div className="live-stream">
      <div className={`separator ${showMembers ? 'show-members' : ''}`}>
        <div className="header-container">
          <Header showMembers={showMembers} setShowMembers={setShowMembers} isFullScreen={isFullScreen} className={`sub-header ${isFullScreen ? 'full-screen' : ''}`} />
          <div className={`sub-header ${isFullScreen ? 'show' : 'hide'}`}>
            <button onClick={() => {
              setIsFullScreen(false);
            }}></button>
            <p>Live Chat</p>
            <div></div>
          </div>
        </div>
        <Video isFullScreen={isFullScreen} />
        <Footer showMembers={showMembers} isFullScreen={isFullScreen} />
      </div>
      <ChatBox showMembers={showMembers} setShowMembers={setShowMembers} isFullScreen={isFullScreen} setIsFullScreen={setIsFullScreen} />
    </div>
  </main>;
};

export default App;
