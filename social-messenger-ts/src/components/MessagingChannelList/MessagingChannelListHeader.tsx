import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { CreateChannelIcon } from '../../assets';
import streamLogo from '../../assets/stream.png';

import type { StreamChatGenerics } from '../../types';

type Props = {
  onCreateChannel?: () => void;
  theme: string;
};

const MessagingChannelListHeader = React.memo((props: Props) => {
  const { onCreateChannel, theme } = props;

  const { client } = useChatContext<StreamChatGenerics>();

  const { id, image = streamLogo as string, name = 'Example User' } = client.user || {};

  return (
    <div className={`${theme} messaging__channel-list`}>
      <div className='messaging__channel-list__header'>
        <Avatar image={image} name={name} size={40} />
        <div className={`${theme} messaging__channel-list__header__name`}>{name || id}</div>
        <button
          className={`${theme} messaging__channel-list__header__button`}
          onClick={onCreateChannel}
        >
          <CreateChannelIcon />
        </button>
      </div>
    </div>
  );
});

export default React.memo(MessagingChannelListHeader);
