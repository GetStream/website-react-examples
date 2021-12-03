import React, { useContext } from 'react';
import { ChatContext } from 'stream-chat-react';

import './LiveEventAttendees.css';

import Robert from '../../assets/AttendeePics/Robert.png';
import Amanda from '../../assets/AttendeePics/Amanda.png';
import Casey from '../../assets/AttendeePics/Casey.png';
import Jane from '../../assets/AttendeePics/Jane.png';
import Ted from '../../assets/AttendeePics/Ted.png';
import Kelly from '../../assets/AttendeePics/Kelly.png';
import Samantha from '../../assets/AttendeePics/Samantha.png';
import Luke from '../../assets/AttendeePics/Luke.png';
import Tracy from '../../assets/AttendeePics/Tracy.png';
import Alex from '../../assets/AttendeePics/Alex.png';
import Mike from '../../assets/AttendeePics/Mike.png';
import Fredrick from '../../assets/AttendeePics/Fredrick.png';
import Erica from '../../assets/AttendeePics/Erica.png';

export const LiveEventAttendees = () => {
  const { theme } = useContext(ChatContext);

  return (
    <div
      className={
        theme === 'livestream light'
          ? 'live-event-attendees__container'
          : 'live-event-attendees__container-dark'
      }
    >
      <div className='live-event-attendees__title'>Moderators</div>
      <div className='live-event-attendees__moderators'>
        <div className='live-event-attendees__moderator'>
          <img alt='' style={{ height: '42px', width: '42px' }} src={Robert}></img>
          <div className='live-event-attendees__moderator-name'>Robert Davidson</div>
        </div>
        <div className='live-event-attendees__moderator'>
          <img alt='' style={{ height: '42px', width: '42px' }} src={Amanda}></img>
          <div className='live-event-attendees__moderator-name'>Amanda Stewart</div>
        </div>
      </div>
      <div className='live-event-attendees__title'>Audience</div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={Casey}
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
            src={Jane}
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
            src={Ted}
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
            src={Kelly}
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
            src={Samantha}
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
            src={Luke}
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
            src={Tracy}
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
            src={Alex}
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
            src={Mike}
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
            src={Fredrick}
          ></img>
          <div className='live-event-attendees__audience-member__left-name'>Fredrick</div>
        </div>
        <div className='live-event-attendees__audience-member__right'>Active 7h ago</div>
      </div>
      <div className='live-event-attendees__audience-member'>
        <div className='live-event-attendees__audience-member__left'>
          <img
            alt=''
            style={{ height: '30px', width: '30px', marginRight: '10px' }}
            src={Erica}
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
