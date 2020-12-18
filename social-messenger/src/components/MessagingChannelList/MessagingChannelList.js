import React, { useContext } from 'react';
import { Avatar, ChatContext } from 'stream-chat-react';

import './MessagingChannelList.css';

import { CreateChannelIcon } from '../../assets';

const MessagingChannelList = ({
  children,
  error = false,
  loading,
  onCreateChannel,
}) => {
  const { client } = useContext(ChatContext);
  const {
    id,
    image = require('../../assets/stream.png'),
    name = 'Example User',
  } = client.user || {};

  const ListHeaderWrapper = ({ children }) => {
    return (
      <div className="messaging__channel-list">
        <div className="messaging__channel-list__header">
          <Avatar image={image} name={name} size={40} />
          <div className="messaging__channel-list__header__name">
            {name || id}
          </div>
          <button
            className="messaging__channel-list__header__button"
            onClick={onCreateChannel}
          >
            <CreateChannelIcon />
          </button>
        </div>
        {children}
      </div>
    );
  };

  if (error) {
    return (
      <ListHeaderWrapper>
        <div className="messaging__channel-list__message">
          Error loading conversations, please try again momentarily.
        </div>
      </ListHeaderWrapper>
    );
  }

  if (loading) {
    return (
      <ListHeaderWrapper>
        <div className="messaging__channel-list__message">
          Loading conversations...
        </div>
      </ListHeaderWrapper>
    );
  }

  return <ListHeaderWrapper>{children}</ListHeaderWrapper>;
};

export default React.memo(MessagingChannelList);
