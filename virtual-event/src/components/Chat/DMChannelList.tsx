import React, {useEffect, useMemo} from 'react';
import {
  type Channel as StreamChannel,
  type ChannelFilters,
  ChannelPaginator,
  nsToMs,
  type SortParamRequest,
  type UserResponse,
} from 'stream-chat';
import {
  Avatar,
  ChannelList,
  ChannelListItemUIProps,
  SummarizedMessagePreview,
  useChannelPaginatorState,
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

// ChannelListUI is gone: the list renders the loading slot itself, and query errors are read from the paginator
const ListError = ({ paginator }: { paginator: ChannelPaginator }) => {
  const { lastQueryError } = useChannelPaginatorState(paginator);
  if (!lastQueryError) return null;
  return (
    <div className='dm-error'>Error fetching direct messages, please try again momentarily.</div>
  );
};

type PreviewUIProps = ChannelListItemUIProps & {
  setDmChannel: React.Dispatch<React.SetStateAction<StreamChannel | undefined>>;
};

const PreviewUI = (props: PreviewUIProps) => {
  const { channel, displayImage, displayTitle, previewedMessage, setDmChannel, unread } = props;

  const { client } = useChatContext();

  // channel.state.last_message_at moved to the message paginator (unix nanoseconds)
  const latestMessageAt = channel.messagePaginator.latestMessageAt;
  const secondsSinceLastMessage = latestMessageAt
    ? (Date.now() - nsToMs(latestMessageAt)) / 1000
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
        <div className={`dm-list-preview-bottom ${unread ? 'unread' : ''}`}>
          <SummarizedMessagePreview latestMessage={previewedMessage} />
        </div>
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

  // v14 ChannelList queried on mount; this list mounts with the DM tab, so the paginator lives here too
  const paginator = useMemo(() => {
    const filters: ChannelFilters = {
      type: 'messaging',
      'custom.demo': 'virtual-event',
      members: { $in: [client.userID || ''] },
    };
    const sort: SortParamRequest[] = [{ direction: -1, field: 'last_message_at' }];
    return new ChannelPaginator({
      client,
      filters,
      id: 'virtual-event:dms',
      paginatorOptions: { pageSize: 10 },
      requestOptions: { presence: true, state: true },
      sort,
    });
  }, [client]);

  useEffect(() => {
    // registered so the list receives WebSocket updates
    client.channelManager.insertPaginator({ paginator });
    return () => {
      client.channelManager.removePaginator(paginator);
    };
  }, [client, paginator]);

  const channelListOverrides = useMemo(
    () => ({
      // The DM tab has no header; hide the "Chats" header stream-chat-react 14 adds
      ChannelListHeader: NoChannelListHeader,
      EmptyListIndicator: EmptyStateIndicators,
      FirstPageLoadingIndicator: SkeletonLoader,
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
          <ListWrapper>
            <ListError paginator={paginator} />
            <ChannelList paginator={paginator} />
          </ListWrapper>
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
