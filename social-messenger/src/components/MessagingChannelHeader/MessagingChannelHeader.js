import React, { useEffect, useRef, useState } from 'react';
import { Avatar, useChannelStateContext } from 'stream-chat-react';

import './MessagingChannelHeader.css';

import { TypingIndicator } from '../TypingIndicator/TypingIndicator';

import { ChannelInfoIcon, ChannelSaveIcon, getCleanImage, HamburgerIcon } from '../../assets';

const getAvatarGroup = (members) => {
  if (members.length === 1) {
    return (
      <div className='messaging__channel-header__avatars'>
        <Avatar image={getCleanImage(members[0])} size={40} />;
      </div>
    );
  }

  if (members.length === 2) {
    return (
      <div className='messaging__channel-header__avatars two'>
        <span>
          <Avatar image={getCleanImage(members[0])} shape='square' size={40} />
        </span>
        <span>
          <Avatar image={getCleanImage(members[1])} shape='square' size={40} />
        </span>
      </div>
    );
  }

  if (members.length === 3) {
    return (
      <div className='messaging__channel-header__avatars three'>
        <span>
          <Avatar image={getCleanImage(members[0])} shape='square' size={40} />
        </span>
        <span>
          <Avatar image={getCleanImage(members[1])} shape='square' size={20} />
          <Avatar image={getCleanImage(members[2])} shape='square' size={20} />
        </span>
      </div>
    );
  }

  if (members.length >= 4) {
    return (
      <div className='messaging__channel-header__avatars four'>
        <span>
          <Avatar image={getCleanImage(members[members.length - 1])} shape='square' size={20} />
          <Avatar image={getCleanImage(members[members.length - 2])} shape='square' size={20} />
        </span>
        <span>
          <Avatar image={getCleanImage(members[members.length - 3])} shape='square' size={20} />
          <Avatar image={getCleanImage(members[members.length - 4])} shape='square' size={20} />
        </span>
      </div>
    );
  }

  return null;
};

const MessagingChannelHeader = (props) => {
  const { channel, client } = useChannelStateContext();

  const [channelName, setChannelName] = useState(channel?.data.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  const inputRef = useRef();

  const members = Object.values(channel.state?.members || {}).filter(
    (member) => member.user?.id !== client?.user?.id,
  );

  const updateChannel = async (e) => {
    if (e) e.preventDefault();

    if (channelName && channelName !== channel.data.name) {
      await channel.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` },
      );
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!channelName) {
      setTitle(
        members.map((member) => member.user?.name || member.user?.id || 'Unnamed User').join(', '),
      );
    }
  }, [channelName, members]);

  const EditHeader = () => (
    <form
      style={{ flex: 1 }}
      onSubmit={(e) => {
        e.preventDefault();
        inputRef.current.blur();
      }}
    >
      <input
        autoFocus
        className='channel-header__edit-input'
        onBlur={updateChannel}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder='Type a new name for the chat'
        ref={inputRef}
        value={channelName}
      />
    </form>
  );

  return (
    <div className='messaging__channel-header'>
      <div id='mobile-nav-icon' className={`${props.theme}`} onClick={() => props.toggleMobile()}>
        <HamburgerIcon />
      </div>
      {getAvatarGroup(members)}
      {!isEditing ? (
        <div className='channel-header__name'>{channelName || title}</div>
      ) : (
        <EditHeader />
      )}
      <div className='messaging__channel-header__right'>
        <TypingIndicator />
        {channelName !== 'Social Demo' &&
          (!isEditing ? <ChannelInfoIcon {...{ isEditing, setIsEditing }} /> : <ChannelSaveIcon />)}
      </div>
    </div>
  );
};

export default React.memo(MessagingChannelHeader);
