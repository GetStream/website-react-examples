import React, { useContext } from 'react';
import { Attachment, logChatPromiseExecution, UserResponse } from 'stream-chat';
import {
  MessageList,
  MessageInput,
  Window,
  StreamMessage,
  useChannelActionContext,
  Thread,
} from 'stream-chat-react';

import { MessagingChannelHeader, MessagingInput } from '../../components';

import {
  AttachmentType,
  ChannelType,
  CommandType,
  EventType,
  GiphyContext,
  MessageType,
  ReactionType,
  UserType,
} from '../../App';

export type ChannelInnerProps = {
  toggleMobile: () => void;
  theme: string;
};

export const ChannelInner: React.FC<ChannelInnerProps> = (props) => {
  const { theme, toggleMobile } = props;
  const { giphyState, setGiphyState } = useContext(GiphyContext);

  const { sendMessage } = useChannelActionContext<
    AttachmentType,
    ChannelType,
    CommandType,
    EventType,
    MessageType,
    ReactionType,
    UserType
  >();

  const overrideSubmitHandler = (message: {
    attachments: Attachment[];
    mentioned_users: UserResponse[];
    text: string;
    parent?: StreamMessage;
  }) => {
    let updatedMessage;

    if (message.attachments?.length && message.text?.startsWith('/giphy')) {
      const updatedText = message.text.replace('/giphy', '');
      updatedMessage = { ...message, text: updatedText };
    }

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...message, text: updatedText };
    }

    if (sendMessage) {
      const newMessage = updatedMessage || message;
      const parentMessage = newMessage.parent;

      const messageToSend = {
        ...newMessage,
        parent: parentMessage
          ? {
              ...parentMessage,
              created_at: parentMessage.created_at?.toString(),
              pinned_at: parentMessage.pinned_at?.toString(),
              updated_at: parentMessage.updated_at?.toString(),
            }
          : undefined,
      };

      const sendMessagePromise = sendMessage(messageToSend);
      logChatPromiseExecution(sendMessagePromise, 'send message');
    }

    setGiphyState(false);
  };

  const actions = ['delete', 'edit', 'flag', 'mute', 'react', 'reply'];

  return (
    <>
      <Window>
        <MessagingChannelHeader theme={theme} toggleMobile={toggleMobile} />
        <MessageList messageActions={actions} />
        <MessageInput focus overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <Thread Input={MessagingInput} />
    </>
  );
};
