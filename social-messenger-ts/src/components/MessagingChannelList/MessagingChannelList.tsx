import React, { useEffect } from 'react';
import { ChannelListMessengerProps, useChatContext } from 'stream-chat-react';

import './MessagingChannelList.css';
import { SkeletonLoader } from './SkeletonLoader';

import type { StreamChat } from 'stream-chat';

import type {
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  MessageType,
  ReactionType,
  UserType,
} from '../../App';

const MessagingChannelList: React.FC<ChannelListMessengerProps> = (props) => {
  const { children, error = false, loading } = props;

  const { client, setActiveChannel } = useChatContext<
    AttachmentType,
    ChannelType,
    CommandType,
    EventType,
    MessageType,
    ReactionType,
    UserType
  >();

  useEffect(() => {
    const getDemoChannel = async (
      client: StreamChat<
        AttachmentType,
        ChannelType,
        CommandType,
        EventType,
        MessageType,
        ReactionType,
        UserType
      >,
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
