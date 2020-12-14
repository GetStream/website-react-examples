import React from 'react';
import { MessageInput } from 'stream-chat-react';
import SendIcon from '../../assets/icons/SendIcon';
import StarIcon from '../../assets/icons/StarIcon';

import './GamingMessageInput.scss';

export const GamingMessageInput = ({ isTyping }) => {
  return (
    <div className='channel-footer'>
      <MessageInput />
      <div className='channel-footer-separator'>
        <div className='watcher-count'>
          <StarIcon />
          <p>68</p>
        </div>
        {isTyping && (
          <div className='typing-indicators'>
            <div className='indicators'>
              {[1, 2, 3].map((item, i) => (
                <div className='dot' style={{ animationDelay: i * 0.2 + 's' }}></div>
              ))}
            </div>
            <p>a member is typing</p>
          </div>
        )}
        <button>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};
