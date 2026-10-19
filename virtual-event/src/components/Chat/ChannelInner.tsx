import React, {useEffect, useMemo, useState} from 'react';
import {type Channel as StreamChannel, Thread as StreamThread} from 'stream-chat';
import {
  Channel,
  defaultWorkspaceNavigation,
  MessageComposer,
  Thread,
  useChatContext,
  VirtualizedMessageList,
  type WorkspaceNavigation,
  WorkspaceNavigationProvider,
  WithComponents,
} from 'stream-chat-react';

import {ThreadHeader} from './ThreadHeader';
import {ThreadMessageInputUI} from './ThreadMessageInputUI';

import {ThreadInputContext} from '../../contexts/ThreadInputContext';
import {useBoolState} from '../../hooks/useBoolState';

const threadOverrides = { MessageComposerUI: ThreadMessageInputUI };

/**
 * A channel with its thread. stream-chat-react 15's Channel renders only the channel and opens
 * threads through workspace navigation, so the open thread is held here.
 */
export const ChannelInner = ({ channel }: { channel: StreamChannel }) => {
  const { client } = useChatContext();
  const [thread, setThread] = useState<StreamThread>();
  const {state: checked, off: uncheck, toggle: toggleCheckedFooter} = useBoolState();

  // v14's Channel remounted per channel, which closed the thread; v15 keeps it mounted
  useEffect(() => {
    setThread(undefined);
  }, [channel]);

  useEffect(() => {
    if (!thread) uncheck();
  }, [thread, uncheck]);

  const navigation = useMemo<WorkspaceNavigation>(() => ({
    ...defaultWorkspaceNavigation,
    closeThread: () => setThread(undefined),
    isThreadActive: (threadId) => !!threadId && threadId === thread?.id,
    isThreadDismissable: () => !!thread,
    openThread: (target) =>
      setThread(
        target instanceof StreamThread
          ? target
          : client.threads.ensure({ channel: target.channel, parentMessage: target.message }),
      ),
    openThreads: thread ? [thread] : [],
  }), [client, thread]);

  return (
    <WorkspaceNavigationProvider value={navigation}>
      {/* the thread replaces the channel; keep the channel mounted so its scroll position survives */}
      <div className='channel-inner__channel' hidden={!!thread}>
        <Channel channel={channel}>
          <VirtualizedMessageList
            additionalVirtuosoProps={{ alignToBottom: true }}
            hideDeletedMessages
            separateGiphyPreview
          />
          <MessageComposer maxRows={2} />
        </Channel>
      </div>
      {thread && (
        <ThreadInputContext.Provider value={{footerChecked: checked, toggleCheckedFooter}}>
          <WithComponents overrides={threadOverrides}>
            <Thread thread={thread}>
              <ThreadHeader />
              <VirtualizedMessageList
                additionalVirtuosoProps={{ alignToBottom: true }}
                separateGiphyPreview
              />
              <MessageComposer focus />
            </Thread>
          </WithComponents>
        </ThreadInputContext.Provider>
      )}
    </WorkspaceNavigationProvider>
  );
};
