import {
  ChannelList,
  type ChannelListItemUIProps,
  type ChannelListUIProps,
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

import type { Channel, ChannelFilters } from 'stream-chat';
import { ChannelSort } from 'stream-chat';



const filters: ChannelFilters[] = [
  { type: 'team', demo: 'team' },
  { type: 'messaging', demo: 'team' },
];
const options = { state: true, watch: true, presence: true, limit: 3 };
const sort: ChannelSort = { last_message_at: -1, updated_at: -1 };

const FakeCompanySelectionBar = () => (
  <div className='sidebar__company-selection-bar'>
    <div className='sidebar__company-badge'>
        <CompanyLogo />
    </div>
  </div>
);

const customChannelTeamFilter = (channels: Channel[]) => {
  return channels.filter((channel) => channel.type === 'team');
};

const customChannelMessagingFilter = (channels: Channel[]) => {
  return channels.filter((channel) => channel.type === 'messaging');
};

const teamChannelsOverrides = {
  ChannelListUI: (listProps: ChannelListUIProps) => (
    <TeamChannelList
      {...listProps}
      type='team'
    />
  ),
  ChannelListItemUI: (previewProps: ChannelListItemUIProps) => (
    <ChannelPreview
      {...previewProps}
      type='team'
    />
  ),
};

const messagingChannelsOverrides = {
  ChannelListUI: (listProps: ChannelListUIProps) => (
    <TeamChannelList
      {...listProps}
      type='messaging'
    />
  ),
  ChannelListItemUI: (previewProps: ChannelListItemUIProps) => (
    <ChannelPreview
      {...previewProps}
      type='messaging'
    />
  ),
};

const TeamChannelsList = () => (
  <WithComponents overrides={teamChannelsOverrides}>
    <ChannelList
      channelRenderFilterFn={customChannelTeamFilter}
      filters={filters[0]}
      options={options}
      sort={sort}
      EmptyStateIndicator={EmptyGroupChannelListIndicator}
    />
  </WithComponents>
);

const MessagingChannelsList = () => (
  <WithComponents overrides={messagingChannelsOverrides}>
    <ChannelList
      channelRenderFilterFn={customChannelMessagingFilter}
      filters={filters[1]}
      options={options}
      sort={sort}
      setActiveChannelOnMount={false}
      EmptyStateIndicator={EmptyDMChannelListIndicator}
    />
  </WithComponents>
)

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
