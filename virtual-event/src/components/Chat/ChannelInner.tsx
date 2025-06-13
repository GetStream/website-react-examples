import {MessageInput, VirtualizedMessageList, Window} from 'stream-chat-react';

import {ThreadInner} from './ThreadInner';

export const ChannelInner = () => {
  return (
    <>
      <Window>
        <VirtualizedMessageList
          additionalVirtuosoProps={{ alignToBottom: true }}
          hideDeletedMessages
          separateGiphyPreview
        />
        <MessageInput maxRows={2} grow />
      </Window>
      <ThreadInner />
    </>
  );
};
