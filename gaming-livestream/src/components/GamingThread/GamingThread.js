import React from 'react';
import { Thread } from 'stream-chat-react';
import ThreadBackIcon from '../../assets/icons/ThreadBackIcon';

import { GamingMessage } from '../GamingMessage/GamingMessage';
import { GamingMessageInput } from '../GamingMessageInput/GamingMessageInput';

import './GamingThread.scss';

const ThreadHeader = ({ closeThread, thread }) => {
  const onCloseThread = (e) => {
    const chatPanel = document.querySelector('.str-chat__main-panel');
    chatPanel.style.display = 'flex';
    closeThread(e);
  };

  const getReplyCount = () => {
    if (!thread?.reply_count) return 0;
    return thread.reply_count;
  };

  return (
    <div className='thread-header__wrapper' onClick={onCloseThread}>
      <ThreadBackIcon {...{ onCloseThread }} />
      <p>{`Thread (${getReplyCount()})`}</p>
    </div>
  );
};

export const GamingThread = () => {
  return (
    <>
      <Thread Message={GamingMessage} MessageInput={GamingMessageInput} ThreadHeader={ThreadHeader} />
    </>
  );
};
