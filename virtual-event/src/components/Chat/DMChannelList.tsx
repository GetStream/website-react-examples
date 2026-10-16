import React, {PropsWithChildren, ReactNode, useMemo} from 'react';
import type {
  Channel as StreamChannel,
  ChannelFilters,
  ChannelOptions,
  ChannelSort,
  UserResponse,
} from 'stream-chat';
import {
  Avatar,
  ChannelList,
  ChannelListItemUIProps,
  ChannelListUIProps,
  useChatContext,
  WithComponents,
} from 'stream-chat-react';

import { DMChannel } from './DMChannel';
import { EmptyStateIndicators } from './EmptyStateIndicators';
import { ParticipantSearch } from './ParticipantSearch';

import { getFormattedTime } from './utils';
import { ClickDMIcon } from '../../assets';

import { useEventContext } from '../../contexts/EventContext';
import { PropsWithChildrenOnly } from '../../types';

export const SkeletonLoader: React.FC = () => (
  <ul className='dm-loading'>
    {[0, 1, 2, 3, 4].map((_, i) => (
      <li key={i}>
        <div className='dm-loading-avatar'></div>
        <div className='dm-loading-text'>
          <div></div>
          <div></div>
        </div>
      </li>
    ))}
  </ul>
);

const ListWrapper = ({ children }: PropsWithChildrenOnly) => {
  return <div className='dm-list'>{children}</div>;
};

const ListUI = ({ children, error, loading }: PropsWithChildren<ChannelListUIProps>) => {
  if (loading) {
    return (
      <ListWrapper>
        <SkeletonLoader />
      </ListWrapper>
    );
  }

  if (error) {
    return (
      <ListWrapper>
        <div className='dm-error'>
          Error fetching direct messages, please try again momentarily.
        </div>
      </ListWrapper>
    );
  }

  return <ListWrapper>{children}</ListWrapper>;
};

type PreviewUIProps = ChannelListItemUIProps & {
  setDmChannel: React.Dispatch<React.SetStateAction<StreamChannel | undefined>>;
};

const PreviewUI = (props: PreviewUIProps) => {
  const { channel, displayImage, displayTitle, latestMessagePreview, setDmChannel, unread } = props;

  const { client } = useChatContext();

  const secondsSinceLastMessage = channel.state?.last_message_at
    ? (Date.now() - channel.state.last_message_at.getTime()) / 1000
    : 0;

  const formattedTime = getFormattedTime(secondsSinceLastMessage);

  const [fallbackName] = Object.keys(channel.state.members).filter((id) => id !== client.userID);

  const handleClick = async () => {
    await channel.markRead();
    setDmChannel(channel);
  };

  return (
    <div className='dm-list-preview' onClick={handleClick}>
      <Avatar imageUrl={displayImage} size='md' userName={fallbackName} />
      <div>
        <div className='dm-list-preview-top'>
          <div>{displayTitle}</div>
          <div>{formattedTime}</div>
        </div>
        <div className={`dm-list-preview-bottom ${unread ? 'unread' : ''}`}>{latestMessagePreview as ReactNode}</div>
      </div>
      <ClickDMIcon />
    </div>
  );
};

type Props = {
  setDmChannel: React.Dispatch<React.SetStateAction<StreamChannel | undefined>>;
  setParticipantProfile: React.Dispatch<React.SetStateAction<UserResponse | undefined>>;
  dmChannel?: StreamChannel;
};

const NoChannelListHeader = () => null;

export const DMChannelList: React.FC<Props> = (props) => {
  const { dmChannel, setParticipantProfile, setDmChannel } = props;

  const { client } = useChatContext();
  const { searching, setSearching } = useEventContext();

  const filters: ChannelFilters = {
    type: 'messaging',
    demo: 'virtual-event',
    members: { $in: [client.userID || ''] },
  };
  const options: ChannelOptions = { state: true, presence: true, limit: 10 };
  const sort: ChannelSort = { last_message_at: -1 };

  const channelListOverrides = useMemo(
    () => ({
      // The DM tab has no header; hide the "Chats" header stream-chat-react 14 adds
      ChannelListHeader: NoChannelListHeader,
      ChannelListUI: ListUI,
      ChannelListItemUI: (props: ChannelListItemUIProps) => (
        <PreviewUI {...props} setDmChannel={setDmChannel} />
      ),
    }),
    [setDmChannel],
  );

  return (
    <>
      {searching && (
        <ParticipantSearch
          setDmChannel={setDmChannel}
          setParticipantProfile={setParticipantProfile}
          setSearching={setSearching}
        />
      )}
      <div className='dm'>
        {dmChannel && <DMChannel dmChannel={dmChannel} setDmChannel={setDmChannel} />}
        <WithComponents overrides={channelListOverrides}>
          <ChannelList
            EmptyStateIndicator={EmptyStateIndicators}
            filters={filters}
            options={options}
            setActiveChannelOnMount={false}
            sort={sort}
          />
        </WithComponents>
        <div className='start-chat'>
          <div className='start-chat-button' onClick={() => setSearching(true)}>
            Start a chat
          </div>
        </div>
      </div>
    </>
  );
};
