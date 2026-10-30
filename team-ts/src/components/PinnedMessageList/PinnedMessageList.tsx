import type { Channel, MessagePaginatorState } from 'stream-chat';
import {
  ChannelInstanceProvider,
  DialogManagerProvider,
  Message,
  useStateStore,
} from 'stream-chat-react';

import { CloseThreadButton } from '../TeamChannelHeader/CloseThreadButton';

import { useWorkspaceController } from '../../context/WorkspaceController';

const pinnedMessagesSelector = ({ items }: MessagePaginatorState) => ({ items });

// Rendered beside <Channel>, so the messages get their channel from ChannelInstanceProvider;
// TeamMessage comes from the MessageUI override in ChannelContainer
export const PinnedMessageList = ({ channel }: { channel: Channel }) => {
  const { pinnedMessageListOpen, togglePinnedMessageListOpen } = useWorkspaceController();
  const { items: pinnedMessages } = useStateStore(
    channel.pinnedMessagesPaginator.state,
    pinnedMessagesSelector,
  );

  if (!pinnedMessageListOpen) return null;

  return (
    <ChannelInstanceProvider value={{ channel }}>
    <DialogManagerProvider id='pinned-message-list-dialog-manager'>
    <div className='pinned-messages__container'>
      <div className='pinned-messages__header'>
        <div className='workspace-header__title'>Pins</div>
        <CloseThreadButton onClick={togglePinnedMessageListOpen} />
      </div>
      <div className='pinned-messages__list'>
        {pinnedMessages?.map((message) => (
          <Message
            groupStyles={['single']}
            key={message.id}
            message={message}
          />
        ))}
      </div>
    </div>
    </DialogManagerProvider>
    </ChannelInstanceProvider>
  );
};
