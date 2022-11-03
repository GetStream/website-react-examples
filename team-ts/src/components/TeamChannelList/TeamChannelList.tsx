import React, { PropsWithChildren } from 'react';

import { AddChannel } from '../../assets';

import type { ChannelListMessengerProps } from 'stream-chat-react';

export type TeamChannelListProps = ChannelListMessengerProps & {
  setCreateType: React.Dispatch<React.SetStateAction<string>>;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
};

const ChannelList = (props: PropsWithChildren<TeamChannelListProps>) => {
  const {
    children,
    error = false,
    loading,
    setCreateType,
    setIsCreating,
    setIsEditing,
    type,
  } = props;

  if (error) {
    return type === 'team' ? (
      <div className='team-channel-list'>
        <p className='team-channel-list__message'>
          Connection error, please wait a moment and try again.
        </p>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className='team-channel-list'>
        <p className='team-channel-list__message loading'>
          {type === 'team' ? 'Channels' : 'Messages'} loading....
        </p>
      </div>
    );
  }

  return (
    <div className='team-channel-list'>
      <div className='team-channel-list__header'>
        <p className='team-channel-list__header__title'>
          {type === 'team' ? 'Channels' : 'Direct Messages'}
        </p>
        <AddChannel
          {...{ setCreateType, setIsCreating, setIsEditing }}
          type={type === 'team' ? 'team' : 'messaging'}
        />
      </div>
      {children}
    </div>
  );
};

export const TeamChannelList = React.memo(ChannelList);
