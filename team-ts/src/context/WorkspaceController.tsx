import React, { useCallback, useContext, useMemo, useState } from 'react';
import { type Channel, Thread } from 'stream-chat';
import {
  defaultWorkspaceNavigation,
  useChatContext,
  type WorkspaceNavigation,
  WorkspaceNavigationProvider,
} from 'stream-chat-react';

const noop = () => Promise.resolve();

export type Workspace = 'Chat' | 'Admin-Channel-Edit' | 'Admin-Channel-Create__team' | 'Admin-Channel-Create__messaging';

type WorkspaceContext = {
  activeChannel?: Channel;
  activeThread?: Thread;
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
  // stream-chat-react 15 no longer tracks the active channel in ChatContext; the app owns it
  const [activeChannel, setActiveChannel] = useState<Channel>();
  const [activeThread, setActiveThread] = useState<Thread>();

  const displayWorkspace: WorkspaceContext['displayWorkspace'] = useCallback((workspace) => {
    setActiveWorkspace(workspace);
    setPinnedMessageListOpen(false);
  }, [setActiveWorkspace]);

  const closeAdminPanel = useCallback(() => {
    displayWorkspace('Chat');
  }, [displayWorkspace]);

  const togglePinnedMessageListOpen = useCallback(() => setPinnedMessageListOpen((prev) => !prev), []);
  const closePinnedMessageListOpen = useCallback(() => setPinnedMessageListOpen(false), []);

  // Channel list rows, search results and a message's reply button open through workspace navigation
  const navigation = useMemo<WorkspaceNavigation>(
    () => ({
      ...defaultWorkspaceNavigation,
      closeThread: () => setActiveThread(undefined),
      isChannelActive: (cid) => !!cid && cid === activeChannel?.cid,
      isThreadActive: (threadId) => !!threadId && threadId === activeThread?.id,
      isThreadDismissable: (threadId) => !!threadId && threadId === activeThread?.id,
      openChannel: (channel) => {
        setActiveChannel(channel);
        setActiveThread(undefined);
      },
      openChannels: activeChannel ? [activeChannel] : [],
      openThread: (target) => {
        setPinnedMessageListOpen(false);
        setActiveThread(
          target instanceof Thread
            ? target
            : client.threads.ensure({ channel: target.channel, parentMessage: target.message }),
        );
      },
      openThreads: activeThread ? [activeThread] : [],
    }),
    [activeChannel, activeThread, client],
  );

  return (
    <WorkspaceControllerContext.Provider value={{
      activeChannel,
      activeThread,
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
