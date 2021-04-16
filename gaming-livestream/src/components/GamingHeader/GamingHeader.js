import React from 'react';

import './GamingHeader.scss';

import ControllerIcon from '../../assets/icons/ControllerIcon';
import HeartFullIcon from '../../assets/icons/HeartFullIcon';
import LiveIcon from '../../assets/icons/LiveIcon';
import PeopleIcon from '../../assets/icons/PeopleIcon';
import SubscribeFullIcon from '../../assets/icons/SubscribeFullIcon';
import WatcherIcon from '../../assets/icons/WatcherIcon';

export const GamingHeader = (props) => (
  <header
    className={`${props.showMembers ? 'show-members' : ''} ${
      props.isFullScreen ? 'full-screen' : ''
    }`}
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
            !props.isFullScreen && props.showMembers ? 'shrink' : 'grow'
          }`}
        >
          <WatcherIcon />
          <p className='title-text'>458K</p>
        </div>
        <div
          className={`follows-container ${
            !props.isFullScreen && props.showMembers ? 'shrink' : 'grow'
          }`}
        >
          <HeartFullIcon />
          <p className='title-text'>1.2K</p>
        </div>
        <div
          className={`subs-container ${
            !props.isFullScreen && props.showMembers ? 'shrink' : 'grow'
          }`}
        >
          <SubscribeFullIcon />
          <p className='title-text'>250</p>
        </div>
      </div>
    }
  </header>
);
