import {MessageComposer, VirtualizedMessageList, Window} from 'stream-chat-react';

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
        <MessageComposer maxRows={2} />
      </Window>
      <ThreadInner />
    </>
  );
};
