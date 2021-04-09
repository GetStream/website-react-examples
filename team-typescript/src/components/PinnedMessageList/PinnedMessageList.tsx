import type { SetStateAction } from 'react';

import { useChannelContext, MessageUIComponentProps, MessageTeam } from 'stream-chat-react';

import './PinnedMessageList.css';

import type { TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType } from '../../App';

import { CloseThreadIcon } from '../../assets';

type PinnedMessageListProps = Partial<MessageUIComponentProps> & {
  setPinsOpen?: React.Dispatch<SetStateAction<boolean>>;
}

export const PinnedMessageList = (props: PinnedMessageListProps) => {
  const { setPinsOpen } = props;

  const { channel, closeThread } = useChannelContext<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>();

  // const getMessageActions = () => {
  //   if (isMyMessage && isMyMessage()) {
  //     return ['edit', 'delete', 'pin', 'react', 'reply', 'flag'];

  //   }
  //   return ['pin', 'react', 'reply', 'flag', 'mute'];
  // };

  return (
    <div className='pinned-messages__container'>
      <div className='pinned-messages__header'>
        <p className='pinned-messages__header-text'>Pins</p>
        <CloseThreadIcon {...{ closeThread, setPinsOpen }} />
      </div>
      <div className='pinned-messages__list'>
        {channel.state.pinnedMessages.map((message) => (
          //@ts-expect-error
          <MessageTeam {...props} key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
