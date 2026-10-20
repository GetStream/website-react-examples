import type { MouseEventHandler } from 'react';
import type { ThreadState } from 'stream-chat';
import { useCloseThread, useStateStore, useThreadContext } from 'stream-chat-react';

const replyCountSelector = ({ replyCount }: ThreadState) => ({ replyCount });

export const GamingThreadHeader = () => {
  const thread = useThreadContext();
  const { replyCount } = useStateStore(thread?.state, replyCountSelector) ?? {};
  const closeThread = useCloseThread();

  const onCloseThread: MouseEventHandler<HTMLButtonElement> = (event) => closeThread({ event });

  return (
    <div className='thread-header'>
      <button className='close-drawer-btn' onClick={onCloseThread}/>
      <h2>{`Thread (${replyCount ?? 0})`}</h2>
    </div>
  );
};
