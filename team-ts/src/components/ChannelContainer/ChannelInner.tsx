import React from 'react';
import {
  MessageComposer,
  MessageList,
  Thread,
  Window,
  WithComponents,
} from 'stream-chat-react';

import {PinnedMessageList} from '../PinnedMessageList/PinnedMessageList';
import {TeamChannelHeader} from '../TeamChannelHeader/TeamChannelHeader';
import {ThreadMessageInput} from "../TeamMessageInput/TeamMessageInput";

export const ChannelInner = () => {
  return (
      <>
        <Window>
          <TeamChannelHeader />
          <MessageList disableQuotedMessages={true} />
          <MessageComposer minRows={1} maxRows={8} />
        </Window>
        <WithComponents overrides={{ MessageComposerUI: ThreadMessageInput }}>
          <Thread additionalMessageComposerProps={{ maxRows: 8, minRows: 1 }} />
        </WithComponents>
        <PinnedMessageList />
    </>
  );
};
