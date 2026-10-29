import type { ChannelStateData, Event, EventPayload } from 'stream-chat';
import { useChannel, useChatContext, useStateStore } from 'stream-chat-react';

const typingSelector = ({ typing }: ChannelStateData) => ({ typing });

// channel.state.typing is typed as the whole Event union; only typing.start events are stored
const isTypingStartEvent = (event: Event): event is EventPayload<'typing.start'> =>
  event.type === 'typing.start';

export const TeamTypingIndicator = () => {
  const { client } = useChatContext();

  const channel = useChannel();
  const { typing } = useStateStore(channel.state, typingSelector);

  if (!client || !typing) return null;

  const users = Object.values(typing)
    .filter(isTypingStartEvent)
    .filter(({ user }) => user?.id !== client.user?.id)
    .map(({ user }) => user?.name || user?.id);

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
