import { useState } from 'react';

import type { ChannelFilters } from 'stream-chat';
import { Channel, useChatContext } from 'stream-chat-react';

import './ChannelContainer.css';

import { ChannelInner } from './ChannelInner';

import { CreateChannel } from '../CreateChannel/CreateChannel';
import { EditChannel } from '../EditChannel/EditChannel';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

type ChannelContainerProps = {
  createType: string;
  isCreating: boolean;
  isEditing?: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChannelContainer: React.FC<ChannelContainerProps> = (props) => {
  const { createType, isCreating, isEditing, setIsCreating, setIsEditing } = props;

  const { channel } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const [pinsOpen, setPinsOpen] = useState(false);

  if (isCreating) {
    const filters: ChannelFilters[] = [];

    return (
      <div className='channel__container'>
        <CreateChannel {...{ createType, filters, setIsCreating }} />
      </div>
    );
  }

  if (isEditing) {
    const filters: ChannelFilters[] = [];

    if (channel?.state?.members) {
      const channelMembers = Object.keys(channel.state.members);
      if (channelMembers.length) {
        // @ts-expect-error
        filters.id = { $nin: channelMembers };
      }
    }

    return (
      <div className='channel__container'>
        <EditChannel {...{ filters, setIsEditing }} />
      </div>
    );
  }

  return (
    <div className='channel__container'>
      <Channel>
        <ChannelInner
          {...{
            pinsOpen,
            setIsEditing,
            setPinsOpen,
          }}
        />
      </Channel>
    </div>
  );
};
