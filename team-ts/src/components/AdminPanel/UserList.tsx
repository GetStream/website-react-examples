import { useEffect, useMemo, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import type { UserResponse } from 'stream-chat';

import { useAdminPanelFormState } from './context/AdminPanelFormContext';
import { ValidationError } from './ValidationError';

const ListContainer = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const {errors, createChannelType} = useAdminPanelFormState()
  const showHeading = !createChannelType || createChannelType === 'team';
  return (
    <div className='user-list__container'>
      {showHeading && <h2><span>Add Members</span><ValidationError errorMessage={errors.members} /></h2>}
      <div className='user-list__header user-list__row'>
        <div className='user-list__column-block'>
          <p>User</p>
          <p className='user-list__column--last-active'>Last Active</p>
        </div>
        <div className='user-list__column--checkbox'>
          <p>Invite</p>
        </div>
      </div>
      {children}
    </div>
  );
};

type UserItemProps = {
  index: number;
  user: UserResponse;
};

const MOCKED_LAST_ACTIVE_STRINGS = [
  '12 min ago',
  '27 min ago',
  '6 hours ago',
  '14 hours ago',
];

const UserItem = ({ index, user }: UserItemProps) => {
  const { handleMemberSelect } = useAdminPanelFormState();

  const lastActive = MOCKED_LAST_ACTIVE_STRINGS[index] || 'Yesterday';
  const title = user.name || user.id;

  return (
    <label htmlFor={user.id} title={title} className='user-list__row'>
      <div className='user-list__column-block'>
        <div className='user-list__column--user-data'>
          <Avatar image={user.image} name={title} />
          <p className='user-item__name'>{title}</p>
        </div>
        <p className='user-list__column--last-active'>{lastActive}</p>
      </div>
      <div className='user-list__column--checkbox'>
        <input type='checkbox' name='members' id={user.id} value={user.id} onChange={handleMemberSelect} />
      </div>
    </label>
  );
};


type UserListLoadState = 'loading' | 'error' | 'empty';

const LOAD_STATE_NOTIFICATION: Record<UserListLoadState, string> = {
  empty: 'No users found.',
  error: 'Error loading, please refresh and try again.',
  loading: 'Loading users...',
};


export const UserList = () => {
  const { client, channel } = useChatContext();
  const { createChannelType } = useAdminPanelFormState();
  const [loadState, setLoadState] = useState<UserListLoadState | null>(null);
  const [users, setUsers] = useState<UserResponse[] | undefined>();

  const channelMembers = useMemo(() => channel?.state.members
      ? Object.keys(channel.state.members)
      : [],
    [channel?.state?.members],
  );

  useEffect(() => {
    const getUsers = async () => {
      if (loadState) return;
      setLoadState('loading');

      try {
        const response = await client.queryUsers(
          // FIXME: How to query non-member users?
        // @ts-ignore
          { id: { $nin: channelMembers } },
          { id: 1 },
          { limit: 8 },
        );

        if (response.users.length) {
          setUsers(response.users);
        } else {
          setLoadState('empty');
        }
      } catch (event) {
        setLoadState('error');
      }

      setLoadState(null);
    };

    if (client) getUsers();
  }, [client, channelMembers, createChannelType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ListContainer>
      {loadState
        ? <div className='user-list__message'>{LOAD_STATE_NOTIFICATION[loadState]}</div>
        : users?.length && users.map((user, i) => <UserItem index={i} key={user.id} user={user} />)}
    </ListContainer>
  );
};
