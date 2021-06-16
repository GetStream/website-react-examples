import React from 'react';
import { Thread } from 'stream-chat-react';

import { GamingMessage } from '../GamingMessage/GamingMessage';
import { GamingMessageInput } from '../GamingMessageInput/GamingMessageInput';

import './GamingThread.scss';

export const GamingThread = () => {
  return (
    <>
      <Thread Message={GamingMessage} Input={GamingMessageInput} />
    </>
  );
};
