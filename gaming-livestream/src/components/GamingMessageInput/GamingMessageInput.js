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

import './GamingMessageInput.scss';

export const GamingMessageInput = React.memo((props) => {
  const { setShowUpgrade } = props;

  const { thread } = useChannelStateContext();
  const { typing } = useTypingContext();

  const messageInput = useMessageInputContext();

  const openPicker = async (event) => {
    const picker = document.querySelector('.str-chat__input--emojipicker');

    if (picker?.style.display === 'block' && messageInput.emojiPickerIsOpen) {
      return (picker.style.display = 'none');
    }

    if (picker && picker.style.display !== 'block') {
      picker.style.display = 'block';
    }

    await messageInput.openEmojiPicker(event);

    const secondCheck = document.querySelector('.str-chat__input--emojipicker');
    if (secondCheck && !secondCheck.style.display) {
      secondCheck.style.display = 'block';
    }
  };

  const selectEmoji = (emoji) => {
    messageInput.onSelectEmoji(emoji);
    const picker = document.querySelector('.str-chat__input--emojipicker');
    picker.style.display = 'none';
  };

  return (
    <div className='channel-footer'>
      <div className='channel-footer__top'>
        <ChatAutoComplete rows={1} placeholder='Say something' />
        {!thread && <EmojiIcon openEmojiPicker={openPicker} />}
      </div>
      <div className='channel-footer__bottom'>
        <div onClick={() => setShowUpgrade(true)} className='watcher-count'>
          <StarIcon />
          <p>68</p>
        </div>
        {!!Object.keys(typing).length && (
          <div className='typing-indicators'>
            <div className='indicators'>
              {[1, 2, 3].map((item, i) => (
                <div className='dot' style={{ animationDelay: i * 0.2 + 's' }}></div>
              ))}
            </div>
            <p>a member is typing</p>
          </div>
        )}
        <button className={messageInput.text ? 'text' : ''} onClick={messageInput.handleSubmit}>
          <SendIcon text={messageInput.text} />
        </button>
      </div>
      {!thread && (
        <EmojiPicker
          emojiPickerIsOpen={messageInput.emojiPickerIsOpen}
          onSelectEmoji={selectEmoji}
        />
      )}
    </div>
  );
});
