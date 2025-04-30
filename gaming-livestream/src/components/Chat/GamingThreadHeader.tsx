import type { MouseEventHandler } from 'react';

import type { ThreadHeaderProps } from 'stream-chat-react';

type GamingThreadHeaderProps = Pick<ThreadHeaderProps, 'closeThread' | 'thread'>

export const GamingThreadHeader = ({ closeThread, thread }: GamingThreadHeaderProps) => {
  const onCloseThread: MouseEventHandler<HTMLButtonElement> = (event) => {
    const chatPanel = document.querySelector<HTMLElement>('.str-chat__main-panel');
    if (chatPanel) chatPanel.style.display = 'flex';
    closeThread(event);
  };

  const getReplyCount = () => {
    if (!thread?.reply_count) return 0;
    return thread.reply_count;
  };

  return (
    <div className='thread-header'>
      <button className='close-drawer-btn' onClick={onCloseThread}/>
      <h2>{`Thread (${getReplyCount()})`}</h2>
    </div>
  );
};
