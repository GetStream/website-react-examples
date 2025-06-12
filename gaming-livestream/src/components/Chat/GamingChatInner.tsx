import React, {useCallback} from 'react';
import {type LocalMessage, logChatPromiseExecution, type Message, type SendMessageOptions} from 'stream-chat';
import {MessageInput, MessageList, useChannelActionContext, Window} from 'stream-chat-react';

import {GamingChatHeader} from './GamingChatHeader';
import {GamingMessage} from './GamingMessage';
import {GamingMessageInput} from './GamingMessageInput';
import {GamingThread} from './GamingThread';

import {useLayoutController} from '../../context/LayoutController';
import {useMessageTimestamp} from "../../context/MessageTimestampController";

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
  const {timestampEnabled, toggleTimestamp} = useMessageTimestamp();

  const overrideSubmitHandler = useCallback(({localMessage, message, sendOptions}: {
    cid: string;
    localMessage: LocalMessage;
    message: Message;
    sendOptions: SendMessageOptions;
  }) => {
    const { text } = message;
    publishAppNotification(getNotificationText(text))
    const sendMessagePromise = sendMessage({localMessage, message, options: sendOptions});
    logChatPromiseExecution(sendMessagePromise, 'send message');
  }, [publishAppNotification, sendMessage]);

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
          minRows={1}
          maxRows={8}
          Input={GamingMessageInput}
          overrideSubmitHandler={overrideSubmitHandler}
        />
      </Window>
      <GamingThread />
    </>
  );
};
