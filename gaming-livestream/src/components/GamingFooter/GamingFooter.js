import React, { useState, useEffect } from 'react';
import './GamingFooter.scss';

import CheckIcon from '../../assets/icons/CheckIcon';
import ClockIcon from '../../assets/icons/ClockIcon';
import AlarmIcon from '../../assets/icons/AlarmIcon';
import FollowersIcon from '../../assets/icons/FollowersIcon';
import SubsIcon from '../../assets/icons/SubsIcon';
import UpVoteIcon from '../../assets/icons/UpVoteIcon';
import DownVoteIcon from '../../assets/icons/DownVoteIcon';

export const GamingFooter = (props) => {
  const [countDown, setCountDown] = useState('00:00:00');
  const [countUp, setCountUp] = useState('00:00:00');

  let totalSeconds = 0;
  const deadline = new Date();
  deadline.setHours(deadline.getHours() + 3);

  useEffect(() => {
    const timerUpInterval = setInterval(countTimerUp, 1000);
    const timerDownInterval = setInterval(() => {
      countTimerDown(deadline)
    }, 1000);
  }, [])

  const showLastLi = () => {
    if (props.showMembers) {
      return null;
    }
    return <li>Shooter</li>;
  };

  const countTimerUp = () => {
    ++totalSeconds;
    let hour = Math.floor(totalSeconds / 3600);
    let minute = Math.floor((totalSeconds - hour * 3600) / 60);
    let seconds = totalSeconds - (hour * 3600 + minute * 60);

    if (hour < 10) hour = "0" + hour;
    if (minute < 10) minute = "0" + minute;
    if (seconds < 10) seconds = "0" + seconds;

    setCountUp(`${hour}:${minute}:${seconds}`);
  }

  const countTimerDown = (endtime) => {

    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    setCountDown(`${hours}:${minutes}:${seconds}`)
  }

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
            <p>{countDown}</p>
            <ClockIcon />
          </div>
          <div>
            <p>-{countUp}</p>
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