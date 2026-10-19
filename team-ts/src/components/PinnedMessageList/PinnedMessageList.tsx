import type { Channel, MessagePaginatorState } from 'stream-chat';
import {
  ChannelInstanceProvider,
  DialogManagerProvider,
  Message,
  useStateStore,
  WithComponents,
} from 'stream-chat-react';

import { CloseThreadButton } from '../TeamChannelHeader/CloseThreadButton';

import { TeamMessage } from '../TeamMessage/TeamMessage';

import { useWorkspaceController } from '../../context/WorkspaceController';

const pinnedMessagesSelector = ({ items }: MessagePaginatorState) => ({ pinnedMessages: items });

export const PinnedMessageList = ({ channel }: { channel: Channel }) => {
  const { pinnedMessageListOpen, togglePinnedMessageListOpen } = useWorkspaceController();
  const { pinnedMessages } = useStateStore(channel.pinnedMessagesPaginator.state, pinnedMessagesSelector);

  if (!pinnedMessageListOpen) return null;

  return (
    <DialogManagerProvider id='pinned-message-list-dialog-manager'>
    <div className='pinned-messages__container'>
      <div className='pinned-messages__header'>
        <div className='workspace-header__title'>Pins</div>
        <CloseThreadButton onClick={togglePinnedMessageListOpen} />
      </div>
      <div className='pinned-messages__list'>
        {/* rendered outside <Channel>, so Message needs the channel in context */}
        <ChannelInstanceProvider value={{ channel }}>
          <WithComponents overrides={{ MessageUI: TeamMessage }}>
            {pinnedMessages?.map((message) => (
              <Message
                groupStyles={['single']}
                key={message.id}
                message={message}
              />
            ))}
          </WithComponents>
        </ChannelInstanceProvider>
      </div>
    </div>
    </DialogManagerProvider>
  );
};
