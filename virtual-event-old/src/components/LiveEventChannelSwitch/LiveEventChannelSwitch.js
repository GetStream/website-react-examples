import React, { useState } from 'react';
import './LiveEventChannelSwitch.css';

import { LiveChat } from '../../assets/LiveChat';
import { Pins } from '../../assets/Pins';
import { Attendees } from '../../assets/Attendees';
import { LiveChatBlue } from '../../assets/LiveChatBlue';
import { PinsBlue } from '../../assets/PinsBlue';
import { AttendeesBlue } from '../../assets/AttendeesBlue';
import { LiveEventChannelContainer } from '../LiveEventChannelContainer/LiveEventChannelContainer';

export const LiveEventChannelSwitch = () => {
  const [tab, setTab] = useState(1);

  return (
    <>
      <div className='live-event-channel-switch__container'>
        <div onClick={() => setTab(1)}>{tab === 1 ? <LiveChatBlue /> : <LiveChat />}</div>
        <div onClick={() => setTab(2)}>{tab === 2 ? <PinsBlue /> : <Pins />}</div>
        <div onClick={() => setTab(3)}>{tab === 3 ? <AttendeesBlue /> : <Attendees />}</div>
      </div>
      <LiveEventChannelContainer tab={tab} />
    </>
  );
};
