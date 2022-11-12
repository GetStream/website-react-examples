import React from 'react';

import ControllerIcon from '../../assets/icons/ControllerIcon';
import HeartFullIcon from '../../assets/icons/HeartFullIcon';
import LiveIcon from '../../assets/icons/LiveIcon';
import PeopleIcon from '../../assets/icons/PeopleIcon';
import SubscribeFullIcon from '../../assets/icons/SubscribeFullIcon';
import WatcherIcon from '../../assets/icons/WatcherIcon';

import { useLayoutController } from '../../context/LayoutController';
import { ChatIcon } from '../../assets/icons/ChatIcon';

export const GamingHeader = () => {
  const {memberListVisible, chatVisible, toggleFullScreen} = useLayoutController();

  return (
    <div className='header-container'>
      <header
        className={`${memberListVisible ? 'show-members' : ''} ${chatVisible}`}
      >
        <div className='stream-details'>
          <LiveIcon />
          <div className='info'>
            <p>2200+ Wins, #1 Warzone Battle Royale All Platforms Wins</p>
            <div className='info-separator'>
              <div>
                <ControllerIcon />
                <p>Overwatch</p>
              </div>
              <div>
                <PeopleIcon />
                <p>Corsairs</p>
              </div>
            </div>
          </div>
        </div>
        {
          <div className='stream-involvement'>
            <div
              className={`watchers-container ${
                !chatVisible && memberListVisible ? 'shrink' : 'grow'
              }`}
            >
              <WatcherIcon />
              <p className='title-text'>458K</p>
            </div>
            <div
              className={`follows-container ${
                !chatVisible && memberListVisible ? 'shrink' : 'grow'
              }`}
            >
              <HeartFullIcon />
              <p className='title-text'>1.2K</p>
            </div>
            <div
              className={`subs-container ${
                !chatVisible && memberListVisible ? 'shrink' : 'grow'
              }`}
            >
              <SubscribeFullIcon />
              <p className='title-text'>250</p>
            </div>
          </div>
        }
      </header>
      <div className={`sub-header ${['chat-visible', ''].includes(chatVisible) ? 'hide' : 'show' }`}>
        <button onClick={toggleFullScreen} title='Open Chat'><ChatIcon/></button>
      </div>
    </div>
  );
};
