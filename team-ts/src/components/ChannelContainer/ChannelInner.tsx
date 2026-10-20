import React from 'react';
import type { Channel as StreamChannel, Thread as StreamThread } from 'stream-chat';
import {
  Channel,
  MessageComposer,
  MessageList,
  Thread,
  WithComponents,
} from 'stream-chat-react';

import {PinnedMessageList} from '../PinnedMessageList/PinnedMessageList';
import {TeamChannelHeader} from '../TeamChannelHeader/TeamChannelHeader';
import {ThreadHeader} from '../TeamChannelHeader/ThreadHeader';
import {ThreadMessageInput} from "../TeamMessageInput/TeamMessageInput";

type ChannelInnerProps = {
  channel: StreamChannel;
  thread?: StreamThread;
};

export const ChannelInner = ({ channel, thread }: ChannelInnerProps) => {
  return (
      <>
        <Channel channel={channel}>
          <TeamChannelHeader />
          <MessageList disableQuotedMessages={true} />
          <MessageComposer minRows={1} maxRows={8} />
        </Channel>
        {thread && (
          <WithComponents overrides={{ MessageComposerUI: ThreadMessageInput }}>
            <Thread thread={thread}>
              <ThreadHeader />
              <MessageList withDateSeparator={false} />
              <MessageComposer focus maxRows={8} minRows={1} />
            </Thread>
          </WithComponents>
        )}
        <PinnedMessageList channel={channel} />
    </>
  );
};
