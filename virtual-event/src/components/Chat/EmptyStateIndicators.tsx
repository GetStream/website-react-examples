import React, { PropsWithChildren } from 'react';
import { EmptyStateIndicatorProps, useChannelStateContext } from 'stream-chat-react';

import { EmptyChatIcon, EmptyDMIcon, EmptyQAIcon } from '../../assets';
import { ChatType, useEventContext } from '../../contexts/EventContext';
import { PropsWithChildrenOnly } from '../../types';

const EmptyStateWrapper = ({ children }: PropsWithChildrenOnly) => (
  <div className='chat-components-empty'>{children}</div>
);

const emptyStateIndicatorContents = ({ chatType, isDmChannel }: { chatType: ChatType, isDmChannel?: boolean }) => {
  let Icon: React.FC;
  let title: string;
  let description: string;

  switch (chatType) {
    case 'qa':
      Icon = EmptyQAIcon;
      title = 'No questions yet';
      description = 'Send a question to the speakers.';
      break;

    case 'direct':
      Icon = isDmChannel ? EmptyChatIcon : EmptyDMIcon;
      title = isDmChannel ? 'No chat yet' : 'No direct messages yet';
      description = isDmChannel
        ? 'Send a message to start the conversation.'
        : 'You will see your first direct message here when it is received.';
      break;

    default:
      Icon = EmptyChatIcon;
      title = 'No chat yet';
      description = 'Send a message to start the conversation.';
      break;
  }

  return { Icon, description, title };
};

export const EmptyStateIndicatorChannel = (props: PropsWithChildren<EmptyStateIndicatorProps & { isDmChannel?: boolean }>) => {
  const { thread } = useChannelStateContext();

  if (thread) return null;

  return <EmptyStateIndicators {...props}/>
};

export const EmptyStateIndicators = ({
  isDmChannel,
}: PropsWithChildren<EmptyStateIndicatorProps & { isDmChannel?: boolean }>) => {
  const { chatType } = useEventContext();
  const { Icon, description, title } = emptyStateIndicatorContents({ chatType, isDmChannel });

  return (
    <EmptyStateWrapper>
      <Icon />
      <div>{title}</div>
      <div>{description}</div>
    </EmptyStateWrapper>
  );
};
