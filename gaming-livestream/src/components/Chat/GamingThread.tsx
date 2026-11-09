import React from 'react';
import type { Thread as StreamThread } from 'stream-chat';
import { MessageComposer, MessageList, Thread } from 'stream-chat-react';

import { GamingThreadHeader } from './GamingThreadHeader';

export const GamingThread = ({ thread }: { thread: StreamThread }) => (
  <Thread thread={thread}>
    <GamingThreadHeader />
    <MessageList withDateSeparator={false} />
    <MessageComposer focus minRows={1} maxRows={8} />
  </Thread>
);
