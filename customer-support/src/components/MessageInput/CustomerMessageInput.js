import React, { useEffect } from 'react';
import { ImageDropzone, FileUploadButton } from 'react-file-utils';
import {
  ChatAutoComplete,
  EmojiPicker,
  UploadsPreview,
  useChannelStateContext,
  useMessageInputContext,
} from 'stream-chat-react';

import './CustomerMessageInput.css';

import { FileIcon, SmileyFace } from '../../assets';

export const CustomerMessageInput = (props) => {
  const { open, setOpen } = props;

  const { acceptedFiles, maxNumberOfFiles, multipleUploads } = useChannelStateContext();
  const messageInput = useMessageInputContext();

  useEffect(() => {
    if (open) {
      messageInput.textareaRef.current.focus();
    } else {
      messageInput.textareaRef.current.blur();
    }
  }, [messageInput.textareaRef, open]);

  useEffect(() => {
    if (messageInput.text) {
      setOpen(true);
    }
  }, [messageInput.text, setOpen]);

  const handleSubmit = (event) => {
    if (messageInput.text.startsWith('/')) {
      event.target.value = ''; // eslint-disable-line
      return messageInput.handleChange(event);
    }
    return messageInput.handleSubmit(event);
  };

  return (
    <div className='support-message-input__wrapper'>
      <ImageDropzone
        accept={acceptedFiles}
        handleFiles={messageInput.uploadNewFiles}
        multiple={multipleUploads}
        disabled={
          maxNumberOfFiles !== undefined && messageInput.numberOfUploads >= maxNumberOfFiles
        }
      >
        <div className='support-message-input__input'>
          <UploadsPreview />
          <div className='support-message-input__input-wrapper'>
            <ChatAutoComplete
              handleSubmit={handleSubmit}
              rows={1}
              placeholder='Ask us a question'
            />
            <SmileyFace openEmojiPicker={messageInput.openEmojiPicker} />
            <FileUploadButton handleFiles={messageInput.uploadNewFiles}>
              <FileIcon />
            </FileUploadButton>
          </div>
        </div>
      </ImageDropzone>
      <EmojiPicker />
    </div>
  );
};
