import React from 'react';
import { Thread } from 'stream-chat-react';

import './MessagingThread.css';

import { CustomMessage, MessagingInput } from '../index';

import { CloseThreadIcon } from '../../assets';

const ThreadHeader = ({ closeThread, thread }) => {
  const getReplyCount = () => {
    if (!thread?.reply_count) return '';
    if (thread.reply_count === 1) return '1 reply';
    return `${thread.reply_count} Replies`;
  };

  return (
    <div className='custom-thread-header'>
      <div className='custom-thread-header__left'>
        <p className='custom-thread-header__left-title'>Thread</p>
        <p className='custom-thread-header__left-count'>{getReplyCount()}</p>
      </div>
      <CloseThreadIcon {...{ closeThread }} />
    </div>
  );
};

const MessagingThread = () => {
  return <Thread Message={CustomMessage} MessageInput={MessagingInput} ThreadHeader={ThreadHeader} />;
};

export default MessagingThread;
