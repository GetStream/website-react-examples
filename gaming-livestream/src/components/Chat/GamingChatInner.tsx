import React, {useEffect, useRef} from 'react';
import type {Thread} from 'stream-chat';
import {MessageComposer, MessageList, useChatContext} from 'stream-chat-react';

import {GamingChatHeader} from './GamingChatHeader';
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

// overrideSubmitHandler is gone; a send request handler is registered per client instead
const useCommandNotifications = () => {
  const { client } = useChatContext();
  const { publishAppNotification } = useLayoutController();
  const publishRef = useRef(publishAppNotification);
  publishRef.current = publishAppNotification;

  useEffect(() => {
    client.config.set({
      channel: {
        requestHandlers: {
          sendMessageRequest: (params, defaultRequest) => {
            publishRef.current(getNotificationText(params.message?.text));
            return defaultRequest(params);
          },
        },
      },
    });
    return () => client.config.reset('channel');
  }, [client]);
};

export const GamingChatInner = ({ thread }: { thread?: Thread }) => {
  const {timestampEnabled, toggleTimestamp} = useMessageTimestamp();

  useCommandNotifications();

  return (
    <>
      {/* stays mounted while a thread is open, so the list keeps its scroll position */}
      <div className='gaming-channel-main' hidden={!!thread}>
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
      </div>
      {thread && <GamingThread thread={thread} />}
    </>
  );
};
