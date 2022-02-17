import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { CreateChannelIcon } from '../../assets';
import streamLogo from '../../assets/stream.png';

import type {
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  MessageType,
  ReactionType,
  UserType,
} from '../../App';

type Props = {
  onCreateChannel?: () => void;
  theme: string;
};

const MessagingChannelListHeader: React.FC<Props> = React.memo((props) => {
  const { onCreateChannel, theme } = props;

  const { client } = useChatContext<
    AttachmentType,
    ChannelType,
    CommandType,
    EventType,
    MessageType,
    ReactionType,
    UserType
  >();

  const { id, image = streamLogo as string, name = 'Example User' } = client.user || {};

  return (
    <div className='messaging__channel-list'>
      <div className='messaging__channel-list__header'>
        <Avatar image={image} name={name} size={40} />
        <div className={`${theme} messaging__channel-list__header__name`}>{name || id}</div>
        <button className={`${theme} messaging__channel-list__header__button`} onClick={onCreateChannel}>
          <CreateChannelIcon />
        </button>
      </div>
    </div>
  );
});

export default React.memo(MessagingChannelListHeader);
