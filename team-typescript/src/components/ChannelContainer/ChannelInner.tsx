import React, { SetStateAction, useState } from 'react';
import { MessageList, Thread, ThreadHeaderProps, Window } from 'stream-chat-react';

import { ChannelEmptyState } from '../ChannelEmptyState/ChannelEmptyState';
import { TeamChannelHeader } from '../TeamChannelHeader/TeamChannelHeader';
import { TeamMessage } from '../TeamMessage/TeamMessage';
import { TeamMessageInput } from '../TeamMessageInput/TeamMessageInput';
import { ThreadMessageInput } from '../TeamMessageInput/ThreadMessageInput';

import { CloseThreadIcon } from '../../assets';

type ChannelInnerProps = {
  pinsOpen: boolean;
  setIsEditing: React.Dispatch<SetStateAction<boolean>>;
  setPinsOpen: React.Dispatch<SetStateAction<boolean>>;
}

type TeamThreadHeaderProps = ThreadHeaderProps & {
  setPinsOpen?: React.Dispatch<SetStateAction<boolean>>;
}

const ThreadHeader = (props: TeamThreadHeaderProps) => {
  const { closeThread, setPinsOpen, thread } = props;
  const getReplyCount = () => {
    if (!thread?.reply_count) return '';
    if (thread.reply_count === 1) return '1 reply';
    return `${thread.reply_count} Replies`;
  };

  return (
    <div className='custom-thread-header'>
      <div className='custom-thread-header__left'>
        <p className='custom-thread-header__left-title'>Thread</p>
        <p className='custom-thread-header__left-count'>{getReplyCount()}</p>
      </div>
      <CloseThreadIcon {...{ closeThread, setPinsOpen }} />
    </div>
  );
};

export const ChannelInner: React.FC<ChannelInnerProps> = (props) => {
  const { pinsOpen, setIsEditing, setPinsOpen } = props;

  const [pinnedMessages, setPinnedMessages] = useState({});
  const pinnedMessagesIds = Object.keys(pinnedMessages);

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Window>
        <TeamChannelHeader {...{ setIsEditing, setPinsOpen }} />
        <MessageList
          EmptyStateIndicator={ChannelEmptyState}
          Message={(messageProps) => <TeamMessage {...messageProps} {...{ pinnedMessagesIds, setPinnedMessages, setPinsOpen }} />}
          TypingIndicator={() => null}
        />
        <TeamMessageInput {...{ pinsOpen }} />
      </Window>
      <Thread
        additionalMessageListProps={{ TypingIndicator: () => null }}
        Message={(messageProps) => <TeamMessage {...messageProps} />}
        MessageInput={ThreadMessageInput}
        ThreadHeader={(threadProps) => <ThreadHeader {...threadProps} {...{ setPinsOpen }} />}
      />
      {/* {pinsOpen && <PinnedMessageList {...{ pinnedMessages, setPinsOpen }} />} */}
    </div>
  );
};