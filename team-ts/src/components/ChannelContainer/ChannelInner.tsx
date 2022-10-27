import React, { useCallback } from 'react';
import { logChatPromiseExecution, MessageResponse } from 'stream-chat';

import {
  defaultPinPermissions,
  MessageInput,
  MessageList,
  MessageToSend,
  PinEnabledUserRoles,
  Thread,
  useChannelActionContext,
  Window,
} from 'stream-chat-react';

import { PinnedMessageList } from '../PinnedMessageList/PinnedMessageList';
import { TeamChannelHeader } from '../TeamChannelHeader/TeamChannelHeader';
import { ThreadMessageInput } from '../TeamMessageInput/ThreadMessageInput';

import { useGiphyInMessageContext } from '../../context/GiphyInMessageFlagContext';

import type { StreamChatType } from '../../types';

type ChannelInnerProps = {
  pinsOpen: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setPinsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ChannelInner = (props: ChannelInnerProps) => {
  const { pinsOpen, setIsEditing, setPinsOpen } = props;
  const {inputHasGiphyMessage, clearGiphyFlag} = useGiphyInMessageContext();
  const { sendMessage } = useChannelActionContext<StreamChatType>();

  const teamPermissions: PinEnabledUserRoles = { ...defaultPinPermissions.team, user: true };
  const messagingPermissions: PinEnabledUserRoles = {
    ...defaultPinPermissions.messaging,
    user: true,
  };

  const pinnedPermissions = {
    ...defaultPinPermissions,
    team: teamPermissions,
    messaging: messagingPermissions,
  };

  const overrideSubmitHandler = useCallback((message: MessageToSend) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent as MessageResponse,
      text: message.text,
    };

    const isReply = !!updatedMessage.parent_id;

    if (inputHasGiphyMessage(isReply)) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...updatedMessage, text: updatedText };
    }

    if (sendMessage) {
      const sendMessagePromise = sendMessage(updatedMessage);
      logChatPromiseExecution(sendMessagePromise, 'send message');
      clearGiphyFlag(isReply);
    }
  }, [inputHasGiphyMessage, sendMessage, clearGiphyFlag]);

  return (
      <>
        <Window>
          <TeamChannelHeader {...{ setIsEditing, setPinsOpen }} />
          <MessageList disableQuotedMessages={true} pinPermissions={pinnedPermissions} />
          <MessageInput grow overrideSubmitHandler={overrideSubmitHandler} />
        </Window>
        <Thread additionalMessageInputProps={{ grow: true, Input: ThreadMessageInput, overrideSubmitHandler }} />
        {pinsOpen && <PinnedMessageList setPinsOpen={setPinsOpen} />}
    </>
  );
};
