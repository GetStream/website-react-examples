import {DialogManagerProvider, Message, useChannelStateContext } from 'stream-chat-react';

import { CloseThreadButton } from '../TeamChannelHeader/CloseThreadButton';

import { TeamMessage } from '../TeamMessage/TeamMessage';

import { useWorkspaceController } from '../../context/WorkspaceController';

export const PinnedMessageList = () => {
  const { pinnedMessageListOpen, togglePinnedMessageListOpen } = useWorkspaceController();
  const { channel } = useChannelStateContext();

  if (!pinnedMessageListOpen) return null;

  return (
    <DialogManagerProvider id='pinned-message-list-dialog-manager'>
    <div className='pinned-messages__container'>
      <div className='pinned-messages__header'>
        <div className='workspace-header__title'>Pins</div>
        <CloseThreadButton onClick={togglePinnedMessageListOpen} />
      </div>
      <div className='pinned-messages__list'>
        {channel.state.pinnedMessages.map((message) => (
          <Message
            groupStyles={['single']}
            Message={TeamMessage}
            key={message.id}
            message={message}
          />
        ))}
      </div>
    </div>
    </DialogManagerProvider>
  );
};
