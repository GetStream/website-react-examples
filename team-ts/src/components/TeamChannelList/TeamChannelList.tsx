import React, { useCallback } from 'react';
import type { ChannelPaginator } from 'stream-chat';
import { ChannelList, useChannelPaginatorState } from 'stream-chat-react';

import { AddChannelButton } from './AddChannelButton';

import { useWorkspaceController, Workspace } from '../../context/WorkspaceController';

import clsx from "clsx";

export type TeamChannelListProps = {
  paginator: ChannelPaginator;
  type: string;
};

const ChannelListSection = (props: TeamChannelListProps) => {
  const { paginator, type } = props;
  const { channels, isLoading, lastQueryError } = useChannelPaginatorState(paginator);

  const { displayWorkspace } = useWorkspaceController();

  const handleAddChannelClick = useCallback(() => {
    displayWorkspace(`Admin-Admin-Channel-Create__${type}` as Workspace);
  }, [type, displayWorkspace]);

  if (lastQueryError) {
    return type === 'team' ? (
      <div className='team-channel-list'>
        <p className='team-channel-list__message'>
          Connection error, please wait a moment and try again.
        </p>
      </div>
    ) : null;
  }

  if (isLoading && !channels) {
    return (
      <div className='team-channel-list'>
        <p className='team-channel-list__message loading'>
          {type === 'team' ? 'Channels' : 'Messages'} loading....
        </p>
      </div>
    );
  }

  return (
    <div className={clsx('team-channel-list', `team-channel-list--${type === 'team' ? 'group' : 'dm'}`)}>
      <div className='team-channel-list__header'>
        <p className='team-channel-list__header__title'>
          {type === 'team' ? 'Channels' : 'Direct Messages'}
        </p>
        <AddChannelButton onClick={handleAddChannelClick}
        />
      </div>
      <ChannelList paginator={paginator} />
    </div>
  );
};

export const TeamChannelList = React.memo(ChannelListSection);
