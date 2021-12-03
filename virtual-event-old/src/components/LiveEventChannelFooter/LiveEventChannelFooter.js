import React, { useState } from 'react';
import { MessageInput } from 'stream-chat-react';

import './LiveEventChannelFooter.css';
import { LiveEventMessageInput } from './LiveEventMessageInput';
import { SloMoModal } from '../SloMoModal/SloMoModal';

import { AdminBadge } from '../../assets/AdminBadge';
import { AvatarRobert } from '../../assets/AvatarRobert';
import { MeatballMenu } from '../../assets/MeatballMenu';

export const LiveEventChannelFooter = () => {
  const [showModal, setShowModal] = useState(false);
  const [sloMoDelay, setSloMoDelay] = useState('0');
  const [toggleSwitchPosition, setToggleSwitchPosition] = useState(false);

  const toggleModal = (event) => {
    event.stopPropagation();
    setShowModal((value) => !value);
  };

  return (
    <div className='live-event-footer__container'>
      <div className='live-event-footer__top'>
        <div className='live-event-footer__avatar'>
          <AvatarRobert />
        </div>
        <div className='live-event-footer__input'>
          <MessageInput
            focus
            grow
            Input={(props) => <LiveEventMessageInput {...props} sloMoDelay={sloMoDelay} />}
          />
        </div>
      </div>
      <div className='live-event-footer__bottom'>
        <div className='live-event-footer__bottom-left'>
          <div className='live-event-footer__bottom-badge'>
            <AdminBadge />
          </div>
          <h3>Moderator Controls</h3>
        </div>
        {showModal && (
          <SloMoModal
            setToggleSwitchPosition={setToggleSwitchPosition}
            setShowModal={setShowModal}
            sloMoDelay={sloMoDelay}
            setSloMoDelay={setSloMoDelay}
            toggleSwitchPosition={toggleSwitchPosition}
          />
        )}
        <div style={{ cursor: 'pointer' }} onClick={toggleModal}>
          <MeatballMenu />
        </div>
      </div>
    </div>
  );
};
