import React from 'react';
import { ChatAutoComplete, useMessageInput } from 'stream-chat-react';
import SendIcon from '../../assets/icons/SendIcon';
import StarIcon from '../../assets/icons/StarIcon';

import './GamingMessageInput.scss';

export const GamingMessageInput = (props) => {
  const { isTyping } = props;

  const messageInput = useMessageInput(props);

  return (
    <div className='channel-footer'>
      <ChatAutoComplete
        innerRef={messageInput.textareaRef}
        handleSubmit={messageInput.handleSubmit}
        onSelectItem={messageInput.onSelectItem}
        value={messageInput.text}
        maxRows={props.maxRows}
        placeholder='Say something'
        onChange={messageInput.handleChange}
        onPaste={messageInput.onPaste}
        triggers={props.autocompleteTriggers}
        grow={props.grow}
        disabled={props.disabled}
        additionalTextareaProps={props.additionalTextareaProps}
      />
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
        <button onClick={messageInput.handleSubmit}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};
