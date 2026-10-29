import type { ThreadState } from 'stream-chat';
import { useCloseThread, useStateStore, useThreadContext } from 'stream-chat-react';

import './MessagingThreadHeader.css';

import { CloseThreadIcon } from '../../assets';

const replyCountSelector = ({ replyCount }: ThreadState) => ({ replyCount });

const MessagingThreadHeader = () => {
  const thread = useThreadContext();
  const closeThread = useCloseThread();
  const { replyCount } = useStateStore(thread?.state, replyCountSelector) ?? {};

  const getReplyCount = () => {
    if (!replyCount) return '';
    if (replyCount === 1) return '1 reply';
    return `${replyCount} Replies`;
  };

  return (
    <div className='custom-thread-header'>
      <div className='custom-thread-header__left'>
        <p className='custom-thread-header__left-title'>Thread</p>
        <p className='custom-thread-header__left-count'>{getReplyCount()}</p>
      </div>
      <CloseThreadIcon closeThread={(event) => closeThread({ event })} />
    </div>
  );
};

export default MessagingThreadHeader;
