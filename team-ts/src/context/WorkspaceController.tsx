import React, { useCallback, useContext, useMemo, useState } from 'react';
import { type Channel as StreamChannel, Thread as StreamThread } from 'stream-chat';
import {
  defaultWorkspaceNavigation,
  useChatContext,
  type WorkspaceNavigation,
  WorkspaceNavigationProvider,
} from 'stream-chat-react';

const noop = () => Promise.resolve();

export type Workspace = 'Chat' | 'Admin-Channel-Edit' | 'Admin-Channel-Create__team' | 'Admin-Channel-Create__messaging';

type WorkspaceContext = {
  activeWorkspace: Workspace;
  closeAdminPanel: () => void;
  displayWorkspace: (w: Workspace) => void;
  pinnedMessageListOpen: boolean;
  togglePinnedMessageListOpen: () => void;
  closePinnedMessageListOpen: () => void;
}

const WorkspaceControllerContext = React.createContext<WorkspaceContext>({
  activeWorkspace: 'Chat',
  closeAdminPanel: noop,
  displayWorkspace: noop,
  pinnedMessageListOpen: false,
  togglePinnedMessageListOpen: noop,
  closePinnedMessageListOpen: noop,
});


export const WorkspaceController = ({ children }: { children: React.ReactNode }) => {
  const { client } = useChatContext();
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>('Chat');
  const [pinnedMessageListOpen, setPinnedMessageListOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState<StreamChannel>();
  const [activeThread, setActiveThread] = useState<StreamThread>();

  const displayWorkspace: WorkspaceContext['displayWorkspace'] = useCallback((workspace) => {
    setActiveWorkspace(workspace);
    setPinnedMessageListOpen(false);
  }, [setActiveWorkspace]);

  const closeAdminPanel = useCallback(() => {
    displayWorkspace('Chat');
  }, [displayWorkspace]);

  const togglePinnedMessageListOpen = useCallback(() => setPinnedMessageListOpen((prev) => !prev), []);
  const closePinnedMessageListOpen = useCallback(() => setPinnedMessageListOpen(false), []);

  // stream-chat-react 15 selects channels and opens threads through workspace navigation;
  // without ChatView, the app owns what is open and provides it here.
  const navigation = useMemo<WorkspaceNavigation>(
    () => ({
      ...defaultWorkspaceNavigation,
      closeThread: () => setActiveThread(undefined),
      isChannelActive: (cid) => !!cid && cid === activeChannel?.cid,
      isThreadActive: (threadId) => !!threadId && threadId === activeThread?.id,
      isThreadDismissable: () => !!activeThread,
      openChannel: (channel) => {
        setActiveChannel(channel);
        setActiveThread(undefined);
        displayWorkspace('Chat');
      },
      openChannels: activeChannel ? [activeChannel] : [],
      openThread: (target) => {
        setPinnedMessageListOpen(false);
        setActiveThread(
          target instanceof StreamThread
            ? target
            : client.threads.ensure({ channel: target.channel, parentMessage: target.message }),
        );
      },
      openThreads: activeThread ? [activeThread] : [],
    }),
    [activeChannel, activeThread, client, displayWorkspace],
  );

  return (
    <WorkspaceControllerContext.Provider value={{
      activeWorkspace,
      closeAdminPanel,
      displayWorkspace,
      pinnedMessageListOpen,
      closePinnedMessageListOpen,
      togglePinnedMessageListOpen,
    }}>
      <WorkspaceNavigationProvider value={navigation}>
        {children}
      </WorkspaceNavigationProvider>
    </WorkspaceControllerContext.Provider>
  );
};

export const useWorkspaceController = () => useContext(WorkspaceControllerContext);
