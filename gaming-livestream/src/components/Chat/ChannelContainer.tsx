import {GamingThreadHeader} from "./GamingThreadHeader";
import {SearchIndex} from "emoji-mart";
import {MessageTimestampController} from "../../context/MessageTimestampController";
import {GamingChatInner} from "./GamingChatInner";
import {GamingMessage} from "./GamingMessage";
import {GamingMessageInput} from "./GamingMessageInput";
import {
  Channel,
  defaultWorkspaceNavigation,
  MessageComposer,
  MessageList,
  Thread,
  useChatContext,
  type WorkspaceNavigation,
  WorkspaceNavigationProvider,
  WithComponents,
} from "stream-chat-react";
import {type Channel as StreamChannel, Thread as StreamThread} from "stream-chat";
import React, {useEffect, useMemo, useState} from "react";


export const ChannelContainer = () => {
  const {client} = useChatContext();
  const [channel, setChannel] = useState<StreamChannel>();
  const [thread, setThread] = useState<StreamThread>();

  useEffect(() => {
    const loadChat = async () => {
      // stream-chat-react 15's Channel no longer watches the channel it is given
      const channel = await client
        .channel('gaming', 'gaming-demo', { custom: { name: 'Gaming Demo' } })
        .ensureWatched();
      setChannel(channel);
    };

    loadChat();
  }, [client]);

  // Without ChatView, opening and closing threads goes through the app's own navigation
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

  if (!channel) return null;

  return (
    <WorkspaceNavigationProvider value={navigation}>
      <WithComponents
        overrides={{
          emojiSearchIndex: SearchIndex,
          MessageComposerUI: GamingMessageInput,
          MessageUI: GamingMessage,
        }}
      >
        <MessageTimestampController>
          {/* the thread replaces the channel; keep the channel mounted so its scroll position survives */}
          <div className='gaming-chat__channel' hidden={!!thread}>
            <Channel channel={channel}>
              <GamingChatInner />
            </Channel>
          </div>
          {thread && (
            <Thread thread={thread}>
              <GamingThreadHeader />
              <MessageList withDateSeparator={false} />
              <MessageComposer focus />
            </Thread>
          )}
        </MessageTimestampController>
      </WithComponents>
    </WorkspaceNavigationProvider>
  );
};
