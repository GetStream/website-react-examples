import { useChannelContext } from 'stream-chat-react';

import './TypingIndicator.css';

import type {
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  MessageType,
  ReactionType,
  UserType,
} from '../../App';

export const TypingIndicator = () => {
  const { client, typing } = useChannelContext<
    AttachmentType,
    ChannelType,
    CommandType,
    EventType,
    MessageType,
    ReactionType,
    UserType
  >();

  if (!client || !typing) return null;

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
