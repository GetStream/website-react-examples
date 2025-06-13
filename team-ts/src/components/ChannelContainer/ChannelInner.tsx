import React from 'react';
import {
  defaultPinPermissions,
  MessageInput,
  MessageList,
  PinEnabledUserRoles,
  Thread,
  Window,
} from 'stream-chat-react';

import {PinnedMessageList} from '../PinnedMessageList/PinnedMessageList';
import {TeamChannelHeader} from '../TeamChannelHeader/TeamChannelHeader';
import {ThreadMessageInput} from "../TeamMessageInput/TeamMessageInput";

export const ChannelInner = () => {
  // todo: migrate to channel capabilities once migration guide is available
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

  return (
      <>
        <Window>
          <TeamChannelHeader />
          <MessageList disableQuotedMessages={true} pinPermissions={pinnedPermissions} />
          <MessageInput minRows={1} maxRows={8} />
        </Window>
        <Thread additionalMessageInputProps={{ maxRows: 8, minRows: 1, Input: ThreadMessageInput }} />
        <PinnedMessageList />
    </>
  );
};
