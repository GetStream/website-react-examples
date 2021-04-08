
import type { SetStateAction } from 'react';
import { defaultPinPermissions, MessageUIComponentProps, MessageTeam, StreamMessage, usePinHandler } from 'stream-chat-react';

import './TeamMessage.css';

import type { TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType } from '../../App';

type TeamMessageProps = MessageUIComponentProps & {
  message: StreamMessage;
  setPinsOpen?: React.Dispatch<SetStateAction<boolean>>;
}

export const TeamMessage = (props: TeamMessageProps) => {
  const { handleOpenThread, handlePin, isMyMessage, message, setPinsOpen } = props;

  const teamPermissions = { ...defaultPinPermissions.team, user: true };
  const pinnedPermissions = {...defaultPinPermissions, team: teamPermissions};

  // @ts-expect-error
  const { canPin } = usePinHandler<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>(message, pinnedPermissions);

  const getMessageActions = () => {
    if (isMyMessage()) {
      return ['edit', 'delete', 'pin', 'react', 'reply', 'flag'];

    }
    return ['pin', 'react', 'reply', 'flag', 'mute'];
  };

  const handleOpenThreadOverride = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (setPinsOpen) setPinsOpen(false);
    handleOpenThread(event);
  };

  const pinMessageOverride = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (canPin) handlePin(event);
  }

  return (
    <div className={message.pinned ? 'pinned-message' : 'unpinned-message'}>
      <MessageTeam {...props} {...{ getMessageActions }} handleOpenThread={handleOpenThreadOverride} handlePin={pinMessageOverride} />
      {/** potentially add replies component here */}
    </div>
  );
};