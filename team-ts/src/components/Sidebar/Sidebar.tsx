import { useEffect, useMemo, useRef } from 'react';
import {
  type ChannelFilters,
  ChannelPaginator,
  type ChannelPaginatorState,
  type SortParamRequest,
  type StreamChat,
} from 'stream-chat';
import {
  type ChannelListItemUIProps,
  useChatContext,
  useStateStore,
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

const filters: ChannelFilters[] = [
  { type: 'team', 'custom.demo': 'team' },
  { type: 'messaging', 'custom.demo': 'team' },
];
const requestOptions = { state: true, watch: true, presence: true };
const pageSize = 3;
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

const createPaginator = (client: StreamChat, id: string, filters: ChannelFilters) =>
  new ChannelPaginator({ client, filters, id, paginatorOptions: { pageSize }, requestOptions, sort });

/** Registers the paginator with the ChannelManager so it receives WebSocket updates. */
const useRegisteredPaginator = (id: string, filters: ChannelFilters) => {
  const { client } = useChatContext();
  const paginator = useMemo(() => createPaginator(client, id, filters), [client, id, filters]);

  useEffect(() => {
    client.channelManager.insertPaginator({ paginator });
    return () => {
      client.channelManager.removePaginator(paginator);
    };
  }, [client, paginator]);

  return paginator;
};

const firstChannelSelector = ({ items }: ChannelPaginatorState) => ({ firstChannel: items?.[0] });

/** stream-chat-react 14's ChannelList opened the first channel on mount; v15 leaves that to the app. */
const useOpenFirstChannel = (paginator: ChannelPaginator) => {
  const { openChannel, openChannels } = useWorkspaceNavigation();
  const { firstChannel } = useStateStore(paginator.state, firstChannelSelector);
  const opened = useRef(false);

  useEffect(() => {
    if (opened.current || !firstChannel) return;
    opened.current = true;
    if (!openChannels.length) openChannel(firstChannel);
  }, [firstChannel, openChannel, openChannels.length]);
};

const teamChannelsOverrides = {
  EmptyListIndicator: EmptyGroupChannelListIndicator,
  ChannelListItemUI: (previewProps: ChannelListItemUIProps) => (
    <ChannelPreview
      {...previewProps}
      type='team'
    />
  ),
};

const messagingChannelsOverrides = {
  EmptyListIndicator: EmptyDMChannelListIndicator,
  ChannelListItemUI: (previewProps: ChannelListItemUIProps) => (
    <ChannelPreview
      {...previewProps}
      type='messaging'
    />
  ),
};

const TeamChannelsList = () => {
  const paginator = useRegisteredPaginator('team-channels', filters[0]);
  useOpenFirstChannel(paginator);

  return (
    <WithComponents overrides={teamChannelsOverrides}>
      <TeamChannelList paginator={paginator} type='team' />
    </WithComponents>
  );
};

const MessagingChannelsList = () => {
  const paginator = useRegisteredPaginator('team-direct-messages', filters[1]);

  return (
    <WithComponents overrides={messagingChannelsOverrides}>
      <TeamChannelList paginator={paginator} type='messaging' />
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
