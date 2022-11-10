import React from 'react';
import { Thread } from 'stream-chat-react';

import { GamingMessage } from '../GamingMessage/GamingMessage';
import { GamingMessageInput } from '../GamingMessageInput/GamingMessageInput';

export const GamingThread = () => {
  return <Thread Message={GamingMessage} Input={GamingMessageInput} />;
};
