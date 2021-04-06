import React, { useState } from 'react';
import type { ChannelFilters } from 'stream-chat';
import { useChatContext } from 'stream-chat-react';

import './CreateChannel.css';

import { UserList } from './UserList';

import { CloseCreateChannel } from '../../assets';
import type { TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType } from '../../App';

type CreateChannelProps = {
  createType: string;
  filters: ChannelFilters[];
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}

type ChannelNameInputProps = {
  channelName: string;
  setChannelName: (value: React.SetStateAction<string>) => void;
}

const ChannelNameInput = (props: ChannelNameInputProps) => {
  const { channelName = '', setChannelName } = props;
  const handleChange = (event: { preventDefault: () => void; target: { value: string; }; }) => {
    event.preventDefault();
    setChannelName(event.target.value);
  };

  return (
    <div className='channel-name-input__wrapper'>
      <p>Name</p>
      <input onChange={handleChange} placeholder='channel-name' type='text' value={channelName} />
      <p>Add Members</p>
    </div>
  );
};

export const CreateChannel = (props: CreateChannelProps) => {
  const { createType, filters, setIsCreating } = props;
  const { client, setActiveChannel } = useChatContext<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>();

  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[] | undefined>([client.userID || '']);

  const createChannel = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (!selectedUsers?.length) return;

    const newChannel = await client.channel(createType, channelName, {
      name: channelName,
      members: selectedUsers,
    });

    await newChannel.watch();

    setChannelName('');
    setIsCreating(false);
    setSelectedUsers([client.userID || '']);
    setActiveChannel(newChannel);
  };

  return (
    <div className='create-channel__container'>
      <div className='create-channel__header'>
        <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
        <CloseCreateChannel {...{ setIsCreating }} />
      </div>
      {createType === 'team' && <ChannelNameInput {...{ channelName, setChannelName }} />}
      <UserList {...{ filters, setSelectedUsers }} />
      <div className='create-channel__button-wrapper' onClick={createChannel}>
        <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
      </div>
    </div>
  );
};