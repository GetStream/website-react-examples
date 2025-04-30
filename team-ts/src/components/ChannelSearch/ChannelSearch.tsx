import { useCallback, useEffect, useState } from 'react';

import type { Channel, UserResponse } from 'stream-chat';
import { useChatContext } from 'stream-chat-react';
import _debounce from 'lodash.debounce';

import { channelByUser, ChannelOrUserType, isChannel } from './utils';
import { ResultsDropdown } from './ResultsDropdown';

import { SearchIcon } from '../../assets';

export const ChannelSearch = () => {
  const { client, setActiveChannel } = useChatContext();

  const [allChannels, setAllChannels] = useState<ConcatArray<ChannelOrUserType> | undefined>();
  const [teamChannels, setTeamChannels] = useState<
    | Channel[]
    | undefined
  >();
  const [directChannels, setDirectChannels] = useState<UserResponse[] | undefined>();

  const [focused, setFocused] = useState<number>();
  const [focusedId, setFocusedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setFocused((prevFocused) => {
          if (prevFocused === undefined || allChannels === undefined) return 0;
          return prevFocused === allChannels.length - 1 ? 0 : prevFocused + 1;
        });
      } else if (event.key === 'ArrowUp') {
        setFocused((prevFocused) => {
          if (prevFocused === undefined || allChannels === undefined) return 0;
          return prevFocused === 0 ? allChannels.length - 1 : prevFocused - 1;
        });
      } else if (event.key === 'Enter') {
        event.preventDefault();

        if (allChannels !== undefined && focused !== undefined) {
          const channelToCheck = allChannels[focused];

          if (isChannel(channelToCheck)) {
            setActiveChannel(channelToCheck);
          } else {
            channelByUser({ client, setActiveChannel, user: channelToCheck });
          }
        }

        setFocused(undefined);
        setFocusedId('');
        setQuery('');
      }
    },
    [allChannels, client, focused, setActiveChannel], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (query) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, query]);

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  useEffect(() => {
    if (focused && focused >= 0 && allChannels) {
      setFocusedId(allChannels[focused].id || '');
    }
  }, [allChannels, focused]);

  const setChannel = (
    channel: Channel,
  ) => {
    setQuery('');
    setActiveChannel(channel);
  };

  const getChannels = async (text: string) => {
    try {
      const channelResponse = client.queryChannels(
        {
          type: 'team',
          name: { $autocomplete: text },
        },
        {},
        { limit: 5 },
      );

      const userResponse = client.queryUsers(
        { name: { $autocomplete: text } },
        { id: 1 },
        { limit: 5 },
      );

      const [channels, { users }] = await Promise.all([channelResponse, userResponse]);
      const otherUsers = users.filter((user) => user.id !== client.userID);
      if (channels.length) setTeamChannels(channels);
      if (otherUsers.length) setDirectChannels(otherUsers);
      setAllChannels([...channels, ...otherUsers]);
    } catch (event) {
      setQuery('');
    }

    setLoading(false);
  };

  const getChannelsDebounce = _debounce(getChannels, 100, {
    trailing: true,
  });

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    setLoading(true);
    setFocused(undefined);
    setQuery(event.target.value);
    if (!event.target.value) return;

    getChannelsDebounce(event.target.value);
  };

  return (
    <div className='channel-search__container'>
      <div className='channel-search__input__wrapper'>
        <div className='channel-search__input__icon'>
          <SearchIcon />
        </div>
        <input
          onChange={onSearch}
          placeholder='Search'
          type='text'
          value={query}
        />
      </div>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          focusedId={focusedId}
          loading={loading}
          setChannel={setChannel}
          setQuery={setQuery}
        />
      )}
    </div>
  );
};
