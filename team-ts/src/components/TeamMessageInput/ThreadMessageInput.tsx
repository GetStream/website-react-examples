import { useCallback, useState } from 'react';
import { ChatAutoComplete, EmojiPicker, useMessageInputContext } from 'stream-chat-react';
import { usePopper } from 'react-popper';

import { GiphyIcon } from './GiphyIcon';

import { SendButton, SmileyFace } from '../../assets';
import type { StreamChatType } from '../../types';
import { useGiphyInMessageContext } from '../../context/GiphyInMessageFlagContext';

export const ThreadMessageInput = () => {
  const { isComposingGiphyReply, clearGiphyFlagThread, setComposeGiphyReplyFlag } = useGiphyInMessageContext();

  const messageInput = useMessageInputContext<StreamChatType>();

  const [referenceElement, setReferenceElement] = useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
  const {styles, attributes} = usePopper(referenceElement, popperElement, {
    placement: 'top-end',
  });

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === 'deleteContentBackward';
      
      if (messageInput.text.length === 1 && deletePressed) {
        clearGiphyFlagThread();
      }

      if (messageInput.text.startsWith('/giphy') && !isComposingGiphyReply()) {
        console.log('replacing')
        event.target.value = event.target.value.replace('/giphy', '');
        setComposeGiphyReplyFlag();
      }

      messageInput.handleChange(event);
    },
    [clearGiphyFlagThread, messageInput, setComposeGiphyReplyFlag, isComposingGiphyReply],
  );

  return (
    <div className='thread-message-input__wrapper'>
      <div className='thread-message-input__input'>
        {isComposingGiphyReply() && <GiphyIcon />}
        <ChatAutoComplete
          onChange={onChange}
          placeholder='Reply'
        />
        <div className='thread-message-input__icons' ref={setReferenceElement}>
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
      { messageInput.emojiPickerIsOpen && (
        <div
          className='str-chat__message-textarea-emoji-picker-container'
          style={styles.popper}
          {...attributes.popper}
          ref={setPopperElement}
        >
          <EmojiPicker />
        </div>
      )}
    </div>
  );
};
