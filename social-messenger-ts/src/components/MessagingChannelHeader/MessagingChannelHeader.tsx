import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ChannelStateData } from 'stream-chat';
import { useChannel, useChatContext, useStateStore } from 'stream-chat-react';
import './MessagingChannelHeader.css';

import { TypingIndicator } from '../TypingIndicator/TypingIndicator';
import { ChannelInfoIcon, ChannelSaveIcon, HamburgerIcon } from '../../assets';
import { AvatarGroup } from '../';

type Props = {
  theme: string;
  toggleMobile: () => void;
};

const channelStateSelector = ({ data, members }: ChannelStateData) => ({ data, members });

const MessagingChannelHeader = (props: Props) => {
  const { theme, toggleMobile } = props;
  const { client } = useChatContext();
  const channel = useChannel();
  const { data, members: membersById } = useStateStore(channel.state, channelStateSelector);
  const savedChannelName = data?.custom?.name || '';
  const [channelName, setChannelName] = useState(savedChannelName);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Channel keeps this header mounted when the channel changes, so reset the local edit state
  useEffect(() => {
    setChannelName(savedChannelName);
    setIsEditing(false);
  }, [channel, savedChannelName]);

  const members = useMemo(
    () => Object.values(membersById).filter((member) => member.user?.id !== client?.user?.id),
    [client, membersById],
  );

  const title = useMemo(
    () =>
      members.map((member) => member.user?.name || member.user?.id || 'Unnamed User').join(', '),
    [members],
  );

  const updateChannel = async () => {
    if (channelName && channelName !== savedChannelName) {
      await channel.update({
        data: { custom: { ...data?.custom, name: channelName } },
        message: { text: `Channel name changed to ${channelName}` },
      });
    }

    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef?.current.focus();
    }
  }, [isEditing]);

  const EditHeader = () => (
    <form
      style={{ flex: 1 }}
      onSubmit={(event) => {
        event.preventDefault();
        inputRef?.current?.blur();
      }}
    >
      <input
        autoFocus
        className='channel-header__edit-input'
        onBlur={updateChannel}
        onChange={(event) => setChannelName(event.target.value)}
        placeholder='Type a new name for the chat'
        ref={inputRef}
        value={channelName}
      />
    </form>
  );

  return (
    <div className='messaging__channel-header'>
      <div id='mobile-nav-icon' className={`${theme}`} onClick={() => toggleMobile()}>
        <HamburgerIcon />
      </div>
      <AvatarGroup members={members} />
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
