import { Avatar, ChannelPreviewUIComponentProps, useChatContext } from 'stream-chat-react';

import './TeamChannelPreview.css';

import { TeamTypingIndicator } from '../TeamTypingIndicator/TeamTypingIndicator';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

type Props = ChannelPreviewUIComponentProps & {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
};

export const TeamChannelPreview: React.FC<Props> = (props) => {
  const { channel, setActiveChannel, setIsCreating, setIsEditing, type } = props;

  const { channel: activeChannel, client } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const ChannelPreview = () => (
    <p className='channel-preview__item'>
      # {channel?.data?.name || channel?.data?.id || 'random'}
    </p>
  );

  const DirectPreview = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user?.id !== client.userID,
    );
    const defaultName = 'Johnny Blaze';

    if (!members.length || members.length === 1) {
      const member = members[0];
      return (
        <div className='channel-preview__item single'>
          <Avatar
            image={member.user?.image}
            name={member.user?.name || member.user?.id}
            size={24}
          />
          <p>{member?.user?.name || member?.user?.id || defaultName}</p>
          <TeamTypingIndicator type='list' />
        </div>
      );
    }

    return (
      <div className='channel-preview__item multi'>
        <span>
          <Avatar
            image={members[0].user?.image}
            name={members[0].user?.name || members[0].user?.id}
            size={18}
          />
        </span>
        <Avatar
          image={members[1].user?.image}
          name={members[1].user?.name || members[1].user?.id}
          size={18}
        />
        <p>
          {members[0].user?.name || members[0].user?.id || defaultName},{' '}
          {members[1].user?.name || members[1].user?.id || defaultName}
        </p>
      </div>
    );
  };

  return (
    <div
      className={
        channel?.id === activeChannel?.id
          ? 'channel-preview__wrapper__selected'
          : 'channel-preview__wrapper'
      }
      onClick={() => {
        setIsCreating(false);
        setIsEditing(false);
        if (setActiveChannel) {
          setActiveChannel(channel);
        }
      }}
    >
      {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
    </div>
  );
};
