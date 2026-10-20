import React from 'react';
import type { ThreadState } from 'stream-chat';
import { useCloseThread, useStateStore, useThreadContext } from 'stream-chat-react';
import { ChannelHeader } from './ChannelHeader';

const parentMessageSelector = ({ parentMessage }: ThreadState) => ({ parentMessage });

export const ThreadHeader: React.FC = () => {
  const thread = useThreadContext();
  const { parentMessage } = useStateStore(thread?.state, parentMessageSelector) ?? {};
  const closeThread = useCloseThread();

  if (!thread) return null;

  const text = parentMessage?.user?.name || parentMessage?.user?.id || '';
  return <ChannelHeader onClose={() => closeThread()} subtitle={`with ${text}`} title='Thread Reply' />;
};
