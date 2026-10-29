import './MessagingChannelPreview.css';
import {
  ChannelListItemUIProps,
  SummarizedMessagePreview,
  useChatContext,
  useWorkspaceNavigation,
} from 'stream-chat-react';
import { AvatarGroup } from '../';

import type { MouseEventHandler} from 'react';
import { type ChannelMemberResponse, type TimestampNS, convertTimestampToDate } from 'stream-chat';

const getTimeStamp = (timestamp: TimestampNS | undefined) => {
  const date = convertTimestampToDate(timestamp);
  let lastHours = date?.getHours();
  let lastMinutes: string | number | undefined = date?.getMinutes();
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
  const { active, channel, onClick, messageDeliveryStatus, previewedMessage } = props;
  const { client } = useChatContext();
  const { openChannel } = useWorkspaceNavigation();

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user?.id !== client.userID,
  );



  return (
    <div
      className={
        active
          ? 'channel-preview__container selected'
          : 'channel-preview__container'
      }
      onClick={(e) => {
        onClick(e);
        openChannel(channel, { event: e });
      }}
    >
      <AvatarGroup members={members} />
      <div className='channel-preview__content-wrapper'>
        <div className='channel-preview__content-top'>
          <p className='channel-preview__content-name'>
            {channel.data?.custom?.name || getChannelName(members)}
          </p>
          <p className='channel-preview__content-time'>
            {getTimeStamp(previewedMessage?.created_at)}
          </p>
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
