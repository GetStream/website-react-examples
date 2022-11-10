import React from 'react';
import {
  ChatAutoComplete,
  EmojiPicker,
  useChannelStateContext,
  useMessageInputContext,
  useTypingContext,
} from 'stream-chat-react';

import EmojiIcon from '../../../assets/icons/EmojiIcon';
import SendIcon from '../../../assets/icons/SendIcon';
import StarIcon from '../../../assets/icons/StarIcon';

import { useLayoutController } from '../../../context/LayoutController';
import type { StreamChatType } from '../../../types';

export const GamingMessageInput = React.memo(() => {
  const { showUpgradePopup } = useLayoutController();
  const { thread } = useChannelStateContext<StreamChatType>();
  const { typing } = useTypingContext<StreamChatType>();
  const messageInput = useMessageInputContext<StreamChatType>();

  return (
    <div className='channel-footer'>
      <div className='channel-footer__top'>
        <ChatAutoComplete rows={1} placeholder='Say something' />
        {!thread && <div onClick={messageInput.openEmojiPicker} style={{ cursor: 'pointer', display: 'flex' }}><EmojiIcon /></div>}
      </div>
      <div className='channel-footer__bottom'>
        <div onClick={showUpgradePopup} className='watcher-count'>
          <StarIcon />
          <p>68</p>
        </div>
        {typing && !!Object.keys(typing).length && (
          <div className='typing-indicators'>
            <div className='indicators'>
              <div className='dot' style={{ animationDelay: '0.2s' }}></div>
              <div className='dot' style={{ animationDelay: '0.4s' }}></div>
              <div className='dot' style={{ animationDelay: '0.6s' }}></div>
            </div>
            <p>a member is typing</p>
          </div>
        )}
        <button className={messageInput.text ? 'text' : ''} disabled={!messageInput.text} onClick={messageInput.handleSubmit}>
          <SendIcon />
        </button>
      </div>
      {!thread && (
        <EmojiPicker/>
      )}
    </div>
  );
});
