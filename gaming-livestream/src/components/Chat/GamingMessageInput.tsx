import React from 'react';
import {
  ChatAutoComplete,
  EmojiPicker,
  useChannelStateContext,
  useMessageInputContext,
  useTypingContext,
} from 'stream-chat-react';

import EmojiIcon from '../../assets/icons/EmojiIcon';
import SendIcon from '../../assets/icons/SendIcon';
import StarIcon from '../../assets/icons/StarIcon';

import {useLayoutController} from '../../context/LayoutController';

import type {StreamChatType} from '../../types';

const TypingIndicator = () => (
    <div className='typing-indicator'>
      <div className='dots'>
        <div className='dot'></div>
        <div className='dot'></div>
        <div className='dot'></div>
      </div>
      <p>a member is typing</p>
    </div>
)

export const GamingMessageInput = React.memo(() => {
  const { showUpgradePanel } = useLayoutController();
  const { thread } = useChannelStateContext<StreamChatType>();
  const { typing } = useTypingContext<StreamChatType>();
  const messageInput = useMessageInputContext<StreamChatType>();

  return (
    <div className='channel-footer'>
      {!thread && (
          <EmojiPicker/>
      )}
      <div className='channel-footer__top'>
        <ChatAutoComplete rows={1} placeholder='Say something' />
        {!thread && <button className='emoji-button' onClick={messageInput.openEmojiPicker}><EmojiIcon /></button>}
      </div>
      <div className='channel-footer__bottom'>
        <button onClick={showUpgradePanel} className='watcher-count-button'>
          <StarIcon />
          <p>68</p>
        </button>
        {typing && !!Object.keys(typing).length && (
          <TypingIndicator/>
        )}
        <button className='send-message-button' disabled={!messageInput.text} onClick={messageInput.handleSubmit}>
          <SendIcon />
        </button>
      </div>

    </div>
  );
});
