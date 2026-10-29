import {SearchIndex} from "emoji-mart";
import {MessageTimestampController} from "../../context/MessageTimestampController";
import {GamingChatInner} from "./GamingChatInner";
import {GamingMessageInput} from "./GamingMessageInput";
import {GamingMessage} from "./GamingMessage";
import {
  Channel,
  defaultWorkspaceNavigation,
  useChatContext,
  WithComponents,
  type WorkspaceNavigation,
  WorkspaceNavigationProvider,
} from "stream-chat-react";
import {type Channel as StreamChannel, Thread as StreamThread} from "stream-chat";
import React, {useEffect, useMemo, useState} from "react";


export const ChannelContainer = () => {
  const {client} = useChatContext();
  const [channel, setChannel] = useState<StreamChannel>();
  const [thread, setThread] = useState<StreamThread>();

  useEffect(() => {
    // <Channel> no longer watches; render the instance watch() resolves with
    client
      .channel('gaming', 'gaming-demo', { custom: { name: 'Gaming Demo' } })
      .watch()
      .then(setChannel);
  }, [client]);

  // No ChatView here, so the app provides navigation for the message's thread button and the thread header
  const navigation = useMemo<WorkspaceNavigation>(
    () => ({
      ...defaultWorkspaceNavigation,
      closeThread: () => setThread(undefined),
      isChannelActive: (cid) => !!cid && cid === channel?.cid,
      isThreadActive: (threadId) => !!threadId && threadId === thread?.id,
      isThreadDismissable: (threadId) => !!threadId && threadId === thread?.id,
      openChannel: (channel) => setChannel(channel),
      openChannels: channel ? [channel] : [],
      openThread: (target) =>
        setThread(
          target instanceof StreamThread
            ? target
            : client.threads.ensure({ channel: target.channel, parentMessage: target.message }),
        ),
      openThreads: thread ? [thread] : [],
    }),
    [channel, client, thread],
  );

  if (!channel) return null;

  return (
    <WithComponents
      overrides={{
        emojiSearchIndex: SearchIndex,
        MessageComposerUI: GamingMessageInput,
        MessageUI: GamingMessage,
      }}
    >
      <WorkspaceNavigationProvider value={navigation}>
        <Channel channel={channel}>
          <MessageTimestampController>
            <GamingChatInner thread={thread} />
          </MessageTimestampController>
        </Channel>
      </WorkspaceNavigationProvider>
    </WithComponents>
  );
};
