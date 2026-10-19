import './MessagingChannelPreview.css';
import {
  ChannelListItemUIProps,
  SummarizedMessagePreview,
  useChatContext,
  useStateStore,
  useWorkspaceNavigation,
} from 'stream-chat-react';
import { AvatarGroup } from '../';

import type { MouseEventHandler } from 'react';
import {
  type Channel,
  type ChannelMemberResponse,
  convertTimestampToDate,
  type MessagePaginatorAggregateState,
} from 'stream-chat';

const aggregateStateSelector = ({ lastMessage, seededLastMessageAt }: MessagePaginatorAggregateState) => ({
  lastMessage,
  seededLastMessageAt,
});

const getTimeStamp = (channel: Channel) => {
  const lastMessageAt = convertTimestampToDate(channel.messagePaginator.lastMessageAt);
  let lastHours = lastMessageAt?.getHours();
  let lastMinutes: string | number | undefined = lastMessageAt?.getMinutes();
  let half = 'AM';

  if (lastHours === undefined || lastMinutes === undefined) {
    return '';
  }

  if (lastHours > 12) {
    lastHours = lastHours - 12;
    half = 'PM';
  }

  if (lastHours === 0) lastHours = 12;
  if (lastHours === 12) half = 'PM';

  if (lastMinutes.toString().length === 1) {
    lastMinutes = `0${lastMinutes}`;
  }

  return `${lastHours}:${lastMinutes} ${half}`;
};

const getChannelName = (members: ChannelMemberResponse[]) => {
  const defaultName = 'Johnny Blaze';

  if (!members.length || members.length === 1) {
    return members[0]?.user?.name || defaultName;
  }

  return `${members[0]?.user?.name || defaultName}, ${members[1]?.user?.name || defaultName}`;
};

type MessagingChannelPreviewProps = ChannelListItemUIProps & {
  onClick: MouseEventHandler;
};

const MessagingChannelPreview = (props: MessagingChannelPreviewProps) => {
  const { active, channel, messageDeliveryStatus, onClick, previewedMessage } = props;
  const { client } = useChatContext();
  const { openChannel } = useWorkspaceNavigation();
  // re-render when the latest message changes, so the timestamp follows it
  useStateStore(channel.messagePaginator.aggregateState, aggregateStateSelector);

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client.userID,
  );

  return (
    <div
      className={active ? 'channel-preview__container selected' : 'channel-preview__container'}
      onClick={(event) => {
        onClick(event);
        openChannel(channel, { event });
      }}
    >
      <AvatarGroup members={members} />
      <div className='channel-preview__content-wrapper'>
        <div className='channel-preview__content-top'>
          <p className='channel-preview__content-name'>
            {channel.data?.custom?.name || getChannelName(members)}
          </p>
          <p className='channel-preview__content-time'>{getTimeStamp(channel)}</p>
        </div>
        <div className='channel-preview__content-message'>
          <SummarizedMessagePreview
            latestMessage={previewedMessage}
            messageDeliveryStatus={messageDeliveryStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default MessagingChannelPreview;
