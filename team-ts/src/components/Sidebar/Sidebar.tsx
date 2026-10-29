import { useEffect, useMemo, useRef } from 'react';
import {
  type ChannelListItemUIProps,
  useChatContext,
  useWorkspaceNavigation,
  WithComponents,
} from 'stream-chat-react';

import {
    EmptyDMChannelListIndicator,
    EmptyGroupChannelListIndicator
} from "./EmptyChannelListIndicator";
import { ChannelSearch } from '../ChannelSearch/ChannelSearch';
import { TeamChannelList } from '../TeamChannelList/TeamChannelList';
import { ChannelPreview } from '../ChannelPreview/ChannelPreview';

import { CompanyLogo } from './icons';

import { ChannelPaginator, type SortParamRequest } from 'stream-chat';

type ChannelType = 'team' | 'messaging';

const sort: SortParamRequest[] = [
  { field: 'last_message_at', direction: -1 },
  { field: 'updated_at', direction: -1 },
];

const FakeCompanySelectionBar = () => (
  <div className='sidebar__company-selection-bar'>
    <div className='sidebar__company-badge'>
        <CompanyLogo />
    </div>
  </div>
);

// One ChannelPaginator per list, registered with the ChannelManager so it receives WebSocket updates
const useChannelPaginator = (type: ChannelType) => {
  const { client } = useChatContext();
  const paginator = useMemo(
    () =>
      new ChannelPaginator({
        client,
        filters: { type, 'custom.demo': 'team' },
        id: `team:${type}`,
        paginatorOptions: { pageSize: 3 },
        requestOptions: { state: true, watch: true, presence: true },
        sort,
      }),
    [client, type],
  );

  useEffect(() => {
    client.channelManager.insertPaginator({ paginator });
    return () => {
      client.channelManager.removePaginator(paginator);
    };
  }, [client, paginator]);

  return paginator;
};

// v14's ChannelList opened its first channel on mount (setActiveChannelOnMount); v15 opens nothing
const useOpenFirstChannel = (paginator: ChannelPaginator) => {
  const { openChannel } = useWorkspaceNavigation();
  const opened = useRef(false);
  useEffect(
    () =>
      paginator.state.subscribeWithSelector(
        ({ items }) => ({ first: items?.[0] }),
        ({ first }) => {
          if (first && !opened.current) {
            opened.current = true;
            openChannel(first);
          }
        },
      ),
    [paginator, openChannel],
  );
};

const teamChannelsOverrides = {
  ChannelListItemUI: (previewProps: ChannelListItemUIProps) => (
    <ChannelPreview
      {...previewProps}
      type='team'
    />
  ),
};

const messagingChannelsOverrides = {
  ChannelListItemUI: (previewProps: ChannelListItemUIProps) => (
    <ChannelPreview
      {...previewProps}
      type='messaging'
    />
  ),
};

const TeamChannelsList = () => {
  const paginator = useChannelPaginator('team');
  useOpenFirstChannel(paginator);

  return (
    <WithComponents overrides={teamChannelsOverrides}>
      <TeamChannelList
        EmptyListIndicator={EmptyGroupChannelListIndicator}
        paginator={paginator}
        type='team'
      />
    </WithComponents>
  );
};

const MessagingChannelsList = () => {
  const paginator = useChannelPaginator('messaging');

  return (
    <WithComponents overrides={messagingChannelsOverrides}>
      <TeamChannelList
        EmptyListIndicator={EmptyDMChannelListIndicator}
        paginator={paginator}
        type='messaging'
      />
    </WithComponents>
  );
};

export const Sidebar = () => {
  return (
    <div className='sidebar'>
      <FakeCompanySelectionBar />
      <div className='channel-list-bar'>
        <div className='channel-list-bar__header'>
          <p className='channel-list-bar__header__text'>Worksly</p>
        </div>
        <ChannelSearch />
        <TeamChannelsList/>
        <MessagingChannelsList/>
      </div>
    </div>
  );
};
