import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Avatar, useChatContext, useStateStore} from 'stream-chat-react';
import {SearchSourceState, UserResponse, UserSearchSource} from 'stream-chat';

import {XButton, XButtonBackground} from '../../assets';

import './CreateChannel.css';

const searchSourceStateSelector = (state: SearchSourceState<UserResponse>) => ({
  searchQuery: state.searchQuery,
  users: state.items,
})

const UserResult = ({ user }: { user: UserResponse }) => (
  <li className='messaging-create-channel__user-result'>
    <Avatar image={user.image} name={user.name} />
    {user.online && <div className='messaging-create-channel__user-result-online' />}
    <div className='messaging-create-channel__user-result__details'>
      <span>{user.name}</span>
    </div>
  </li>
);

type Props = {
  onClose: () => void;
  toggleMobile: () => void;
};

const CreateChannel = (props: Props) => {
  const { onClose, toggleMobile } = props;

  const { client, setActiveChannel } = useChatContext();

  const [focusedUser, setFocusedUser] = useState<number>();
  const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const searchSource = useMemo<UserSearchSource>(
    () => {
      const source = new UserSearchSource(client, {debounceMs: 100, pageSize: 6});
      source.activate();
      return source;
    },
    [client],
  );

  const {searchQuery, users} = useStateStore(searchSource.state, searchSourceStateSelector)

  const createChannel = async () => {
    const selectedUsersIds = selectedUsers.map((u) => u.id);

    if (!selectedUsersIds.length || !client.userID) return;

    const conversation = client.channel('messaging', {
      members: [...selectedUsersIds, client.userID],
    });

    await conversation.watch();

    setActiveChannel?.(conversation);
    setSelectedUsers([]);
    searchSource.resetStateAndActivate();
    onClose();
  };

  const addUser = useCallback((addedUser: UserResponse) => {
    setSelectedUsers((selected) => {
      const alreadyPresent = selected.find((user) => user.id === addedUser.id);
      if (alreadyPresent) return selected;
      inputRef.current?.focus();
      searchSource.resetStateAndActivate();
      return [...selected, addedUser]
    });
  }, [searchSource]);

  const removeUser =  useCallback((user: UserResponse) => {
    setSelectedUsers((selected) => {
      inputRef.current?.focus();
      return selected.filter((item) => item.id !== user.id);

    });
  }, []);

  // todo: where to activate searchSource?


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const users: UserResponse[] = searchSource.items ?? []
      // check for up(ArrowUp) or down(ArrowDown) key
      if (event.key === 'ArrowUp') {
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === 0 ? users.length - 1 : prevFocused - 1;
        });
      }
      if (event.key === 'ArrowDown') {
        setFocusedUser((prevFocused) => {
          if (prevFocused === undefined) return 0;
          return prevFocused === users.length - 1 ? 0 : prevFocused + 1;
        });
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        setFocusedUser((focuseUser) => {
          if (focuseUser) addUser(users[focuseUser]);
          return undefined
        });
      }
    }
    document.addEventListener('keydown', handleKeyDown, false);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [addUser, searchSource]);

  return (
    <div className='messaging-create-channel'>
      <header>
        <div className='messaging-create-channel__left'>
          <div className='messaging-create-channel__left-text'>To: </div>
          <div className='users-input-container'>
            {!!selectedUsers?.length && (
              <div className='messaging-create-channel__users'>
                {selectedUsers.map((user) => (
                  <div
                    className='messaging-create-channel__user'
                    onClick={() => removeUser(user)}
                    key={user.id}
                  >
                    <div className='messaging-create-channel__user-text'>{user.name}</div>
                    <XButton />
                  </div>
                ))}
              </div>
            )}
            <form>
              <input
                autoFocus
                ref={inputRef}
                value={searchQuery}
                onChange={(e) => searchSource.search(e.target.value)}
                placeholder={!selectedUsers.length ? 'Start typing for suggestions' : ''}
                type='text'
                className='messaging-create-channel__input'
              />
            </form>
          </div>
          <div className='close-mobile-create' onClick={() => toggleMobile()}>
            <XButtonBackground />
          </div>
        </div>
        <button className='create-channel-button' onClick={createChannel}>
          Start chat
        </button>
      </header>
      {searchQuery && (
        <main>
          <ul className='messaging-create-channel__user-results'>
            {!!users?.length ? (
              <div>
                {users.map((user, i) => (
                  <div
                    className={`messaging-create-channel__user-result ${
                      focusedUser === i && 'focused'
                    }`}
                    onClick={() => addUser(user)}
                    key={user.id}
                  >
                    <UserResult user={user} />
                  </div>
                ))}
              </div>
            ) : (
              <div
                onClick={() => {
                  inputRef.current?.focus();
                  searchSource.resetStateAndActivate();
                }}
                className='messaging-create-channel__user-result empty'
              >
                No people found...
              </div>
            )}
          </ul>
        </main>
      )}
    </div>
  );
};

export default React.memo(CreateChannel);
