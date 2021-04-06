import { MessageUIComponentProps, MessageTeam, StreamMessage } from 'stream-chat-react';

import './TeamMessage.css';

import { PinIconSmall } from '../../assets';

type TeamMessageProps = MessageUIComponentProps & {
  message: StreamMessage;
  pinnedMessagesIds?: string[];
  // setPinnedMessages?: React.Dispatch<SetStateAction<boolean>>;
  // setPinsOpen?: React.Dispatch<SetStateAction<boolean>>;
}

export const TeamMessage = (props: TeamMessageProps) => {
  const { handleOpenThread, isMyMessage, message } = props;

  // const { openThread } = useChannelContext<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>();
  // const { client } = useChatContext<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>();

  // const isMessagePinned = pinnedMessagesIds?.find((id) => id === message.id) ? true : false;
  // const [isPinned, setIsPinned] = useState(isMessagePinned);

  // const handleFlag = async () => {
  //   if (isPinned) {
  //     setIsPinned(false);
  //     if (setPinnedMessages) {
  //     setPinnedMessages((prevState) => {
  //       const pinCopy = { ...prevState };
  //       delete pinCopy[message.id];
  //       return pinCopy;
  //     });
  //     }
  //   } else {
  //     setIsPinned(true);
  //     setPinnedMessages((prevState) => ({
  //       ...prevState,
  //       [message.id]: message,
  //     }));
  //   }

  //   await client.updateMessage({ ...message, pinned: true } as MessageToSend | StreamMessage);
  // };

  const getMessageActions = () => {
    if (isMyMessage()) {
      return ['edit', 'delete', 'react', 'reply', 'flag'];
    }
    return ['react', 'reply', 'flag', 'mute'];
  };

  const handleOpenThreadOverride = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // if (setPinsOpen) setPinsOpen(false);
    handleOpenThread(event);
  };

  return (
    <div className={message.pinned ? 'pinned-message' : 'unpinned-message'}>
      {message.pinned && (
        <div className='pin-icon__wrapper'>
          <PinIconSmall />
          <p className='pin-icon__text'>Pinned</p>
        </div>
      )}
      <MessageTeam {...props} {...{ getMessageActions }} handleOpenThread={handleOpenThreadOverride} />
      {/** potentially add replies component here */}
    </div>
  );
};