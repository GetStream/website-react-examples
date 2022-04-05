import React, { useEffect } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import './MessagingChannelList.css';
import { SkeletonLoader } from './SkeletonLoader';

import { CreateChannelIcon } from '../../assets';
import streamLogo from '../../assets/stream.png';

import type { StreamChat } from 'stream-chat';
import type { ChannelListMessengerProps } from 'stream-chat-react/dist/components/ChannelList/ChannelListMessenger';

import type { StreamChatGenerics } from '../../types';

type Props = ChannelListMessengerProps & {
  onCreateChannel: () => void;
};

const MessagingChannelList: React.FC<Props> = (props) => {
  const { children, error = false, loading, onCreateChannel } = props;

  const { client, setActiveChannel } = useChatContext<StreamChatGenerics>();

  const { id, image = streamLogo as string, name = 'Example User' } = client.user || {};

  useEffect(() => {
    const getDemoChannel = async (
      client: StreamChat<StreamChatGenerics>,
    ) => {
      const channel = client.channel('messaging', 'first', {
        name: 'Social Demo',
        demo: 'social',
      });

      await channel.watch();

      if (client.user) {
        await channel.addMembers([client.user.id]);
      }

      setActiveChannel(channel);
    };

    //@ts-expect-error hack to ensure a channel is always loaded
    if (!loading && !children?.props?.children?.length) {
      getDemoChannel(client);
    }
  }, [loading]); // eslint-disable-line

  const ListHeaderWrapper: React.FC = ({ children }) => {
    return (
      <div className='messaging__channel-list'>
        <div className='messaging__channel-list__header'>
          <Avatar image={image} name={name} size={40} />
          <div className='messaging__channel-list__header__name'>{name || id}</div>
          <button className='messaging__channel-list__header__button' onClick={onCreateChannel}>
            <CreateChannelIcon />
          </button>
        </div>
        {children}
      </div>
    );
  };

  if (error) {
    return (
      <ListHeaderWrapper>
        <div className='messaging__channel-list__message'>
          Error loading conversations, please try again momentarily.
        </div>
      </ListHeaderWrapper>
    );
  }

  if (loading) {
    return (
      <ListHeaderWrapper>
        <div className='messaging__channel-list__message'>
          <SkeletonLoader />
        </div>
      </ListHeaderWrapper>
    );
  }

  return <ListHeaderWrapper>{children}</ListHeaderWrapper>;
};

export default React.memo(MessagingChannelList);
