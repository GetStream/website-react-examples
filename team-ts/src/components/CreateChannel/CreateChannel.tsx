import { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import './CreateChannel.css';

import { UserList } from './UserList';

import { CloseCreateChannel } from '../../assets';

import type { ChannelFilters } from 'stream-chat';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

type InputProps = {
  channelName: string;
  setChannelName: (value: React.SetStateAction<string>) => void;
};

const ChannelNameInput: React.FC<InputProps> = (props) => {
  const { channelName = '', setChannelName } = props;
  const handleChange = (event: { preventDefault: () => void; target: { value: string } }) => {
    event.preventDefault();
    setChannelName(event.target.value);
  };

  return (
    <div className='channel-name-input__wrapper'>
      <p>Name</p>
      <input
        onChange={handleChange}
        placeholder='channel-name (no spaces)'
        type='text'
        value={channelName}
      />
      <p>Add Members</p>
    </div>
  );
};

type Props = {
  createType: string;
  filters: ChannelFilters[];
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateChannel: React.FC<Props> = (props) => {
  const { createType, filters, setIsCreating } = props;

  const { client, setActiveChannel } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[] | undefined>([client.userID || '']);

  const createChannel = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!selectedUsers?.length) return;

    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName,
        members: selectedUsers,
        demo: 'team',
      });

      await newChannel.watch();

      setChannelName('');
      setIsCreating(false);
      setSelectedUsers([client.userID || '']);
      setActiveChannel(newChannel);
    } catch (err) {
      console.log(err);
    }
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
