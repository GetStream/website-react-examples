import React, { useContext, useEffect, useRef, useState } from 'react';
import { Avatar, ChatContext } from 'stream-chat-react';
import _debounce from 'lodash.debounce';

import { XButton } from '../../assets';

import './CreateChannel.css';

const CreateChannel = ({ onClose, visible }) => {
  const { client, setActiveChannel } = useContext(ChatContext);

  const [inputText, setInputText] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const inputRef = useRef();

  document.addEventListener('click', () => {
    if (resultsOpen) setInputText('');
  });

  const findUsers = async () => {
    if (searching) return;
    setSearching(true);

    try {
      const response = await client.queryUsers(
        {
          name: { $autocomplete: inputText },
        },
        { id: 1 },
        { limit: 6 },
      );

      setResultsOpen(true);
      setUsers(response.users);
    } catch (error) {
      console.log({ error });
    }

    setSearching(false);
  };

  const findUsersDebounce = _debounce(findUsers, 100, {
    trailing: true,
  });

  useEffect(() => {
    if (inputText) {
      findUsersDebounce();
    }
  }, [inputText]); // eslint-disable-line react-hooks/exhaustive-deps

  const createChannel = async () => {
    const selectedUsersIds = selectedUsers.map((u) => u.id);

    if (!selectedUsersIds.length) return;

    const conversation = await client.channel('messaging', {
      members: [...selectedUsersIds, client.userID],
    });

    await conversation.watch();

    setActiveChannel(conversation);
    setSelectedUsers([]);
    setUsers([]);
    onClose();
  };

  const addUser = (u) => {
    setSelectedUsers([...selectedUsers, u]);
    setResultsOpen(false);
    setInputText('');
    inputRef.current.focus();
  };

  const removeUser = (user) => {
    const newUsers = selectedUsers.filter((item) => item.id !== user.id);
    setSelectedUsers(newUsers);
    inputRef.current.focus();
  };

  // const handleKeyDown = useCallback((e) => {
  //   // check for up(38) or down(40) key
  //   if (e.which === 38) {
  //     console.log('1 user up');
  //   }
  //   if (e.which === 40) {
  //     console.log('1 user down');
  //   }
  //   if (e.which === 13) {
  //     console.log('submit selected user');
  //     addUser();
  //   }
  // }, []);

  // useEffect(() => {
  //   document.addEventListener('keydown', handleKeyDown, false);
  //   return () => document.removeEventListener('keydown', handleKeyDown);
  // }, [handleKeyDown]);

  if (!visible) return null;

  return (
    <div className='messaging-create-channel'>
      <header>
        <div className='messaging-create-channel__left'>
          <div className='messaging-create-channel__left-text'>To: </div>
          {!!selectedUsers?.length && (
            <div className='messaging-create-channel__users'>
              {selectedUsers.map((user) => (
                <div className='messaging-create-channel__user' onClick={() => removeUser(user)} key={user.id}>
                  <div className='messaging-create-channel__user-text'>{user.name}</div>
                  <XButton />
                </div>
              ))}
            </div>
          )}
          <form onSubmit={addUser}>
            <input
              autoFocus
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder='Start typing for suggestions'
              type='text'
              className='messaging-create-channel__input'
            />
          </form>
        </div>
        <button className='create-channel-button' onClick={createChannel}>
          Start chat
        </button>
      </header>
      {inputText && (
        <main>
          <ul className='messaging-create-channel__user-results'>
            {!!users?.length && (
              <div>
                {users.map((user) => (
                  <div className='messaging-create-channel__user-result' onClick={() => addUser(user)} key={user.id}>
                    <UserResult user={user} />
                  </div>
                ))}
              </div>
            )}
          </ul>
        </main>
      )}
    </div>
  );
};

const UserResult = ({ user }) => {
  return (
    <li className='messaging-create-channel__user-result'>
      <Avatar image={user.image} size='40' />
      {user.online && <div className='messaging-create-channel__user-result-online' />}
      <div className='messaging-create-channel__user-result__details'>
        <span>{user.name}</span>
        {/* <span className='messaging-create-channel__user-result__details__last-seen'>{user.online}</span> */}
      </div>
    </li>
  );
};

export default React.memo(CreateChannel);
