import React, { useContext, useEffect, useRef, useState } from 'react';
import { Avatar, ChannelContext } from 'stream-chat-react';

import './MessagingChannelHeader.css';

import { TypingIndicator } from '../TypingIndicator/TypingIndicator';

import { ChannelEditIcon } from '../../assets';

const getAvatarGroup = (members) => {
  if (members.length === 1) {
    return (
      <div className="messaging__channel-header__avatars">
        <Avatar image={members[0]?.user.image || undefined} size={40} />;
      </div>
    );
  }

  if (members.length === 2) {
    return (
      <div className="messaging__channel-header__avatars two">
        <span>
          <Avatar
            image={members[0]?.user.image || undefined}
            shape="square"
            size={40}
          />
        </span>
        <span>
          <Avatar
            image={members[1]?.user.image || undefined}
            shape="square"
            size={40}
          />
        </span>
      </div>
    );
  }

  if (members.length === 3) {
    return (
      <div className="messaging__channel-header__avatars three">
        <span>
          <Avatar
            image={members[0]?.user.image || undefined}
            shape="square"
            size={40}
          />
        </span>
        <span>
          <Avatar
            image={members[1]?.user.image || undefined}
            shape="square"
            size={20}
          />
          <Avatar
            image={members[2]?.user.image || undefined}
            shape="square"
            size={20}
          />
        </span>
      </div>
    );
  }

  if (members.length >= 4) {
    return (
      <div className="messaging__channel-header__avatars four">
        <span>
          <Avatar
            image={members[0]?.user.image || undefined}
            shape="square"
            size={20}
          />
          <Avatar
            image={members[1]?.user.image || undefined}
            shape="square"
            size={20}
          />
        </span>
        <span>
          <Avatar
            image={members[2]?.user.image || undefined}
            shape="square"
            size={20}
          />
          <Avatar
            image={members[3]?.user.image || undefined}
            shape="square"
            size={20}
          />
        </span>
      </div>
    );
  }

  return null;
};

const MessagingChannelHeader = () => {
  const { channel, client } = useContext(ChannelContext);

  const [channelName, setChannelName] = useState(channel?.data.name || '');
  const [edited, setEdited] = useState(false);
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

    setEdited(true);
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
        members
          .map(
            (member) => member.user?.name || member.user?.id || 'Unnamed User',
          )
          .join(', '),
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
        className="channel-header__edit-input"
        onBlur={updateChannel}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="Type a new name for the chat"
        ref={inputRef}
        value={channelName}
      />
    </form>
  );

  return (
    <div className="messaging__channel-header">
      {getAvatarGroup(members)}
      {!isEditing ? (
        <div className="channel-header__name">{channelName || title}</div>
      ) : (
        <EditHeader />
      )}
      <div className="messaging__channel-header__right">
        <TypingIndicator />
        <div
          onClick={() => {
            if (edited || isEditing) {
              setIsEditing(false);
              setEdited(false);
            } else {
              setIsEditing(true);
            }
          }}
        >
          <ChannelEditIcon />
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessagingChannelHeader);
