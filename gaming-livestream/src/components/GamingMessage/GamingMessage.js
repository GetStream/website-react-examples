import React from 'react';

import './GamingMessage.scss';

import UserIcon from '../../assets/icons/UserIcon';
import { getColor } from '../../assets/data';

export const GamingMessage = (props) => {
  return (
    <div className='custom-message'>
      <UserIcon />
      <p className='message-owner' style={{ color: getColor() }}>
        {props.message.user.id}
      </p>
      <p className='message'>{props.message.text}</p>
    </div>
  );
};
