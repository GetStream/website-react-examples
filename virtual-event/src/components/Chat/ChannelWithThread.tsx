import React, { useMemo, useState } from 'react';
import { type Channel as StreamChannel, Thread as StreamThread } from 'stream-chat';
import {
  Channel,
  defaultWorkspaceNavigation,
  useChatContext,
  type WorkspaceNavigation,
  WorkspaceNavigationProvider,
} from 'stream-chat-react';

import { ChannelInner } from './ChannelInner';

type Props = {
  channel: StreamChannel;
};

// There is no ChatView here, so the app owns the open thread and provides the workspace navigation
// that the message "Start thread" / reply buttons and the thread header call.
export const ChannelWithThread = ({ channel }: Props) => {
  const { client } = useChatContext();
  const [openedThread, setOpenedThread] = useState<StreamThread>();

  // v14 remounted Channel per channel, which closed the thread; drop a thread of another channel
  const thread = openedThread?.channel.cid === channel.cid ? openedThread : undefined;

  const navigation = useMemo<WorkspaceNavigation>(
    () => ({
      ...defaultWorkspaceNavigation,
      closeThread: () => setOpenedThread(undefined),
      isChannelActive: (cid) => !!cid && cid === channel.cid,
      isThreadActive: (threadId) => !!threadId && threadId === thread?.id,
      isThreadDismissable: (threadId) => !!threadId && threadId === thread?.id,
      openChannels: [channel],
      openThread: (target) =>
        setOpenedThread(
          target instanceof StreamThread
            ? target
            : client.threads.ensure({ channel: target.channel, parentMessage: target.message }),
        ),
      openThreads: thread ? [thread] : [],
    }),
    [channel, client, thread],
  );

  return (
    <WorkspaceNavigationProvider value={navigation}>
      <Channel channel={channel}>
        <ChannelInner thread={thread} />
      </Channel>
    </WorkspaceNavigationProvider>
  );
};
