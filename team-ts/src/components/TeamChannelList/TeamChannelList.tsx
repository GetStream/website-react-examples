import React, { useCallback } from 'react';

import { AddChannelButton } from './AddChannelButton';

import { useWorkspaceController, Workspace } from '../../context/WorkspaceController';

import type { ChannelPaginator } from 'stream-chat';
import { ChannelList, useChannelPaginatorState, WithComponents } from 'stream-chat-react';
import clsx from "clsx";

export type TeamChannelListProps = {
  EmptyListIndicator: React.ComponentType;
  paginator: ChannelPaginator;
  type: string;
};

// stream-chat-react 15 removed the ChannelListUI slot, so the section wraps the list instead
const ChannelListSection = (props: TeamChannelListProps) => {
  const {
    EmptyListIndicator,
    paginator,
    type,
  } = props;

  const { displayWorkspace } = useWorkspaceController();
  const { lastQueryError } = useChannelPaginatorState(paginator);

  const handleAddChannelClick = useCallback(() => {
    displayWorkspace(`Admin-Admin-Channel-Create__${type}` as Workspace);
  }, [type, displayWorkspace]);

  const FirstPageLoadingIndicator = useCallback(() => (
    <div className='team-channel-list'>
      <p className='team-channel-list__message loading'>
        {type === 'team' ? 'Channels' : 'Messages'} loading....
      </p>
    </div>
  ), [type]);

  if (lastQueryError) {
    return type === 'team' ? (
      <div className='team-channel-list'>
        <p className='team-channel-list__message'>
          Connection error, please wait a moment and try again.
        </p>
      </div>
    ) : null;
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
      <WithComponents overrides={{ EmptyListIndicator, FirstPageLoadingIndicator }}>
        <ChannelList paginator={paginator} />
      </WithComponents>
    </div>
  );
};

export const TeamChannelList = React.memo(ChannelListSection);
