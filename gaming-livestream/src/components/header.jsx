import React, { } from 'react';
import '../styles/header.scss'
import { ReactComponent as LiveSvg } from '../assets/icons/live.svg';
import { ReactComponent as ControllerSvg } from '../assets/icons/controller.svg';
import { ReactComponent as PeopleSvg } from '../assets/icons/people.svg';

import { ReactComponent as WatchersSvg } from '../assets/icons/watcher.svg';
import { ReactComponent as FollowersSvg } from '../assets/icons/followers.svg';
import { ReactComponent as SubsSvg } from '../assets/icons/subs.svg';

const Header = props => {

  return (
    <header className={`${props.showMembers ? 'show-members' : ''} ${props.isFullScreen ? 'full-screen' : ''}`}>
      <div className="stream-details">
        <LiveSvg style={{ height: "3rem" }} />
        <div className="info">
          <p>2200+ Wins, #1 Warzone Battle Royale All Platforms Wins</p>
          <div className="info-separator">
            <div>
              <ControllerSvg />
              <p>Overwatch</p>
            </div>
            <div>
              <PeopleSvg />
              <p>Corsairs</p>
            </div>
          </div>
        </div>
      </div>
      <div className="stream-involvement">
        <div className={`watchers-container ${!props.isFullScreen && props.showMembers ? 'shrink' : 'grow'}`}>
          <WatchersSvg />
          <p className='title-text' >458K</p>
        </div>
        <div className={`follows-container ${!props.isFullScreen && props.showMembers ? 'shrink' : 'grow'}`}>
          <FollowersSvg />
          <p className='title-text'>1.2K</p>
        </div>
        <div className={`subs-container ${!props.isFullScreen && props.showMembers ? 'shrink' : 'grow'}`}>
          <SubsSvg style={{ color: '#ffe500' }} />
          <p className='title-text'>250</p>
        </div>
      </div>
    </header>
  );
}

export default Header
