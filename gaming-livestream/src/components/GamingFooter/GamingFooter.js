import React from 'react';
import './GamingFooter.scss';

import CheckIcon from '../../assets/icons/CheckIcon';
import ClockIcon from '../../assets/icons/ClockIcon';
import AlarmIcon from '../../assets/icons/AlarmIcon';
import FollowersIcon from '../../assets/icons/FollowersIcon';
import SubsIcon from '../../assets/icons/SubsIcon';
import UpVoteIcon from '../../assets/icons/UpVoteIcon';
import DownVoteIcon from '../../assets/icons/DownVoteIcon';

export const GamingFooter = (props) => {
  const showLastLi = () => {
    if (props.showMembers) {
      return null;
    }
    return <li>Shooter</li>;
  };

  return (
    <footer className={`${props.showMembers ? 'show-members' : ''} ${props.isFullScreen ? 'full-screen' : ''}`}>
      <div className='streamer-details-container'>
        <div className='streamer-details-separator'>
          <div className='avatar'></div>
          <div className='streamer-container'>
            <div className='streamer-name'>
              <p>PolarBear</p>
              <CheckIcon />
            </div>
            <ul className='streamer-details'>
              <li>English</li>
              <li>FPS</li>
              {showLastLi()}
            </ul>
          </div>
        </div>
      </div>
      <div className='user-interaction-container'>
        <div className='timer-container'>
          <div>
            <p>2:54:38</p>
            <ClockIcon />
          </div>
          <div>
            <p>-00:34:22</p>
            <AlarmIcon />
          </div>
        </div>
        <button className={`follow-btn ${!props.isFullScreen && props.showMembers ? 'shrink' : ''}`}>
          <div>
            <FollowersIcon />
            <p>Follow</p>
          </div>
        </button>
        <button className={`sub-btn ${!props.isFullScreen && props.showMembers ? 'shrink' : ''}`}>
          <div>
            <SubsIcon />
            <p>Subscribe</p>
          </div>
        </button>
        <div className='btn-group'>
          <button className={`${!props.isFullScreen && props.showMembers ? 'shrink' : ''}`}>
            <div>
              <UpVoteIcon />
              <p>325K</p>
            </div>
          </button>
          <button className={`${!props.isFullScreen && props.showMembers ? 'shrink' : ''}`}>
            <div>
              <DownVoteIcon />
              <p>9.5K</p>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};
