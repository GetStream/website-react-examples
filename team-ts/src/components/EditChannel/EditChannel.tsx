import { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import './EditChannel.css';

import { UserList } from '../CreateChannel/UserList';

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
      <input onChange={handleChange} placeholder='channel-name' type='text' value={channelName} />
      <p>Add Members</p>
    </div>
  );
};

type Props = {
  filters: ChannelFilters[];
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditChannel: React.FC<Props> = (props) => {
  const { filters, setIsEditing } = props;

  const { channel } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const [channelName, setChannelName] = useState<string>(
    channel?.data?.name || (channel?.data?.id as string),
  );
  const [selectedUsers, setSelectedUsers] = useState<string[] | undefined>();

  const updateChannel = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();

    const nameChanged = channelName !== (channel?.data?.name || channel?.data?.id);

    if (nameChanged) {
      await channel?.update(
        { name: channelName },
        { text: `Channel name changed to ${channelName}` },
      );
    }

    if (selectedUsers?.length) {
      const users = selectedUsers.map((user) => user);
      await channel?.addMembers(users);
    }

    setChannelName('');
    setIsEditing(false);
    setSelectedUsers(undefined);
  };

  return (
    <div className='edit-channel__container'>
      <div className='edit-channel__header'>
        <p>Edit Channel</p>
        <CloseCreateChannel {...{ setIsEditing }} />
      </div>
      <ChannelNameInput {...{ channelName, setChannelName }} />
      <UserList {...{ filters, setSelectedUsers }} />
      <div className='edit-channel__button-wrapper' onClick={updateChannel}>
        <p>Save Changes</p>
      </div>
    </div>
  );
};
