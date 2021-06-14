import React, { useMemo, useState } from 'react';
import { Attachment, useChannelActionContext, useMessageContext } from 'stream-chat-react';

import './GamingMessage.scss';

import ActionDownVote from '../../assets/icons/ActionDownVote';
import ActionThread from '../../assets/icons/ActionThread';
import ActionUpVote from '../../assets/icons/ActionUpVote';
import ReactionDownVote from '../../assets/icons/ReactionDownVote';
import ReactionUpVote from '../../assets/icons/ReactionUpVote';

import { getColor, getIcon } from '../../assets/data';

const getTimeStamp = (message) => {
  let lastHours = message.created_at?.getHours();
  let lastMinutes = message.created_at?.getMinutes();
  let half = 'AM';

  if (lastHours === undefined || lastMinutes === undefined) {
    return '';
  }

  if (lastHours > 12) {
    lastHours = lastHours - 12;
    half = 'PM';
  }

  if (lastHours === 0) lastHours = 12;
  if (lastHours === 12) half = 'PM';

  if (lastMinutes.toString().length === 1) {
    lastMinutes = `0${lastMinutes}`;
  }

  return `${lastHours}:${lastMinutes} ${half}`;
};

const getReplyCount = (message) => {
  if (!message?.reply_count) return '';
  if (message.reply_count === 1) return '1 reply';
  return `${message.reply_count} Replies`;
};

export const GamingMessage = (props) => {
  const { timestamp } = props;

  const { openThread } = useChannelActionContext();
  const { handleAction, message } = useMessageContext();

  const onOpenThread = () => {
    const chatPanel = document.querySelector('.str-chat__main-panel');
    chatPanel.style.display = 'none';
    openThread(message);
  };

  const color = useMemo(() => {
    return message.user?.color || getColor();
  }, [message?.id]); // eslint-disable-line

  const [downVotes, setDownVotes] = useState(0);
  const [upVotes, setUpVotes] = useState(0);

  const hasVotes = upVotes > 0 || downVotes > 0;

  const ReactionList = () => (
    <div className='custom-message__reaction-list'>
      {upVotes > 0 && (
        <>
          <ReactionUpVote />
          <p>{upVotes}</p>
        </>
      )}
      {downVotes > 0 && (
        <>
          <ReactionDownVote />
          <p>{downVotes}</p>
        </>
      )}
    </div>
  );

  return (
    <div className='custom-message__wrapper'>
      <div className='custom-message__content'>
        {getIcon(message.user.userRole)}
        <span className='timestamp' style={timestamp ? { display: 'inline' } : {}}>
          {getTimeStamp(message)}
        </span>
        <p className='message-owner' style={{ color }}>
          {message.user.name || message.user.id}
        </p>
        <p className='message'>{message.text}</p>
      </div>
      {message?.attachments && (
        <Attachment attachments={message.attachments} actionHandler={handleAction} />
      )}
      <div className='custom-message__bottom-wrapper'>
        {hasVotes && <ReactionList />}
        {!!message.reply_count && (
          <p onClick={onOpenThread} className='custom-message__reply-count'>
            {getReplyCount(message)}
          </p>
        )}
      </div>
      <div className='custom-message__actions-wrapper'>
        <ActionUpVote upVote={() => setUpVotes((prev) => prev + 1)} />
        <ActionDownVote downVote={() => setDownVotes((prev) => prev + 1)} />
        <ActionThread openThread={onOpenThread} />
      </div>
    </div>
  );
};
