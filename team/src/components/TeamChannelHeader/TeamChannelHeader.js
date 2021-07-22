import React from 'react';
import {
  Avatar,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
} from 'stream-chat-react';

import './TeamChannelHeader.css';

import { ChannelInfo, PinIcon } from '../../assets';

export const TeamChannelHeader = ({ setIsEditing, setPinsOpen }) => {
  const { client } = useChatContext();
  const { closeThread } = useChannelActionContext();
  const { channel, watcher_count } = useChannelStateContext();

  const teamHeader = `# ${channel.data.name || channel.data.id || 'random'}`;

  const getMessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID,
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
              <Avatar image={user.image} name={user.name || user.id} size={32} />
              <p className='team-channel-header__name user'>
                {user.name || user.id || 'Johnny Blaze'}
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

  const getWatcherText = (watchers) => {
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
          onClick={(e) => {
            closeThread(e);
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
