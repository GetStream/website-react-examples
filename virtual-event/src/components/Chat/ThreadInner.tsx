import React, { useEffect } from 'react';
import { Thread, useChannelStateContext } from 'stream-chat-react';

import { ThreadMessageInputUI } from './ThreadMessageInputUI';

import { ThreadInputContext } from '../../contexts/ThreadInputContext';
import { useBoolState } from '../../hooks/useBoolState';

export const ThreadInner = () => {
  const { thread } = useChannelStateContext();

  const {state: checked, off: uncheck, toggle: toggleCheckedFooter} = useBoolState();

  useEffect(() => {
    if (!thread) {
      uncheck();
    }
  }, [thread, uncheck]);


  return (
    <ThreadInputContext.Provider value={{footerChecked: checked, toggleCheckedFooter}}>
      <Thread
        additionalVirtualizedMessageListProps={{
          additionalVirtuosoProps: { alignToBottom: true },
          separateGiphyPreview: true,
        }}
        Input={ThreadMessageInputUI}
        virtualized
      />
    </ThreadInputContext.Provider>
  );
};
