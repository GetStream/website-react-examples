import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { Attachment, useChannelActionContext, useMessageContext } from 'stream-chat-react';

import './GamingMessage.scss';

import ActionDownVote from '../../assets/icons/ActionDownVote';
import ActionThread from '../../assets/icons/ActionThread';
import ActionUpVote from '../../assets/icons/ActionUpVote';
import ReactionDownVote from '../../assets/icons/ReactionDownVote';
import ReactionUpVote from '../../assets/icons/ReactionUpVote';

import { getColor } from '../../assets/data';

import type { StreamMessage } from 'stream-chat-react/dist/context/ChannelStateContext';
import type { StreamChatType } from '../../types';
import { UserIcon } from '../Chat/UserIcon';

const getTimeStamp = (messageCreatedAt?: StreamMessage<StreamChatType>['created_at']) => {
  if (!messageCreatedAt) return '';

  const createdAt = new Date(messageCreatedAt);
  let lastHours: number | string = createdAt.getHours();
  let lastMinutes: number | string = createdAt.getMinutes();
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

const getReplyButtonText = (reply_count?: number) => {
  if (!reply_count) return '';
  if (reply_count === 1) return '1 reply';
  return `${reply_count} Replies`;
};

export const GamingMessage = () => {
  const { openThread } = useChannelActionContext<StreamChatType>();
  const { handleAction, message } = useMessageContext<StreamChatType>();

  const onOpenThread: MouseEventHandler<HTMLElement> = useCallback((event) => {
    const chatPanel = document.querySelector<HTMLDivElement>('.str-chat__main-panel');
    if (chatPanel) chatPanel.style.display = 'none';
    openThread(message, event);
  }, [openThread, message]);

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
        <UserIcon type={message.user?.userRole}/>
        <span className='timestamp'>
          {getTimeStamp(message.created_at)}
        </span>
        <p className='message-owner' style={{ color }}>
          {message.user?.name || message.user?.id || 'Unknown'}
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
            {getReplyButtonText(message.reply_count)}
          </p>
        )}
      </div>
      <div className='custom-message__actions-wrapper'>
        <button onClick={() => setUpVotes((prev) => prev + 1)}><ActionUpVote /></button>
        <button onClick={() => setDownVotes((prev) => prev + 1)}><ActionDownVote/></button>
        <button onClick={onOpenThread}><ActionThread/></button>
      </div>
    </div>
  );
};
