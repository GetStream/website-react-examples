import type { ThreadState } from 'stream-chat';
import { useCloseThread, useStateStore, useThreadContext } from 'stream-chat-react';

import { CloseThreadButton } from './CloseThreadButton';

const replyCountSelector = ({ replyCount }: ThreadState) => ({ replyCount });

export const ThreadHeader = () => {
  const thread = useThreadContext();
  const closeThread = useCloseThread();
  const { replyCount } = useStateStore(thread?.state, replyCountSelector) ?? {};

  const getReplyCount = () => {
    if (!replyCount) return '';
    if (replyCount === 1) return '1 reply';
    return `${replyCount} replies`;
  };

  return (
    <div className='custom-thread-header'>
      <div className='workspace-header__block'>
        <div className='workspace-header__title'>Thread</div>
        <div className='workspace-header__subtitle'>{getReplyCount()}</div>
      </div>
      <CloseThreadButton onClick={(event) => closeThread({ event })} />
    </div>
  );
};
