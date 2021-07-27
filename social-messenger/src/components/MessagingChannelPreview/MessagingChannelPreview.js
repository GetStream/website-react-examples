import React, { useContext } from 'react';
import { Avatar, ChatContext } from 'stream-chat-react';
import { getCleanImage } from '../../assets';

import './MessagingChannelPreview.css';

const getAvatarGroup = (members) => {
  if (members.length === 1) {
    return <Avatar image={getCleanImage(members[0])} name={members[0].user?.id} size={40} />;
  }

  if (members.length === 2) {
    return (
      <div className='channel-preview__avatars two'>
        <span>
          <Avatar
            image={getCleanImage(members[0])}
            name={members[0].user?.id}
            shape='square'
            size={40}
          />
        </span>
        <span>
          <Avatar
            image={getCleanImage(members[1])}
            name={members[1].user?.id}
            shape='square'
            size={40}
          />
        </span>
      </div>
    );
  }

  if (members.length === 3) {
    return (
      <div className='channel-preview__avatars three'>
        <span>
          <Avatar
            image={getCleanImage(members[0])}
            name={members[0].user?.id}
            shape='square'
            size={40}
          />
        </span>
        <span>
          <Avatar
            image={getCleanImage(members[1])}
            name={members[1].user?.id}
            shape='square'
            size={20}
          />
          <Avatar
            image={getCleanImage(members[2])}
            name={members[2].user?.id}
            shape='square'
            size={20}
          />
        </span>
      </div>
    );
  }

  if (members.length >= 4) {
    return (
      <div className='channel-preview__avatars'>
        <span>
          <Avatar
            image={getCleanImage(members[members.length - 1])}
            name={members[0].user?.id}
            shape='square'
            size={20}
          />
          <Avatar
            image={getCleanImage(members[members.length - 2])}
            name={members[1].user?.id}
            shape='square'
            size={20}
          />
        </span>
        <span>
          <Avatar
            image={getCleanImage(members[members.length - 3])}
            name={members[2].user?.id}
            shape='square'
            size={20}
          />
          <Avatar
            image={getCleanImage(members[members.length - 4])}
            name={members[3].user?.id}
            shape='square'
            size={20}
          />
        </span>
      </div>
    );
  }

  return null;
};

const getTimeStamp = (channel) => {
  let lastHours = channel.state.last_message_at?.getHours();
  let lastMinutes = channel.state.last_message_at?.getMinutes();
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

const getChannelName = (members) => {
  const defaultName = 'Johnny Blaze';

  if (!members.length || members.length === 1) {
    return members[0]?.user.name || defaultName;
  }

  return `${members[0]?.user.name || defaultName}, ${members[1]?.user.name || defaultName}`;
};

const MessagingChannelPreview = (props) => {
  const { channel, latestMessage, setActiveChannel, setIsCreating } = props;

  const { channel: activeChannel, client } = useContext(ChatContext);

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user.id !== client.userID,
  );

  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? 'channel-preview__container selected'
          : 'channel-preview__container'
      }
      onClick={() => {
        setIsCreating(false);
        setActiveChannel(channel);
      }}
    >
      {getAvatarGroup(members)}
      <div className='channel-preview__content-wrapper'>
        <div className='channel-preview__content-top'>
          <p className='channel-preview__content-name'>
            {channel.data.name || getChannelName(members)}
          </p>
          <p className='channel-preview__content-time'>{getTimeStamp(channel)}</p>
        </div>
        <p className='channel-preview__content-message'>{latestMessage || 'Send a message'}</p>
      </div>
    </div>
  );
};

export default MessagingChannelPreview;
