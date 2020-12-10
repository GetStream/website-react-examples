import React, { } from 'react';
import '../styles/footer.scss'

import { ReactComponent as CheckSVG } from '../assets/icons/check.svg';
import { ReactComponent as ClockSVG } from '../assets/icons/clock.svg';
import { ReactComponent as AlarmSVG } from '../assets/icons/alarm.svg';
import { ReactComponent as FollowersSVG } from '../assets/icons/followers.svg';
import { ReactComponent as SubsSVG } from '../assets/icons/subs.svg';
import { ReactComponent as UpVoteSVG } from '../assets/icons/upvote.svg';
import { ReactComponent as DownVoteSVG } from '../assets/icons/downvote.svg';

const Footer = props => {

  const showLastLi = () => {
    if (props.showMembers) {
      return null;
    }
    return <li>Shooter</li>;
  }

  return (
    <footer className={`${props.showMembers ? 'show-members' : ''} ${props.isFullScreen ? 'full-screen' : ''}`}>
      <div className="streamer-details-container">
        <div className="streamer-details-separator">
          <div className="avatar"></div>
          <div className="streamer-container">
            <div className="streamer-name">
              <p>PolarBear</p>
              <CheckSVG />
            </div>
            <ul className="streamer-details">
              <li>English</li>
              <li>FPS</li>
              {showLastLi()}
            </ul>
          </div>
        </div>
      </div>
      <div className="user-interaction-container">
        <div className="timer-container">
          <div>
            <p>2:54:38</p>
            <ClockSVG />
          </div>
          <div>
            <p>-00:34:22</p>
            <AlarmSVG />
          </div>
        </div>
        <button className={`follow-btn ${!props.isFullScreen && props.showMembers ? 'shrink' : ''}`}>
          <div>
            <FollowersSVG />
            <p>Follow</p>
          </div>
        </button>
        <button className={`sub-btn ${!props.isFullScreen && props.showMembers ? 'shrink' : ''}`}>
          <div>
            <SubsSVG />
            <p>Subscribe</p>
          </div>
        </button>
        <div className="btn-group">
          <button className={`${!props.isFullScreen && props.showMembers ? 'shrink' : ''}`}>
            <div>
              <UpVoteSVG />
              <p>325K</p>
            </div>
          </button>
          <button className={`${!props.isFullScreen && props.showMembers ? 'shrink' : ''}`}>
            <div>
              <DownVoteSVG />
              <p>9.5K</p>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer
