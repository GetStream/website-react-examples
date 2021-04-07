import {PropsWithChildren, useEffect, useState } from 'react';

import type { ChannelFilters, UserResponse } from 'stream-chat';
import { Avatar, useChatContext } from 'stream-chat-react';

import './UserList.css';

import type { TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType } from '../../App';

import { InviteIcon } from '../../assets';

type UserListProps = {
  filters: ChannelFilters[]
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

interface ListContainerProps { };

const ListContainer = (props: PropsWithChildren<ListContainerProps>) => {
  const { children } = props;

  return (
    <div className='user-list__container'>
      <div className='user-list__header'>
        <p>User</p>
        <p>Last Active</p>
        <p>Invite</p>
      </div>
      {children}
    </div>
  )
};

type UserItemProps = {
  index: number;
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  user: UserResponse<TeamUserType>;
}

const UserItem = (props: UserItemProps) => {
  const { index, setSelectedUsers, user } = props;

  const [selected, setSelected] = useState(false);

  const getLastActive = (i: number) => {
    switch (i) {
      case 0:
        return '12 min ago';
      case 1:
        return '27 min ago';
      case 2:
        return '6 hours ago';
      case 3:
        return '14 hours ago';
      case 4:
        return 'Yesterday';
      default:
        return 'Yesterday';
    }
  };

  const handleClick = () => {
    if (selected) {
      setSelectedUsers((prevUsers) => prevUsers?.filter((prevUser) => prevUser !== user.id));
    } else {
      setSelectedUsers((prevUsers) => prevUsers ? [...prevUsers, user.id] : [user.id]);
    }
    setSelected(!selected);
  };

  return (
    <div className='user-item__wrapper' onClick={handleClick}>
      <div className='user-item__name-wrapper'>
        <Avatar image={user.image} size={32} />
        <p className='user-item__name'>{user.name || user.id}</p>
      </div>
      <p className='user-item__last-active'>{getLastActive(index)}</p>
      {selected ? <InviteIcon /> : <div className='user-item__invite-empty' />}
    </div>
  );
};

export const UserList = (props: UserListProps) => {
  const { filters, setSelectedUsers } = props;

  const { client } = useChatContext<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>();

  const [error, setError] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserResponse<TeamUserType>[] | undefined>();

  useEffect(() => {
    const getUsers = async () => {
      if (loading) return;
      setLoading(true);

      try {
        const response = await client.queryUsers({ id: { $ne: client.userID || '' }, ...filters }, { id: 1 }, { limit: 6 });

        if (response.users.length) {
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (e) {
        setError(true);
      }

      setLoading(false);
    };

    if (client) getUsers();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <ListContainer>
        <div className='user-list__message'>Error loading, please refresh and try again.</div>
      </ListContainer>
    );
  }

  if (listEmpty) {
    return (
      <ListContainer>
        <div className='user-list__message'>No users found.</div>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {loading ? (
        <div className='user-list__message'>Loading users...</div>
      ) : (
        users?.length && users.map((user, i) => <UserItem index={i} key={user.id} setSelectedUsers={setSelectedUsers} user={user} />)
      )}
    </ListContainer>
  );
};