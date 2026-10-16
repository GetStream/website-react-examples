import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Channel, SearchSourceState, UserResponse, UserSearchSource } from 'stream-chat';
import { useChatContext, useStateStore, useTranslationContext } from 'stream-chat-react';

import { SkeletonLoader } from './DMChannelList';
import { SearchResult } from './SearchResult';

import { ClearSearchButton, CloseX, SearchIcon } from '../../assets';


type ParticipantSearchProps = {
  setDmChannel: React.Dispatch<React.SetStateAction<Channel | undefined>>;
  setParticipantProfile: React.Dispatch<React.SetStateAction<UserResponse | undefined>>;
  setSearching: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchLoading: React.FC = () => <div className='search-loading'>Loading participants...</div>;
const SearchEmpty: React.FC = () => <div className='search-empty'>No participants found</div>;

const searchSourceStateSelector = (state: SearchSourceState<UserResponse>) => ({
  isLoading: state.isLoading,
  searchQuery: state.searchQuery,
  users: state.items,
});

export const ParticipantSearch = (props: ParticipantSearchProps) => {
  const { setParticipantProfile, setSearching } = props;

  const { client } = useChatContext();
  const { t } = useTranslationContext();

  const [participants, setParticipants] = useState<UserResponse[]>();
  const [querying, setQuerying] = useState(false);

  // stream-chat-react 14 dropped ChannelSearch; this searches users the way it did
  const searchSource = useMemo(() => {
    const source = new UserSearchSource(client, { debounceMs: 300, pageSize: 20 });
    source.activate();
    return source;
  }, [client]);
  const { isLoading, searchQuery, users } = useStateStore(
    searchSource.state,
    searchSourceStateSelector,
  );
  const showingSearchResults = !!searchQuery;

  useEffect(() => {
    const getParticipants = async () => {
      if (querying) return;
      setQuerying(true);

      try {
        const { users } = await client.queryUsers(
          { },
          { id: 1, last_active: -1 },
          { limit: 10 },
        );
        const otherParticipants = users.filter((user) => user.id !== client.userID);
        if (otherParticipants.length) setParticipants(otherParticipants);
      } catch (err) {
        console.log(err);
      }

      setQuerying(false);
    };

    getParticipants();
  }, []); // eslint-disable-line

  const handleSelectResult = (result: UserResponse) => {
    setParticipantProfile(result);
    setSearching(false);
  };

  return (
    <div className='search'>
      <div className='search-header'>
        <div className='search-header-close' onClick={() => setSearching(false)}>
          <CloseX />
        </div>
        <div className='search-header-title'>Participants</div>
      </div>
      <div className='str-chat__channel-search'>
        <div className='str-chat__channel-search-bar'>
          <div
            className={clsx(
              'str-chat__channel-search-input--wrapper',
              searchQuery && 'str-chat__channel-search-input--wrapper-active',
            )}
          >
            <div className='str-chat__channel-search-input--icon'>
              <SearchIcon />
            </div>
            <input
              className='str-chat__channel-search-input'
              onChange={(event) => searchSource.search(event.target.value)}
              placeholder={t('Search')}
              type='text'
              value={searchQuery}
            />
            <button
              className='str-chat__channel-search-input--clear-button'
              disabled={!searchQuery}
              onClick={() => searchSource.resetStateAndActivate()}
            >
              <ClearSearchButton />
            </button>
          </div>
        </div>
        {showingSearchResults && (
          <div className='str-chat__channel-search-result-list'>
            {isLoading ? (
              <SearchLoading />
            ) : users?.length ? (
              users.map((user, i) => (
                <SearchResult
                  index={i}
                  key={user.id}
                  result={user}
                  selectResult={handleSelectResult}
                />
              ))
            ) : (
              <SearchEmpty />
            )}
          </div>
        )}
      </div>
      {querying ? (
        <SkeletonLoader />
      ) : showingSearchResults ? null : (
        participants?.length && (
          <div className='.str-chat__channel-search-result-list'>
            {participants.map((participant, i) => (
              <SearchResult
                index={i}
                key={i}
                result={participant}
                selectResult={handleSelectResult}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};
