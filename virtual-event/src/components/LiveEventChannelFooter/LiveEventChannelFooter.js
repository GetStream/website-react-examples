import React, { useState } from 'react';
import { AdminBadge } from '../../assets/AdminBadge';
import { AvatarRobert } from '../../assets/AvatarRobert';
import { MeatballMenu } from '../../assets/MeatballMenu';
import { SloMoModal } from '../SloMoModal/SloMoModal';
import './LiveEventChannelFooter.css';
import { LiveEventMessageInput } from './LiveEventMessageInput';

export const LiveEventChannelFooter = () => {
  const [showModal, setShowModal] = useState(false);
  const [sloMoDelay, setSloMoDelay] = useState('0');
  const [toggleSwitchPosition, setToggleSwitchPosition] = useState(false);

  return (
    <div className="live-event-footer__container">
      <div className="live-event-footer__top">
        <div className="live-event-footer__avatar">
          <AvatarRobert />
        </div>
        <div className="live-event-footer__input">
          <LiveEventMessageInput focus sloMoDelay={sloMoDelay} />
        </div>
      </div>
      <div className="live-event-footer__bottom">
        <div className="live-event-footer__bottom-left">
          <div className="live-event-footer__bottom-badge">
            <AdminBadge />
          </div>
          <h3>Moderator Controls</h3>
        </div>
        {showModal && (
          <SloMoModal
            setToggleSwitchPosition={setToggleSwitchPosition}
            sloMoDelay={sloMoDelay}
            setSloMoDelay={setSloMoDelay}
            toggleSwitchPosition={toggleSwitchPosition}
          />
        )}
        <div onClick={() => setShowModal(!showModal)}>
          <MeatballMenu />
        </div>
      </div>
    </div>
  );
};
