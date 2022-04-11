import React, { useCallback, useContext } from 'react';
import { ImageDropzone } from 'react-file-utils';
import {
  ChatAutoComplete,
  EmojiPicker,
  UploadsPreview,
  useChannelStateContext,
  useMessageInputContext,
} from 'stream-chat-react';

import { GiphyContext } from '../../App';
import { EmojiIcon, LightningBoltSmall, SendIcon } from '../../assets';

import './MessagingInput.css';

const GiphyIcon = () => (
  <div className='giphy-icon__wrapper'>
    <LightningBoltSmall />
    <p className='giphy-icon__text'>GIPHY</p>
  </div>
);

const MessagingInput = () => {
  const { giphyState, setGiphyState } = useContext(GiphyContext);
  const { acceptedFiles, maxNumberOfFiles, multipleUploads } = useChannelStateContext();

  const messageInput = useMessageInputContext();

  const onChange = useCallback(
    (event) => {
      const { value } = event.target;
      const deletePressed = event.nativeEvent?.inputType === 'deleteContentBackward';

      if (messageInput.text.length === 1 && deletePressed) {
        setGiphyState(false);
      }

      if (!giphyState && messageInput.text.startsWith('/giphy') && !messageInput.numberOfUploads) {
        event.target.value = value.replace('/giphy', '');
        setGiphyState(true);
      }

      messageInput.handleChange(event);
    },
    [giphyState, messageInput.numberOfUploads, messageInput.text], // eslint-disable-line
  );

  return (
    <div className='str-chat__messaging-input'>
      <ImageDropzone
        accept={acceptedFiles}
        handleFiles={messageInput.uploadNewFiles}
        multiple={multipleUploads}
        disabled={
          (maxNumberOfFiles !== undefined && messageInput.numberOfUploads >= maxNumberOfFiles) ||
          giphyState
        }
      >
        <UploadsPreview />
        <div className='messaging-input__container'>
          <div
            className='messaging-input__button emoji-button'
            role='button'
            aria-roledescription='button'
            onClick={messageInput.openEmojiPicker}
            ref={messageInput.emojiPickerRef}
          >
            <EmojiIcon />
          </div>
          <div className='messaging-input__input-wrapper'>
            {giphyState && !messageInput.numberOfUploads && <GiphyIcon />}

            <ChatAutoComplete onChange={onChange} rows={1} placeholder='Send a message' />
          </div>
          <div
            className='messaging-input__button'
            role='button'
            aria-roledescription='button'
            onClick={messageInput.handleSubmit}
          >
            <SendIcon />
          </div>
        </div>
      </ImageDropzone>
      <EmojiPicker />
    </div>
  );
};

export default React.memo(MessagingInput);
