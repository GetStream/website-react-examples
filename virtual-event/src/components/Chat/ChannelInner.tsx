import type { Thread } from 'stream-chat';
import {MessageComposer, VirtualizedMessageList} from 'stream-chat-react';

import {ThreadInner} from './ThreadInner';

export const ChannelInner = ({ thread }: { thread?: Thread }) => {
  return (
    <>
      {/* hidden, not unmounted, while a thread is open so the list keeps its place */}
      <div className='channel-main' hidden={!!thread}>
        <VirtualizedMessageList
          additionalVirtuosoProps={{ alignToBottom: true }}
          hideDeletedMessages
          separateGiphyPreview
        />
        <MessageComposer maxRows={2} />
      </div>
      {thread && <ThreadInner thread={thread} />}
    </>
  );
};
