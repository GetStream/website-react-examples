import React, { useContext } from 'react';
import { ChannelContext, ChatAutoComplete, EmojiPicker, useMessageInput } from 'stream-chat-react';

import EmojiIcon from '../../assets/icons/EmojiIcon';
import SendIcon from '../../assets/icons/SendIcon';
import StarIcon from '../../assets/icons/StarIcon';

import './GamingMessageInput.scss';

export const GamingMessageInput = React.memo((props) => {
  const { setShowUpgrade } = props;

  const { typing } = useContext(ChannelContext);
  const messageInput = useMessageInput(props);

  const openPicker = async () => {
    const picker = document.querySelector('.str-chat__input--emojipicker');

    if (picker?.style.display === 'block' && messageInput.emojiPickerIsOpen) {
      return (picker.style.display = 'none');
    }

    if (picker && picker.style.display !== 'block') {
      picker.style.display = 'block';
    }

    await messageInput.openEmojiPicker();

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
        <ChatAutoComplete
          commands={messageInput.getCommands()}
          innerRef={messageInput.textareaRef}
          handleSubmit={messageInput.handleSubmit}
          onSelectItem={messageInput.onSelectItem}
          value={messageInput.text}
          rows={1}
          maxRows={props.maxRows}
          placeholder='Say something'
          onChange={messageInput.handleChange}
          onPaste={messageInput.onPaste}
          triggers={props.autocompleteTriggers}
          grow={props.grow}
          disabled={props.disabled}
          additionalTextareaProps={props.additionalTextareaProps}
        />
        <EmojiIcon openEmojiPicker={openPicker} />
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
      <EmojiPicker emojiPickerIsOpen={messageInput.emojiPickerIsOpen} onSelectEmoji={selectEmoji} />
    </div>
  );
});
