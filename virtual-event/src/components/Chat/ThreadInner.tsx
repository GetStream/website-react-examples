import React from 'react';
import type { Thread as StreamThread } from 'stream-chat';
import { MessageComposer, Thread, VirtualizedMessageList, WithComponents } from 'stream-chat-react';

import { ThreadHeader } from './ThreadHeader';
import { ThreadMessageInputUI } from './ThreadMessageInputUI';

import { ThreadInputContext } from '../../contexts/ThreadInputContext';
import { useBoolState } from '../../hooks/useBoolState';

// mounted only while a thread is open, so the footer checkbox resets when the thread closes
export const ThreadInner = ({ thread }: { thread: StreamThread }) => {
  const {state: checked, toggle: toggleCheckedFooter} = useBoolState();

  return (
    <ThreadInputContext.Provider value={{footerChecked: checked, toggleCheckedFooter}}>
      <WithComponents overrides={{ MessageComposerUI: ThreadMessageInputUI }}>
        <Thread thread={thread}>
          <ThreadHeader />
          <VirtualizedMessageList additionalVirtuosoProps={{ alignToBottom: true }} separateGiphyPreview />
          {/* v14 Thread focused its composer by default */}
          <MessageComposer focus />
        </Thread>
      </WithComponents>
    </ThreadInputContext.Provider>
  );
};
