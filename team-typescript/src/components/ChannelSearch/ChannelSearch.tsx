import { useCallback, useEffect, useState } from 'react';

import type { Channel, ChannelFilters, UserResponse } from 'stream-chat';
import { useChatContext } from 'stream-chat-react';
import _debounce from 'lodash.debounce';

import './ChannelSearch.css';

import { isChannel } from './utils';
import { ResultsDropdown } from './ResultsDropdown';

import { SearchIcon } from '../../assets';
import type { TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType } from '../../App';

export const ChannelSearch = () => {
  const { client, setActiveChannel } = useChatContext<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>();

  const [allChannels, setAllChannels] = useState<(ConcatArray<Channel<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType> | UserResponse<TeamUserType>>) | undefined>();
  const [teamChannels, setTeamChannels] = useState<Channel<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>[] | undefined>();
  const [directChannels, setDirectChannels] = useState<UserResponse<TeamUserType>[] | undefined>();

  const [focused, setFocused] = useState<number>();
  const [focusedId, setFocusedId] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const channelByUser = async (user: UserResponse<TeamUserType>)=> {
    const filters: ChannelFilters = {
      type: 'messaging',
      member_count: 2,
      members: { $eq: [user.id as string, client.userID || ''] },
    };

    const [existingChannel] = await client.queryChannels(filters);

    if (existingChannel) {
      return setActiveChannel(existingChannel);
    }

    const newChannel = client.channel('messaging', {
      members: [user.id as string, client.userID || ''],
    });
    return setActiveChannel(newChannel);
  }

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
            channelByUser(channelToCheck);
          }
        }

        setFocused(undefined);
        setFocusedId('');
        setQuery('');
      }
    },
    [allChannels, focused, setActiveChannel], // eslint-disable-line react-hooks/exhaustive-deps
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
    if ((focused && focused >= 0) && allChannels) {
      setFocusedId(allChannels[focused].id || '');
    }
  }, [allChannels, focused]);

  const setChannel = (channel: Channel<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>) => {
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
        {
          id: { $ne: client.userID || '' },
          $and: [{ name: { $autocomplete: text } }, { name: { $nin: ['Daniel Smith', 'Kevin Rosen', 'Jen Alexander'] } }],
        },
        { id: 1 },
        { limit: 5 },
      );

      const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

      if (channels.length) setTeamChannels(channels);
      if (users.length) setDirectChannels(users);
      setAllChannels([...channels, ...users]);
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
        <input className='channel-search__input__text' onChange={onSearch} placeholder='Search' type='text' value={query} />
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