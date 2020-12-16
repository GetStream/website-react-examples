import React, { useState } from 'react';

import './App.scss';

import { GamingHeader } from './components/GamingHeader/GamingHeader';
import { GamingVideo } from './components/GamingVideo/GamingVideo';
import { GamingFooter } from './components/GamingFooter/GamingFooter';
import { GamingChat } from './components/GamingChat/GamingChat';

import InfiniteIcon from './assets/icons/InfiniteIcon';
import MemberIcon from './assets/icons/MemberIcon';
import BellIcon from './assets/icons/BellIcon';
import HandIcon from './assets/icons/HandIcon';

const App = () => {
  const [showMembers, setShowMembers] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const [upgrades] = useState([
    { name: 'Unlimited Karma', description: 'Subscribe for $3 / month', active: true, img: 'infinite' },
    { name: 'Karma +10', description: 'Activate mobile notifications', active: false, img: 'bell' },
    { name: 'Karma +10', description: 'Allow livestream in AdBlock', active: false, img: 'hand' },
    { name: 'Karma +10', description: 'Be a member for 100 days', active: false, img: 'member' },
  ]);

  const getImage = (type) => {
    switch (type) {
      case 'infinite':
        return <InfiniteIcon />;
      case 'bell':
        return <BellIcon />;
      case 'hand':
        return <HandIcon />;
      case 'member':
        return <MemberIcon />;

      default:
        break;
    }
  };

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
          showUpgrade={showUpgrade}
          setShowUpgrade={setShowUpgrade}
        />
        {showUpgrade && (
          <div className='upgrade-container'>
            <div className='upgrade-header'>
              <button
                onClick={() => {
                  setShowUpgrade(false);
                }}
              ></button>
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
