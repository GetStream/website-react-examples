import React, { useContext } from 'react';

import { logChatPromiseExecution } from 'stream-chat';

import { MessageList, MessageInput, Window, useChannelActionContext } from 'stream-chat-react';

import {
  CustomMessage,
  MessagingChannelHeader,
  MessagingInput,
  MessagingThread,
} from '../../components';

import { GiphyContext } from '../../App';

export const ChannelInner = (props) => {
  const { theme, toggleMobile } = props;

  const { giphyState, setGiphyState } = useContext(GiphyContext);
  const { sendMessage } = useChannelActionContext();

  const overrideSubmitHandler = (message) => {
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

  return (
    <>
      <Window>
        <MessagingChannelHeader theme={theme} toggleMobile={toggleMobile} />
        <MessageList
          messageActions={['delete', 'edit', 'flag', 'mute', 'react', 'reply']}
          Message={CustomMessage}
        />
        <MessageInput focus Input={MessagingInput} overrideSubmitHandler={overrideSubmitHandler} />
      </Window>
      <MessagingThread />
    </>
  );
};
