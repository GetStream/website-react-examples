import clsx from 'clsx';
import { Avatar, useChatContext } from 'stream-chat-react';

import { channelByUser, ChannelOrUserType, isChannel } from './utils';

import type { Channel, UserResponse } from 'stream-chat';

type SearchResultProps = Pick<ResultsDropdownProps, 'focusedId' | 'setChannel'> & {
  result: ChannelOrUserType;
};

const SearchResult = (props: SearchResultProps) => {
  const { focusedId, result, setChannel } = props;

  const { client, setActiveChannel } = useChatContext();

  if (isChannel(result)) {
    const channel = result as Channel;

    return (
      <div
        onClick={() => setChannel(channel)}
        className={clsx(
          'channel-search__result-container',
          {highlighted: focusedId === channel.id}
        )}
      >
        <div className='result-hashtag'>#</div>
        <p className='channel-search__result-text'>{channel?.data?.name}</p>
      </div>
    );
  } else {
    const user = result as UserResponse;

    return (
      <div
        onClick={() => {
          channelByUser({ client, setActiveChannel, user });
        }}
        className={clsx(
          'channel-search__result-container',
          {highlighted: focusedId === user.id}
        )}
      >
          <Avatar image={user.image} name={user.name || user.id} />
          <p className='channel-search__result-text'>{user.name || user.id || 'Johnny Blaze'}</p>
      </div>
    );
  }
};

type ResultsDropdownProps = {
  teamChannels?: Channel[];
  directChannels?: UserResponse[];
  focusedId: string;
  loading: boolean;
  setChannel: (
    channel: Channel,
  ) => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
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
          <SearchResult result={channel} focusedId={focusedId} key={i} setChannel={setChannel} />
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
        directChannels?.map((user: UserResponse, i) => (
          <SearchResult result={user} focusedId={focusedId} key={i} setChannel={setChannel} />
        ))
      )}
    </div>
  );
};
