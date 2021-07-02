import React from 'react';
import { logChatPromiseExecution } from 'stream-chat';
import { MessageInput, MessageList, useChannelActionContext, Window } from 'stream-chat-react';

import './GamingChat.scss';

import { GamingChatHeader } from './GamingChatHeader';
import { GamingMessage } from '../GamingMessage/GamingMessage';
import { GamingMessageInput } from '../GamingMessageInput/GamingMessageInput';
import { GamingThread } from '../GamingThread/GamingThread';

export const GamingChatInner = (props) => {
  const {
    setIsFullScreen,
    setPopUpText,
    setShowMembers,
    setShowPopUp,
    setShowUpgrade,
    setTimestamp,
    timestamp,
  } = props;

  const { sendMessage } = useChannelActionContext();

  const overrideSubmitHandler = (message) => {
    const { text } = message;

    if (text.startsWith('/ban')) {
      setPopUpText('User banned');
      return setShowPopUp(true);
    } else if (text.startsWith('/flag')) {
      setPopUpText('User flagged');
      return setShowPopUp(true);
    } else if (text.startsWith('/mute')) {
      setPopUpText('User muted');
      return setShowPopUp(true);
    } else if (text.startsWith('/unban')) {
      setPopUpText('User unbanned');
      return setShowPopUp(true);
    } else if (text.startsWith('/unmute')) {
      setPopUpText('User unmuted');
      return setShowPopUp(true);
    }

    const sendMessagePromise = sendMessage(message);
    logChatPromiseExecution(sendMessagePromise, 'send message');
  };

  return (
    <>
      <Window>
        <GamingChatHeader
          {...props}
          {...{ setIsFullScreen, setShowMembers, timestamp, setTimestamp }}
        />
        <MessageList Message={(props) => <GamingMessage {...props} {...{ timestamp }} />} />
        <MessageInput
          focus
          grow
          Input={(props) => (
            <GamingMessageInput {...props} {...{ setPopUpText, setShowPopUp, setShowUpgrade }} />
          )}
          overrideSubmitHandler={overrideSubmitHandler}
        />
      </Window>
      <GamingThread />
    </>
  );
};
