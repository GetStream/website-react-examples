import React from 'react';
import { MessageUIComponentProps, MessageTeam, useMessageContext } from 'stream-chat-react';

import './TeamMessage.css';

type Props = MessageUIComponentProps & {
  setPinsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TeamMessage: React.FC<Props> = (props) => {
  const { setPinsOpen } = props;

  const {
    handleOpenThread,
    message,
  } = useMessageContext();

  const handleOpenThreadOverride = (event: React.BaseSyntheticEvent) => {
    if (setPinsOpen) setPinsOpen(false);
    handleOpenThread(event);
  };

  return (
    <div className={message.pinned ? 'pinned-message' : 'unpinned-message'}>
      <MessageTeam {...props} message={message} handleOpenThread={handleOpenThreadOverride} />
      {/** potentially add replies component here */}
    </div>
  );
};
