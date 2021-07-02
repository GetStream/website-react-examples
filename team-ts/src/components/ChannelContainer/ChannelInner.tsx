import React, { useState } from 'react';
import { MessageResponse, logChatPromiseExecution } from 'stream-chat';

import {
  defaultPinPermissions,
  MessageList,
  MessageInput,
  PinEnabledUserRoles,
  Thread,
  useChannelActionContext,
  Window,
  MessageToSend,
} from 'stream-chat-react';

import { PinnedMessageList } from '../PinnedMessageList/PinnedMessageList';
import { TeamChannelHeader } from '../TeamChannelHeader/TeamChannelHeader';
import { ThreadMessageInput } from '../TeamMessageInput/ThreadMessageInput';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

type InnerProps = {
  pinsOpen: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setPinsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type GiphyStateObj = {
  giphyState: boolean;
  setGiphyState: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GiphyContext = React.createContext<GiphyStateObj>({} as GiphyStateObj);

export const ChannelInner: React.FC<InnerProps> = (props) => {
  const { pinsOpen, setIsEditing, setPinsOpen } = props;

  const [giphyState, setGiphyState] = useState(false);

  const giphyStateObj = {
    giphyState: giphyState,
    setGiphyState,
  };

  const { sendMessage } = useChannelActionContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

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

  const overrideSubmitHandler = (message: MessageToSend) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent as MessageResponse,
      text: message.text,
    };

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...updatedMessage, text: updatedText };
    }

    if (sendMessage) {
      const sendMessagePromise = sendMessage(updatedMessage);
      logChatPromiseExecution(sendMessagePromise, 'send message');
      setGiphyState(false);
    }
  };

  return (
    <GiphyContext.Provider value={giphyStateObj}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <TeamChannelHeader {...{ setIsEditing, setPinsOpen }} />
          <MessageList disableQuotedMessages={true} pinPermissions={pinnedPermissions} />
          <MessageInput grow overrideSubmitHandler={overrideSubmitHandler} />
        </Window>
        <Thread additionalMessageInputProps={{ grow: true, Input: ThreadMessageInput }} />
        {pinsOpen && <PinnedMessageList setPinsOpen={setPinsOpen} />}
      </div>
    </GiphyContext.Provider>
  );
};
