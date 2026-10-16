import React from 'react';
import { Thread } from 'stream-chat-react';

import { GamingMessage } from './GamingMessage';

export const GamingThread = () => {
  return <Thread Message={GamingMessage} />;
};
