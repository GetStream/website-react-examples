import React, { useRef, useState } from 'react';
import { ImageDropzone, FileUploadButton } from 'react-file-utils';
import {
  ChatAutoComplete,
  EmojiPicker,
  UploadsPreview,
  useMessageInputContext,
} from 'stream-chat-react';

import { SmileyFace } from '../../assets/SmileyFace';
import { PaperClip } from '../../assets/PaperClip';

import './LiveEventMessageInput.css';

export const LiveEventMessageInput = (props) => {
  const messageInput = useMessageInputContext();

  const [canSend, setCanSend] = useState(true);

  const canSendTimer = useRef(null);

  const handleSubmitDelayed = (event) => {
    if (canSend) {
      messageInput.handleSubmit(event);
      setCanSend(false);
      canSendTimer.current = setTimeout(() => setCanSend(true), props.sloMoDelay * 1000);
    } else {
      event.preventDefault();
    }
  };

  return (
    <div className='live-event-message-input__input'>
      <EmojiPicker />
      <ImageDropzone
        disabled={messageInput.numberOfUploads >= 2}
        handleFiles={messageInput.uploadNewFiles}
      >
        <UploadsPreview />
        <ChatAutoComplete handleSubmit={handleSubmitDelayed} placeholder={'Send a message'} />
      </ImageDropzone>
      <div className='live-event-message-input__input-buttons'>
        <div style={{ height: '18px' }}>
          {messageInput.numberOfUploads < 2 && (
            <FileUploadButton handleFiles={messageInput.uploadNewFiles}>
              <PaperClip />
            </FileUploadButton>
          )}
        </div>
        <div style={{ height: '18px', marginLeft: '11px' }} onClick={messageInput.openEmojiPicker}>
          <SmileyFace />
        </div>
      </div>
    </div>
  );
};
