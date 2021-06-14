import { useChannelActionContext, useChannelStateContext, Message, MessageTeam } from 'stream-chat-react';

import './PinnedMessageList.css';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

import { CloseThreadIcon } from '../../assets';

type Props = {
  setPinsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PinnedMessageList: React.FC<Props> = (props) => {
  const { setPinsOpen } = props;

  const { closeThread } = useChannelActionContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const { channel } = useChannelStateContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

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
