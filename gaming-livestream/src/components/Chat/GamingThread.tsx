import React from 'react';
import { Thread } from 'stream-chat-react';

import { GamingMessage } from './GamingMessage';
import { GamingMessageInput } from './GamingMessageInput';

export const GamingThread = () => {
  return <Thread Message={GamingMessage} Input={GamingMessageInput} />;
};
