import React, { useState } from 'react';
import { Channel, useChatContext } from 'stream-chat-react';

import './ChannelContainer.css';

import { ChannelInner } from './ChannelInner';

import { ChannelEmptyState } from '../ChannelEmptyState/ChannelEmptyState';
import { CreateChannel } from '../CreateChannel/CreateChannel';
import { EditChannel } from '../EditChannel/EditChannel';
import { TeamMessage } from '../TeamMessage/TeamMessage';
import { TeamMessageInput } from '../TeamMessageInput/TeamMessageInput';

import { CloseThreadIcon } from '../../assets';

const ThreadHeader = (props) => {
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

export const ChannelContainer = (props) => {
  const { createType, isCreating, isEditing, setIsCreating, setIsEditing } = props;

  const { channel } = useChatContext();

  const [pinsOpen, setPinsOpen] = useState(false);

  if (isCreating) {
    const filters = {};

    return (
      <div className='channel__container'>
        <CreateChannel {...{ createType, filters, setIsCreating }} />
      </div>
    );
  }

  if (isEditing) {
    const filters = {};

    if (channel?.state?.members) {
      const channelMembers = Object.keys(channel.state.members);
      if (channelMembers.length) {
        filters.id = { $nin: channelMembers };
      }
    }

    return (
      <div className='channel__container'>
        <EditChannel {...{ filters, setIsEditing }} />
      </div>
    );
  }

  return (
    <div className='channel__container'>
      <Channel
        EmptyStateIndicator={ChannelEmptyState}
        Input={TeamMessageInput}
        Message={(messageProps, i) => (
          <TeamMessage
            key={i}
            {...messageProps}
            {...{ setPinsOpen }}
          />
        )}
        ThreadHeader={(threadProps) => <ThreadHeader {...threadProps} {...{ setPinsOpen }} />}
        TypingIndicator={() => null}
      >
        <ChannelInner
          {...{
            pinsOpen,
            setIsEditing,
            setPinsOpen,
          }}
        />
      </Channel>
    </div>
  );
};
