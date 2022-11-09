import { ChannelList } from 'stream-chat-react';

import { ChannelSearch } from '../ChannelSearch/ChannelSearch';
import { TeamChannelList } from '../TeamChannelList/TeamChannelList';
import { ChannelPreview } from '../ChannelPreview/ChannelPreview';

import { CompanyLogo } from './icons';

import type { Channel, ChannelFilters } from 'stream-chat';
import { ChannelSort } from 'stream-chat';

import { StreamChatType } from '../../types';

const filters: ChannelFilters[] = [
  { type: 'team', demo: 'team' },
  { type: 'messaging', demo: 'team' },
];
const options = { state: true, watch: true, presence: true, limit: 3 };
const sort: ChannelSort<StreamChatType> = { last_message_at: -1, updated_at: -1 };

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

const TeamChannelsList = () => (
  <ChannelList
    channelRenderFilterFn={customChannelTeamFilter}
    filters={filters[0]}
    options={options}
    sort={sort}
    List={(listProps) => (
      <TeamChannelList
        {...listProps}
        type='team'
      />
    )}
    Preview={(previewProps) => (
      <ChannelPreview
        {...previewProps}
        type='team'
      />
    )}
  />
);

const MessagingChannelsList = () => (
  <ChannelList
    channelRenderFilterFn={customChannelMessagingFilter}
    filters={filters[1]}
    options={options}
    sort={sort}
    setActiveChannelOnMount={false}
    List={(listProps) => (
      <TeamChannelList
        {...listProps}
        type='messaging'
      />
    )}
    Preview={(previewProps) => (
      <ChannelPreview
        {...previewProps}
        type='messaging'
      />
    )}
  />
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
