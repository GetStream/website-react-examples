import {
  Avatar,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
} from 'stream-chat-react';

import './TeamChannelHeader.css';

import { ChannelInfo, PinIcon } from '../../assets';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

type Props = {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setPinsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TeamChannelHeader: React.FC<Props> = (props) => {
  const { setIsEditing, setPinsOpen } = props;

  const { client } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const { channel, watcher_count } = useChannelStateContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const { closeThread } = useChannelActionContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const teamHeader = `# ${channel?.data?.name || channel?.data?.id || 'random'}`;

  const getMessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user?.id !== client.userID,
    );
    const additionalMembers = members.length - 3;

    if (!members.length) {
      return (
        <div className='team-channel-header__name-wrapper'>
          <Avatar image={null} size={32} />
          <p className='team-channel-header__name user'>Johnny Blaze</p>
        </div>
      );
    }

    return (
      <div className='team-channel-header__name-wrapper'>
        {members.map(({ user }, i) => {
          if (i > 2) return null;
          return (
            <div key={i} className='team-channel-header__name-multi'>
              <Avatar image={user?.image} name={user?.name || user?.id} size={32} />
              <p className='team-channel-header__name user'>
                {user?.name || user?.id || 'Johnny Blaze'}
              </p>
            </div>
          );
        })}
        {additionalMembers > 0 && (
          <p className='team-channel-header__name user'>{`and ${additionalMembers} more`}</p>
        )}
      </div>
    );
  };

  const getWatcherText = (watchers?: number) => {
    if (!watchers) return 'No users online';
    if (watchers === 1) return '1 user online';
    return `${watchers} users online`;
  };

  return (
    <div className='team-channel-header__container'>
      {channel.type === 'messaging' ? (
        getMessagingHeader()
      ) : (
        <div className='team-channel-header__channel-wrapper'>
          <p className='team-channel-header__name'>{teamHeader}</p>
          <span style={{ display: 'flex' }} onClick={() => setIsEditing(true)}>
            <ChannelInfo />
          </span>
        </div>
      )}
      <div className='team-channel-header__right'>
        <p className='team-channel-header__right-text'>{getWatcherText(watcher_count)}</p>
        <div
          className='team-channel-header__right-pin-wrapper'
          onClick={(event) => {
            if (closeThread) closeThread(event);
            setPinsOpen((prevState) => !prevState);
          }}
        >
          <PinIcon />
          <p className='team-channel-header__right-text'>Pins</p>
        </div>
      </div>
    </div>
  );
};
