import React from 'react';
import type { Thread as StreamThread } from 'stream-chat';
import {
  MessageComposer,
  MessageList,
  Thread,
  WithComponents,
} from 'stream-chat-react';

import {TeamChannelHeader} from '../TeamChannelHeader/TeamChannelHeader';
import {ThreadHeader} from '../TeamChannelHeader/ThreadHeader';
import {ThreadMessageInput} from "../TeamMessageInput/TeamMessageInput";

export const ChannelInner = () => {
  return (
      <>
        <TeamChannelHeader />
        <MessageList disableQuotedMessages={true} />
        <MessageComposer minRows={1} maxRows={8} />
    </>
  );
};

// v15 <Thread> renders only its children; v14's Thread focused its composer and hid date separators
export const ThreadInner = ({ thread }: { thread: StreamThread }) => (
  <WithComponents overrides={{ MessageComposerUI: ThreadMessageInput }}>
    <Thread thread={thread}>
      <ThreadHeader />
      <MessageList withDateSeparator={false} />
      <MessageComposer focus maxRows={8} minRows={1} />
    </Thread>
  </WithComponents>
);
