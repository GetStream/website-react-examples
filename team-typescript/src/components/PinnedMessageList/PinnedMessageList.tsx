import type { SetStateAction } from 'react';

import { useChannelContext, Message, MessageUIComponentProps, MessageTeam } from 'stream-chat-react';

import './PinnedMessageList.css';

import type { TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType } from '../../App';

import { CloseThreadIcon } from '../../assets';

type PinnedMessageListProps = Partial<MessageUIComponentProps> & {
  setPinsOpen?: React.Dispatch<SetStateAction<boolean>>;
}

export const PinnedMessageList = (props: PinnedMessageListProps) => {
  const { setPinsOpen } = props;

  const { channel, closeThread } = useChannelContext<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>();

  return (
    <div className='pinned-messages__container'>
      <div className='pinned-messages__header'>
        <p className='pinned-messages__header-text'>Pins</p>
        <CloseThreadIcon {...{ closeThread, setPinsOpen }} />
      </div>
      <div className='pinned-messages__list'>
        {channel.state.pinnedMessages.map((message) => (
          <Message
            message={message}
            Message={MessageTeam}
          />
        ))}
      </div>
    </div>
  );
};
