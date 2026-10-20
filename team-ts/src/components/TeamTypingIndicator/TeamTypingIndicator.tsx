import type { ChannelStateData } from 'stream-chat';
import { useChannel, useChatContext, useStateStore } from 'stream-chat-react';

const typingSelector = ({ typing }: ChannelStateData) => ({ typing });

export const TeamTypingIndicator = () => {
  const { client } = useChatContext();
  const channel = useChannel();
  const { typing } = useStateStore(channel.state, typingSelector);

  if (!client || !typing) return null;

  const users = Object.values(typing)
    .map((event) => ('user' in event ? event.user : undefined))
    .filter((user) => user?.id !== client.user?.id)
    .map((user) => user?.name || user?.id);

  if (!users.length) return null;

  let text = 'Someone is typing';

  if (users.length === 1) {
    text = `${users[0]} is typing`;
  } else if (users.length === 2) {
    text = `${users[0]} and ${users[1]} are typing`;
  } else if (users.length > 2) {
    text = `${users[0]} and ${users.length - 1} more are typing`;
  }

  return (
    <div className='typing-indicator__input'>
      <div className='dots'>
        <div className='dot' />
        <div className='dot' />
        <div className='dot' />
      </div>
      <div className='typing-indicator__input__text'>{text}</div>
    </div>
  );
};
