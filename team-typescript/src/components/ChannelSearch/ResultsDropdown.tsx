import { Avatar, useChatContext } from 'stream-chat-react';
import type { Channel, ChannelFilters, UserResponse } from 'stream-chat';

import type { TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType } from '../../App';

type ResultsDropdownProps = {
  teamChannels?: Channel<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>[];
  directChannels?: UserResponse<TeamUserType>[];
  focusedId: string;
  loading: boolean;
  setChannel: (channel: Channel<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType> | UserResponse<TeamUserType>) => void
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

type SearchResultProps = Pick<ResultsDropdownProps, 'focusedId' | 'setChannel'> & {
  channel: Channel<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType> | UserResponse<TeamUserType>;
  type: string;
}

const SearchResult = (props: SearchResultProps) => {
  const { channel, focusedId, setChannel, type } = props;
  const { client, setActiveChannel } = useChatContext<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>();

  if (type === 'channel') {
    return (
      <div
        onClick={() => setChannel(channel)}
        className={focusedId === channel.id ? 'channel-search__result-container__focused' : 'channel-search__result-container'}
      >
        <div className='result-hashtag'>#</div>
        <p className='channel-search__result-text'>{channel.data.name}</p>
      </div>
    );
  }

  return (
    <div
      onClick={async () => {
        const filters: ChannelFilters = {
          type: 'messaging',
          member_count: 2,
          members: { $eq: [channel.id as string, client.userID || ''] },
        };

        const [existingChannel] = await client.queryChannels(filters);

        if (existingChannel) {
          return setActiveChannel(existingChannel);
        }

        const newChannel = client.channel('messaging', {
          members: [channel.id as string, client.userID || ''],
        });

        return setActiveChannel(newChannel);
      }}
      className={focusedId === channel.id ? 'channel-search__result-container__focused' : 'channel-search__result-container'}
    >
      <div className='channel-search__result-user'>
        <Avatar image={undefined} size={24} />     
        <p className='channel-search__result-text'>{channel.name || channel.id || 'Johnny Blaze'}</p>
      </div>
    </div>
  );
};

export const ResultsDropdown = (props: ResultsDropdownProps) => {
  const { teamChannels, directChannels, focusedId, loading, setChannel, setQuery } = props;
  document.addEventListener('click', () => setQuery(''));

  return (
    <div className='channel-search__results'>
      <p className='channel-search__results-header'>Channels</p>
      {loading && !teamChannels?.length && (
        <p className='channel-search__results-header'>
          <i>Loading...</i>
        </p>
      )}
      {!loading && !teamChannels?.length ? (
        <p className='channel-search__results-header'>
          <i>No channels found</i>
        </p>
      ) : (
        teamChannels?.map((channel, i) => (
          <SearchResult channel={channel} focusedId={focusedId} key={i} setChannel={setChannel} type='channel' />
        ))
      )}
      <p className='channel-search__results-header'>Users</p>
      {loading && !directChannels?.length && (
        <p className='channel-search__results-header'>
          <i>Loading...</i>
        </p>
      )}
      {!loading && !directChannels?.length ? (
        <p className='channel-search__results-header'>
          <i>No direct messages found</i>
        </p>
      ) : (
        directChannels?.map((channel, i) => (
          <SearchResult channel={channel} focusedId={focusedId} key={i} setChannel={setChannel} type='user' />
        ))
      )}
    </div>
  );
};