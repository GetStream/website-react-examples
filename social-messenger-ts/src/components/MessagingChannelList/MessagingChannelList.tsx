import React, { PropsWithChildren, useEffect } from 'react';
import { ChannelListMessengerProps, useChatContext } from 'stream-chat-react';

import './MessagingChannelList.css';
import { SkeletonLoader } from './SkeletonLoader';

import type { StreamChat } from 'stream-chat';
import type { StreamChatGenerics } from '../../types';

const MessagingChannelList = (props: PropsWithChildren<ChannelListMessengerProps>) => {
  const { children, error = false, loading } = props;
  const { client, setActiveChannel } = useChatContext<StreamChatGenerics>();

  useEffect(() => {
    const getDemoChannel = async (client: StreamChat<StreamChatGenerics>) => {
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

  if (error) {
    return (
      <div className='messaging__channel-list__message'>
        Error loading conversations, please try again momentarily.
      </div>
    );
  }

  if (loading) {
    return (
      <div className='messaging__channel-list__message'>
        <SkeletonLoader />
      </div>
    );
  }

  return <>{children}</>;
};

export default React.memo(MessagingChannelList);
