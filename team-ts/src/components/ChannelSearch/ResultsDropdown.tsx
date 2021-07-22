import { Avatar, useChatContext } from 'stream-chat-react';

import { channelByUser, ChannelOrUserType, isChannel } from './utils';

import type { Channel, UserResponse } from 'stream-chat';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

type SearchResultProps = Pick<ResultsDropdownProps, 'focusedId' | 'setChannel'> & {
  result: ChannelOrUserType;
};

const SearchResult: React.FC<SearchResultProps> = (props) => {
  const { focusedId, result, setChannel } = props;

  const { client, setActiveChannel } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  if (isChannel(result)) {
    const channel = result as Channel<
      TeamAttachmentType,
      TeamChannelType,
      TeamCommandType,
      TeamEventType,
      TeamMessageType,
      TeamReactionType,
      TeamUserType
    >;

    return (
      <div
        onClick={() => setChannel(channel)}
        className={
          focusedId === channel.id
            ? 'channel-search__result-container__focused'
            : 'channel-search__result-container'
        }
      >
        <div className='result-hashtag'>#</div>
        <p className='channel-search__result-text'>{channel?.data?.name}</p>
      </div>
    );
  } else {
    const user = result as UserResponse<TeamUserType>;

    return (
      <div
        onClick={async () => {
          channelByUser({ client, setActiveChannel, user });
        }}
        className={
          focusedId === user.id
            ? 'channel-search__result-container__focused'
            : 'channel-search__result-container'
        }
      >
        <div className='channel-search__result-user'>
          <Avatar image={user.image} name={user.name || user.id} size={24} />
          <p className='channel-search__result-text'>{user.name || user.id || 'Johnny Blaze'}</p>
        </div>
      </div>
    );
  }
};

type ResultsDropdownProps = {
  teamChannels?: Channel<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >[];
  directChannels?: UserResponse<TeamUserType>[];
  focusedId: string;
  loading: boolean;
  setChannel: (
    channel: Channel<
      TeamAttachmentType,
      TeamChannelType,
      TeamCommandType,
      TeamEventType,
      TeamMessageType,
      TeamReactionType,
      TeamUserType
    >,
  ) => void;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
};

export const ResultsDropdown: React.FC<ResultsDropdownProps> = (props) => {
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
        directChannels?.map((user: UserResponse<TeamUserType>, i) => (
          <SearchResult result={user} focusedId={focusedId} key={i} setChannel={setChannel} />
        ))
      )}
    </div>
  );
};
