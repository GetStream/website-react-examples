import React, {useEffect, useMemo} from 'react';
import {
  type Channel as StreamChannel,
  type ChannelFilters,
  ChannelPaginator,
  type MessagePaginatorAggregateState,
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
  useStateStore,
  WithComponents,
} from 'stream-chat-react';

import { DMChannel } from './DMChannel';
import { EmptyStateIndicators } from './EmptyStateIndicators';
import { ParticipantSearch } from './ParticipantSearch';

import { getFormattedTime } from './utils';
import { ClickDMIcon } from '../../assets';

import { useEventContext } from '../../contexts/EventContext';
import { PropsWithChildrenOnly } from '../../types';

const sort: SortParamRequest[] = [{ field: 'last_message_at', direction: -1 }];

const aggregateStateSelector = ({ lastMessage, seededLastMessageAt }: MessagePaginatorAggregateState) => ({
  lastMessage,
  seededLastMessageAt,
});

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

/** Replaces v14's ChannelListUI: the loading and error states come from the paginator. */
const DMList = ({ paginator }: { paginator: ChannelPaginator }) => {
  const { channels, isLoading, lastQueryError } = useChannelPaginatorState(paginator);

  if (isLoading && !channels) {
    return (
      <ListWrapper>
        <SkeletonLoader />
      </ListWrapper>
    );
  }

  if (lastQueryError) {
    return (
      <ListWrapper>
        <div className='dm-error'>
          Error fetching direct messages, please try again momentarily.
        </div>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <ChannelList paginator={paginator} />
    </ListWrapper>
  );
};

type PreviewUIProps = ChannelListItemUIProps & {
  setDmChannel: React.Dispatch<React.SetStateAction<StreamChannel | undefined>>;
};

const PreviewUI = (props: PreviewUIProps) => {
  const { channel, displayImage, displayTitle, messageDeliveryStatus, previewedMessage, setDmChannel, unread } = props;

  const { client } = useChatContext();
  // re-render when the latest message changes, so the relative time follows it
  useStateStore(channel.messagePaginator.aggregateState, aggregateStateSelector);

  const lastMessageAt = channel.messagePaginator.lastMessageAt;
  const secondsSinceLastMessage = lastMessageAt ? (Date.now() - nsToMs(lastMessageAt)) / 1000 : 0;

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
          <SummarizedMessagePreview
            latestMessage={previewedMessage}
            messageDeliveryStatus={messageDeliveryStatus}
          />
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

export const DMChannelList: React.FC<Props> = (props) => {
  const { dmChannel, setParticipantProfile, setDmChannel } = props;

  const { client } = useChatContext();
  const { searching, setSearching } = useEventContext();

  const paginator = useMemo(() => {
    const filters: ChannelFilters = {
      type: 'messaging',
      'custom.demo': 'virtual-event',
      members: { $in: [client.userID || ''] },
    };
    return new ChannelPaginator({
      client,
      filters,
      id: 'virtual-event-dms',
      paginatorOptions: { pageSize: 10 },
      requestOptions: { state: true, presence: true },
      sort,
    });
  }, [client]);

  useEffect(() => {
    client.channelManager.insertPaginator({ paginator });
    return () => {
      client.channelManager.removePaginator(paginator);
    };
  }, [client, paginator]);

  const channelListOverrides = useMemo(
    () => ({
      EmptyListIndicator: EmptyStateIndicators,
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
          <DMList paginator={paginator} />
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
