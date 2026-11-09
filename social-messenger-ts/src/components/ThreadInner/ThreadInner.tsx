import { MessageComposer, VirtualizedMessageList } from 'stream-chat-react';

import { MessagingThreadHeader } from '../../components';

// Rendered inside <Thread>, which no longer renders its own header, list and composer
const ThreadInner = () => (
  <>
    <MessagingThreadHeader />
    <VirtualizedMessageList />
    <MessageComposer focus />
  </>
);

export default ThreadInner;
