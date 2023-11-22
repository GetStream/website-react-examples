import React from 'react';
import {
  ChatAutoComplete,
  useChannelStateContext,
  useMessageInputContext,
  useTypingContext,
} from 'stream-chat-react';
import { EmojiPicker } from 'stream-chat-react/emojis';

import SendIcon from '../../assets/icons/SendIcon';
import StarIcon from '../../assets/icons/StarIcon';
import EmojiIcon from '../../assets/icons/EmojiIcon';

import { useLayoutController } from '../../context/LayoutController';

import type { StreamChatType } from '../../types';

const TypingIndicator = () => (
  <div className='typing-indicator'>
    <div className='dots'>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
    </div>
    <p>a member is typing</p>
  </div>
);

export const GamingMessageInput = React.memo(() => {
  const { showUpgradePanel } = useLayoutController();
  const { thread } = useChannelStateContext<StreamChatType>();
  const { typing } = useTypingContext<StreamChatType>();
  const messageInput = useMessageInputContext<StreamChatType>();

  return (
    <div className='channel-footer'>
      <div className='channel-footer__top'>
        <ChatAutoComplete rows={1} placeholder='Say something' />
        {!thread && (
          <EmojiPicker
            popperOptions={{ placement: 'top-end', strategy: 'fixed' }}
            pickerProps={{ theme: 'auto', perLine: 7 }}
            ButtonIconComponent={EmojiIcon}
            buttonClassName='emoji-button'
          />
        )}
      </div>
      <div className='channel-footer__bottom'>
        <button onClick={showUpgradePanel} className='watcher-count-button'>
          <StarIcon />
          <p>68</p>
        </button>
        {typing && !!Object.keys(typing).length && <TypingIndicator />}
        <button
          className='send-message-button'
          disabled={!messageInput.text}
          onClick={messageInput.handleSubmit}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
});
