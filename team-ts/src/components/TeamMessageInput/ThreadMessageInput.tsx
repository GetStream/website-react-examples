import { useCallback, useContext } from 'react';
import {
  ChatAutoComplete,
  EmojiPicker,
  useMessageInputContext,
} from 'stream-chat-react';

import { GiphyContext } from '../ChannelContainer/ChannelInner';

import './ThreadMessageInput.css';

import { Props } from '../TeamMessageInput/TeamMessageInput';

import { LightningBoltSmall, SendButton, SmileyFace } from '../../assets';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

export const ThreadMessageInput: React.FC<Props> = (props) => {
  const { giphyState, setGiphyState } = useContext(GiphyContext)

  const messageInput = useMessageInputContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === 'deleteContentBackward'
          ? true
          : false;
      
      console.log('asdfasdf');

      if (messageInput.text.length === 1 && deletePressed) {
        setGiphyState (false);
      }

      console.log('messageInput.text IS:', messageInput.text);

      if (messageInput.text.startsWith('/giphy') && !giphyState) {
        console.log('event.target.value IS:', event.target.value);
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
          value={messageInput.text}
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
