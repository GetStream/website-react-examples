import { useChatContext, useTypingContext } from 'stream-chat-react';

import './TypingIndicator.css';

import type { StreamChatGenerics } from '../../types';

export const TypingIndicator = () => {
  const { client } = useChatContext<StreamChatGenerics>();

  const {typing} = useTypingContext<StreamChatGenerics>();
  if (!client || !typing || !Object.values(typing).length ) return null;

  const users = Object.values(typing)
    .filter(({ user }) => user?.id !== client.user?.id)
    .map(({ user }) => user?.name || user?.id);

  let text = '';

  if (users.length === 1) {
    text = `${users[0]} is typing`;
  } else if (users.length === 2) {
    text = `${users[0]} and ${users[1]} are typing`;
  } else if (users.length > 2) {
    text = `${users[0]} and ${users.length - 1} more are typing`;
  }

  return (
    <div className='messaging__typing-indicator'>
      {text && (
        <div className='dots'>
          <span className='dot' />
          <span className='dot' />
          <span className='dot' />
        </div>
      )}
      <div>{text}</div>
    </div>
  );
};
