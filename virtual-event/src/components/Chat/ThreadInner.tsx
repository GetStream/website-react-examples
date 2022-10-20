import React, { useEffect } from 'react';
import { Thread, useChannelStateContext } from 'stream-chat-react';

import { ThreadMessageInputUI } from './ThreadMessageInputUI';

import { ThreadInputContext } from '../../contexts/ThreadInputContext';
import { useBoolState } from '../../hooks/useBoolState';
import { useOverrideSubmit } from '../../hooks/useOverrideSubmit';

export const ThreadInner = () => {
  const { thread } = useChannelStateContext();

  const {state: checked, off: uncheck, toggle: toggleCheckedFooter} = useBoolState();
  const threadOverrideSubmitHandler = useOverrideSubmit(checked);

  useEffect(() => {
    if (!thread) {
      uncheck();
    }
  }, [thread, uncheck]);


  return (
    <ThreadInputContext.Provider value={{footerChecked: checked, toggleCheckedFooter}}>
      <Thread
        additionalMessageInputProps={{ overrideSubmitHandler: threadOverrideSubmitHandler }}
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
