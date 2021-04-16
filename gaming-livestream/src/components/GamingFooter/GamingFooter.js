import React, { useState, useEffect } from 'react';

import './GamingFooter.scss';

import AlarmIcon from '../../assets/icons/AlarmIcon';
import CheckIcon from '../../assets/icons/CheckIcon';
import ClockIcon from '../../assets/icons/ClockIcon';
import DownVoteIcon from '../../assets/icons/DownVoteIcon';
import HeartFullIcon from '../../assets/icons/HeartFullIcon';
import HeartHollowIcon from '../../assets/icons/HeartHollowIcon';
import SubscribeFullIcon from '../../assets/icons/SubscribeFullIcon';
import SubscribeHollowIcon from '../../assets/icons/SubscribeHollowIcon';
import UpVoteIcon from '../../assets/icons/UpVoteIcon';

export const GamingFooter = (props) => {
  const { isFullScreen, showMembers } = props;

  const [countDown, setCountDown] = useState('00:00:00');
  const [countUp, setCountUp] = useState('00:00:00');
  const [followed, setFollowed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  let totalSeconds = 0;
  const deadline = new Date();
  deadline.setHours(deadline.getHours() + 3);

  const countTimerUp = () => {
    ++totalSeconds;
    let hour = Math.floor(totalSeconds / 3600);
    let minute = Math.floor((totalSeconds - hour * 3600) / 60);
    let seconds = totalSeconds - (hour * 3600 + minute * 60);

    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = '0' + minute;
    if (seconds < 10) seconds = '0' + seconds;

    setCountUp(`${hour}:${minute}:${seconds}`);
  };

  const countTimerDown = (endtime) => {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    setCountDown(`${hours}:${minutes}:${seconds}`);
  };

  useEffect(() => {
    setInterval(countTimerUp, 1000);
    setInterval(() => countTimerDown(deadline), 1000);
  }, []); // eslint-disable-line

  const showLastLi = () => {
    if (showMembers) return null;
    return <li>Shooter</li>;
  };

  return (
    <footer className={`${showMembers ? 'show-members' : ''} ${isFullScreen ? 'full-screen' : ''}`}>
      <div className='streamer-details-container'>
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
      {window.innerWidth > 920 && (
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
          <button
            className={`follow-btn ${!isFullScreen && showMembers ? 'shrink' : ''}`}
            onClick={() => setFollowed(!followed)}
          >
            <div>
              {followed ? <HeartFullIcon /> : <HeartHollowIcon />}
              <p>Follow</p>
            </div>
          </button>
          <button
            className={`sub-btn ${!isFullScreen && showMembers ? 'shrink' : ''}`}
            onClick={() => setSubscribed(!subscribed)}
          >
            <div>
              {subscribed ? <SubscribeFullIcon /> : <SubscribeHollowIcon />}
              <p>Subscribe</p>
            </div>
          </button>
          {window.innerWidth > 1100 && (
            <div className='btn-group'>
              <button className={`${!isFullScreen && showMembers ? 'shrink' : ''}`}>
                <div>
                  <UpVoteIcon />
                  <p>325K</p>
                </div>
              </button>
              <button className={`${!isFullScreen && showMembers ? 'shrink' : ''}`}>
                <div>
                  <DownVoteIcon />
                  <p>9.5K</p>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </footer>
  );
};
