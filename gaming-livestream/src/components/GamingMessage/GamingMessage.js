import React, { useContext, useMemo, useState } from 'react';
import { ChannelContext } from 'stream-chat-react';

import './GamingMessage.scss';

import ActionDownVote from '../../assets/icons/ActionDownVote';
import ActionThread from '../../assets/icons/ActionThread';
import ActionUpVote from '../../assets/icons/ActionUpVote';
import ReactionDownVote from '../../assets/icons/ReactionDownVote';
import ReactionUpVote from '../../assets/icons/ReactionUpVote';
import UserIcon from '../../assets/icons/UserIcon';
import { getColor } from '../../assets/data';

export const GamingMessage = (props) => {
  const { message } = props;

  const { openThread } = useContext(ChannelContext);

  const onOpenThread = () => {
    const chatPanel = document.querySelector('.str-chat__main-panel');
    chatPanel.style.display = 'none';
    openThread(message);
  };

  const color = useMemo(() => {
    return getColor();
  }, [message.id]); // eslint-disable-line

  const [downVotes, setDownVotes] = useState(0);
  const [upVotes, setUpVotes] = useState(0);

  const hasVotes = upVotes > 0 || downVotes > 0;

  return (
    <div className='custom-message__wrapper'>
      <div className='custom-message__content'>
        <UserIcon />
        <p className='message-owner' style={{ color }}>
          {props.message.user.id}
        </p>
        <p className='message'>{props.message.text}</p>
      </div>
      {hasVotes && (
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
      )}
      <div className='custom-message__actions-wrapper'>
        <ActionUpVote upVote={() => setUpVotes((prev) => prev + 1)} />
        <ActionDownVote downVote={() => setDownVotes((prev) => prev + 1)} />
        <ActionThread openThread={onOpenThread} />
      </div>
    </div>
  );
};
