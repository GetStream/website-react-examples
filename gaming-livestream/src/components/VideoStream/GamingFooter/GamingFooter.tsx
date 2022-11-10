import React, { useState, useEffect } from 'react';

import AlarmIcon from '../../../assets/icons/AlarmIcon';
import CheckIcon from '../../../assets/icons/CheckIcon';
import ClockIcon from '../../../assets/icons/ClockIcon';
import DownVoteIcon from '../../../assets/icons/DownVoteIcon';
import HeartFullIcon from '../../../assets/icons/HeartFullIcon';
import HeartHollowIcon from '../../../assets/icons/HeartHollowIcon';
import SubscribeFullIcon from '../../../assets/icons/SubscribeFullIcon';
import SubscribeHollowIcon from '../../../assets/icons/SubscribeHollowIcon';
import UpVoteIcon from '../../../assets/icons/UpVoteIcon';

type GamingFooterProps = {
  isFullScreen: boolean
  memberListVisible: boolean
}

export const GamingFooter = ({ memberListVisible, isFullScreen }: GamingFooterProps) => {
  const [countDown, setCountDown] = useState('00:00:00');
  const [countUp, setCountUp] = useState('00:00:00');
  const [followed, setFollowed] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  let totalSeconds = 0;
  const deadline = new Date();
  deadline.setHours(deadline.getHours() + 3);

  const countTimerUp = () => {
    ++totalSeconds;
    let hour: number | string = Math.floor(totalSeconds / 3600);
    let minute: number | string = Math.floor((totalSeconds - hour * 3600) / 60);
    let seconds: number | string = totalSeconds - (hour * 3600 + minute * 60);

    if (hour < 10) hour = '0' + hour;
    if (minute < 10) minute = '0' + minute;
    if (seconds < 10) seconds = '0' + seconds;

    setCountUp(`${hour}:${minute}:${seconds}`);
  };

  const countTimerDown = (endtime: Date) => {
    const total = endtime.getTime() - new Date().getTime();
    const seconds = Math.floor(total % 60);
    const minutes = Math.floor((total / 60) % 60);
    const hours = Math.floor((total / (60 * 60)) % 24);

    setCountDown(`${hours}:${minutes}:${seconds}`);
  };

  useEffect(() => {
    setInterval(countTimerUp, 1000);
    setInterval(() => countTimerDown(deadline), 1000);
  }, []); // eslint-disable-line

  const showLastLi = () => {
    if (memberListVisible) return null;
    return <li>Shooter</li>;
  };

  return (
    <footer className={`${memberListVisible ? 'show-members' : ''} ${isFullScreen ? 'full-screen' : ''}`}>
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
            className={`follow-btn ${!isFullScreen && memberListVisible ? 'shrink' : ''}`}
            onClick={() => setFollowed(!followed)}
          >
            <div>
              {followed ? <HeartFullIcon /> : <HeartHollowIcon />}
              <p>Follow</p>
            </div>
          </button>
          <button
            className={`sub-btn ${!isFullScreen && memberListVisible ? 'shrink' : ''}`}
            onClick={() => setSubscribed(!subscribed)}
          >
            <div>
              {subscribed ? <SubscribeFullIcon /> : <SubscribeHollowIcon />}
              <p>Subscribe</p>
            </div>
          </button>
          {window.innerWidth > 1100 && (
            <div className='btn-group'>
              <button className={`${!isFullScreen && memberListVisible ? 'shrink' : ''}`}>
                <div>
                  <UpVoteIcon />
                  <p>325K</p>
                </div>
              </button>
              <button className={`${!isFullScreen && memberListVisible ? 'shrink' : ''}`}>
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
