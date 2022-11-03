import { Avatar, ChannelPreviewUIComponentProps, useChatContext } from 'stream-chat-react';

import { TeamTypingIndicator } from '../TeamTypingIndicator/TeamTypingIndicator';

import type { StreamChatType } from '../../types';

type TeamChannelPreviewProps = ChannelPreviewUIComponentProps<StreamChatType> & {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
};

export const TeamChannelPreview = (props: TeamChannelPreviewProps) => {
  const { channel, setActiveChannel, setIsCreating, setIsEditing, type } = props;

  const { channel: activeChannel, client } = useChatContext<StreamChatType>();

  const ChannelPreview = () => (
    <p className='channel-preview__item'>
      {`# ${channel?.data?.name || channel?.data?.id || 'random'}`}
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
