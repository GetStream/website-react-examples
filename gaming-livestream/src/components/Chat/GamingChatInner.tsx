import React, {useEffect, useRef} from 'react';
import {MessageComposer, MessageList, useChatContext} from 'stream-chat-react';

import {GamingChatHeader} from './GamingChatHeader';

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
  const { client } = useChatContext();
  const { publishAppNotification } = useLayoutController();
  const {timestampEnabled, toggleTimestamp} = useMessageTimestamp();

  const publishAppNotificationRef = useRef(publishAppNotification);
  publishAppNotificationRef.current = publishAppNotification;

  // v15 replaces MessageComposer's overrideSubmitHandler with a client-level request handler
  useEffect(() => {
    client.config.set({
      channel: {
        requestHandlers: {
          sendMessageRequest: (params, defaultRequest) => {
            publishAppNotificationRef.current(getNotificationText(params.message?.text));
            return defaultRequest(params);
          },
        },
      },
    });
  }, [client]);

  return (
    <>
      <GamingChatHeader
        toggleTimestamp={toggleTimestamp}
        timestampEnabled={timestampEnabled}
      />
      <MessageList />
      <MessageComposer
        focus
        minRows={1}
        maxRows={8}
      />
    </>
  );
};
