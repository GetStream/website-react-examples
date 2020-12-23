import React, { useContext, useRef, useState } from 'react';
import { ImageDropzone, FileUploadButton } from 'react-file-utils';
import { ChannelContext, ChatAutoComplete, EmojiPicker, useMessageInput } from 'stream-chat-react';
import { SmileyFace } from '../../assets/SmileyFace';
import { PaperClip } from '../../assets/PaperClip';
import { UploadsPreview } from './UploadsPreview';

import './LiveEventMessageInput.css';

export const LiveEventMessageInput = (props) => {
  const { sendMessage, thread } = useContext(ChannelContext);
  const messageInput = useMessageInput({
    ...props,
    sendMessage,
    parent: thread,
  });
  const [canSend, setCanSend] = useState(true);

  const canSendTimer = useRef(null);

  const selectEmoji = (emoji) => {
    messageInput.onSelectEmoji(emoji);
  };

  const handleSubmitDelayed = (e) => {
    if (canSend) {
      messageInput.handleSubmit(e);
      setCanSend(false);
      canSendTimer.current = setTimeout(() => setCanSend(true), props.sloMoDelay * 1000);
    } else {
      e.preventDefault();
    }
  };

  return (
    <div className='live-event-message-input__input'>
      <EmojiPicker {...messageInput} onSelectEmoji={selectEmoji} />
      <ImageDropzone disabled={messageInput.numberOfUploads >= 2} handleFiles={messageInput.uploadNewFiles}>
        <UploadsPreview {...messageInput} />
        <ChatAutoComplete
          commands={messageInput.getCommands()}
          innerRef={messageInput.textareaRef}
          handleSubmit={handleSubmitDelayed}
          onChange={messageInput.handleChange}
          onSelectItem={messageInput.onSelectItem}
          value={messageInput.text}
          placeholder={'Send a message'}
          onPaste={messageInput.onPaste}
        />
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
