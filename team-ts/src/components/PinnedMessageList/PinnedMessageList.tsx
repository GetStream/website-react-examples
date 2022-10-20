import { Message, useChannelActionContext, useChannelStateContext } from 'stream-chat-react';

import './PinnedMessageList.css';

import { CloseThreadIcon } from '../../assets';
import type { StreamChatType } from '../../types';
import { MessageTeam } from '../MessageTeam';

type PinnedMessageListProps = {
  setPinsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PinnedMessageList = (props: PinnedMessageListProps) => {
  const { setPinsOpen } = props;

  const { closeThread } = useChannelActionContext<StreamChatType>();

  const { channel } = useChannelStateContext<StreamChatType>();

  return (
    <div className='pinned-messages__container'>
      <div className='pinned-messages__header'>
        <p className='pinned-messages__header-text'>Pins</p>
        <CloseThreadIcon {...{ closeThread, setPinsOpen }} />
      </div>
      <div className='pinned-messages__list'>
        {channel.state.pinnedMessages.map((message) => (
          <Message
            groupStyles={['single']}
            Message={MessageTeam}
            key={message.id}
            message={message}
          />
        ))}
      </div>
    </div>
  );
};
