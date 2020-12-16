import React from 'react';

import './GamingHeader.scss';

import LiveIcon from '../../assets/icons/LiveIcon';
import ControllerIcon from '../../assets/icons/ControllerIcon';
import PeopleIcon from '../../assets/icons/PeopleIcon';
import WatcherIcon from '../../assets/icons/WatcherIcon';
import FollowersIcon from '../../assets/icons/FollowersIcon';
import SubIcon from '../../assets/icons/SubsIcon';

export const GamingHeader = (props) => {
  return (
    <header className={`${props.showMembers ? 'show-members' : ''} ${props.isFullScreen ? 'full-screen' : ''}`}>
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
      <div className='stream-involvement'>
        <div className={`watchers-container ${!props.isFullScreen && props.showMembers ? 'shrink' : 'grow'}`}>
          <WatcherIcon />
          <p className='title-text'>458K</p>
        </div>
        <div className={`follows-container ${!props.isFullScreen && props.showMembers ? 'shrink' : 'grow'}`}>
          <FollowersIcon />
          <p className='title-text'>1.2K</p>
        </div>
        <div className={`subs-container ${!props.isFullScreen && props.showMembers ? 'shrink' : 'grow'}`}>
          <SubIcon style={{ color: '#ffe500' }} />
          <p className='title-text'>250</p>
        </div>
      </div>
    </header>
  );
};
