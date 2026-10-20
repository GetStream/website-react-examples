import type { ChannelStateData } from 'stream-chat';
import { useChannel, useChatContext, useStateStore } from 'stream-chat-react';

import './TypingIndicator.css';

const typingSelector = ({ typing }: ChannelStateData) => ({ typing });

export const TypingIndicator = () => {
  const { client } = useChatContext();
  const channel = useChannel();
  const { typing } = useStateStore(channel.state, typingSelector);

  if (!client || !typing || !Object.values(typing).length) return null;

  const users = Object.values(typing)
    .map((event) => ('user' in event ? event.user : undefined))
    .filter((user) => user?.id !== client.user?.id)
    .map((user) => user?.name || user?.id);

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
