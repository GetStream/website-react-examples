import React from 'react';

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

  // const hasVotes = message.upVotes > 0 || message.downVotes > 0;
  const hasVotes = true;

  return (
    <div className='custom-message__wrapper'>
      <div className='custom-message__content'>
        <UserIcon />
        <p className='message-owner' style={{ color: getColor() }}>
          {props.message.user.id}
        </p>
        <p className='message'>{props.message.text}</p>
      </div>
      {hasVotes && (
        <div className='custom-message__reaction-list'>
          {/* {message.upVotes > 0 && ( */}
          {
            <>
              <ReactionUpVote />
              <p>10</p>
              {/* <p>message.upVotes</p> */}
            </>
          }
          {/* {message.downVotes > 0 && ( */}
          {
            <>
              <ReactionDownVote />
              <p>8</p>
              {/* <p>message.downVotes</p> */}
            </>
          }
        </div>
      )}
      <div className='custom-message__actions-wrapper'>
        <ActionUpVote />
        <ActionDownVote />
        <ActionThread />
      </div>
    </div>
  );
};
