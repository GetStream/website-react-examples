import React from 'react';
import { useChannelActionContext, useChannelStateContext } from 'stream-chat-react';
import { ChannelHeader } from './ChannelHeader';

export const ThreadHeader: React.FC = () => {
  const { thread } = useChannelStateContext();
  const { closeThread } = useChannelActionContext();

  if (!thread) return null;

  const text = thread.user?.name || thread.user?.id || '';
  return <ChannelHeader onClose={closeThread} subtitle={`with ${text}`} title='Thread Reply' />;
};
