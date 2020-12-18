import React, { useContext } from 'react';
import { ChatContext } from 'stream-chat-react';

import './LiveEventAttendees.css';

export const LiveEventAttendees = () => {
  const { theme } = useContext(ChatContext);

  return (
    <div className={theme === 'livestream-light' ? 'live-event-attendees__container' : 'live-event-attendees__container-dark'}>
      <div className='live-event-attendees__title'>Moderators</div>
      <div className='live-event-attendees__moderators'>
        <div className='live-event-attendees__moderator'>
          <img alt='' style={{ height: '42px', width: '42px' }} src={require('../../assets/AttendeePics/Robert.png')}></img>
          <div className='live-event-attendees__moderator-name'>Robert Davidson</div>
        </div>
        <div className='live-event-attendees__moderator'>
          <img alt='' style={{ height: '42px', width: '42px' }} src={require('../../assets/AttendeePics/Amanda.png')}></img>
          <div className='live-event-attendees__moderator-name'>Amanda Stewart</div>
        </div>
      </div>
      <div className='live-event-attendees__title'>Audience</div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Casey.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Casey</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active now</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Jane.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Jane</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active Now</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Ted.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Ted</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active now</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Kelly.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Kelly</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active 2m ago</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Samantha.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Samantha</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active 3m ago</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Luke.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Luke</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active 15m ago</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Tracy.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Tracy</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active 1h ago</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Alex.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Alex</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active 1h ago</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Mike.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Mike</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active 3h ago</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Fredrick.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Mike</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active 7h ago</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={require('../../assets/AttendeePics/Erica.png')}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Erica</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active 7h ago</div>
      </div>
      <div className='live-event-attendees__footer'>
        <div className='live-event-attendees__footer-count'>1 - 12 of 3,712</div>
        <div className='live-event-attendees__footer-more'>Load More</div>
      </div>
    </div>
  );
};
