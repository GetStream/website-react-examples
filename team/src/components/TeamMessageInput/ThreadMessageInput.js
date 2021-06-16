import React, { useCallback, useContext } from 'react';
import { ChatAutoComplete, EmojiPicker, useMessageInputContext } from 'stream-chat-react';

import './ThreadMessageInput.css';

import { GiphyContext } from '../ChannelContainer/ChannelInner';

import {
  LightningBoltSmall,
  SendButton,
  SmileyFace,
} from '../../assets';

export const ThreadMessageInput = (props) => {
  const { giphyState, setGiphyState } = useContext(GiphyContext)

  const messageInput = useMessageInputContext();

  const onChange = useCallback(
    (event) => {
      if (messageInput.text.length === 1 && event.nativeEvent.inputType === 'deleteContentBackward') {
        setGiphyState(false);
      }

      if (messageInput.text.startsWith('/giphy') && !giphyState) {
        event.target.value = event.target.value.replace('/giphy', '');
        setGiphyState(true);
      }

      messageInput.handleChange(event);
    },
    [giphyState, messageInput, setGiphyState],
  );

  const GiphyIcon = () => (
    <div className='giphy-icon__wrapper'>
      <LightningBoltSmall />
      <p className='giphy-icon__text'>GIPHY</p>
    </div>
  );

  return (
    <div className='thread-message-input__wrapper'>
      <div className='thread-message-input__input'>
        {giphyState && <GiphyIcon />}
        <ChatAutoComplete
          onChange={onChange}
          rows={1}
          placeholder='Reply'
        />
        <div className='thread-message-input__icons'>
          <SmileyFace openEmojiPicker={messageInput.openEmojiPicker} />
        </div>
        <div
          className='thread-message-input__button'
          role='button'
          aria-roledescription='button'
          onClick={messageInput.handleSubmit}
        >
          <SendButton />
        </div>
      </div>
      <EmojiPicker />
    </div>
  );
};
