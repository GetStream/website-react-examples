import React, { MouseEventHandler, useCallback, useState } from 'react';
import { logChatPromiseExecution } from 'stream-chat';
import { MessageInput, MessageList, MessageToSend, useChannelActionContext, Window } from 'stream-chat-react';

import './GamingChat.scss';

import { GamingChatHeader } from './GamingChatHeader';
import { GamingMessage } from '../GamingMessage/GamingMessage';
import { GamingMessageInput } from '../GamingMessageInput/GamingMessageInput';
import { GamingThread } from '../GamingThread/GamingThread';
import { useLayoutController } from '../../context/LayoutController';
import type { StreamChatType } from '../../types';

const NOTIFICATION_TEXT_FOR_COMMAND: Record<string, string> = {
  '/ban': 'User banned',
  '/flag': 'User flagged',
  '/mute': 'User muted',
  '/unban': 'User unbanned',
  '/unmute': 'User unmuted',
};

const getNotificationText = (messageText?: string): string | null => {
  for (let command of Object.keys(NOTIFICATION_TEXT_FOR_COMMAND)) {
    if (messageText?.startsWith(command))
      return NOTIFICATION_TEXT_FOR_COMMAND[command];
  }
  return null;
}

export const GamingChatInner = () => {
  const { sendMessage } = useChannelActionContext();
  const { publishAppNotification } = useLayoutController();
  const [timestampEnabled, setShowTimestamp] = useState(false);

  const overrideSubmitHandler = (message: MessageToSend<StreamChatType>) => {
    const { text } = message;

    publishAppNotification(getNotificationText(text))
    const sendMessagePromise = sendMessage(message);
    logChatPromiseExecution(sendMessagePromise, 'send message');
  };

  const toggleTimestamp: MouseEventHandler<HTMLUListElement> = useCallback(() => {
    const elements = document.querySelectorAll<HTMLElement>('.timestamp');
    elements.forEach((element) => {
      if (timestampEnabled) {
        element.style.display = 'none';
      } else {
        element.style.display = 'inline';
      }
    });
    setShowTimestamp((prev) => !prev);
  }, [setShowTimestamp, timestampEnabled]);

  return (
    <>
      <Window>
        <GamingChatHeader
          toggleTimestamp={toggleTimestamp}
          timestampEnabled={timestampEnabled}
        />
        <MessageList Message={GamingMessage} />
        <MessageInput
          focus
          grow
          Input={GamingMessageInput}
          overrideSubmitHandler={overrideSubmitHandler}
        />
      </Window>
      <GamingThread />
    </>
  );
};
