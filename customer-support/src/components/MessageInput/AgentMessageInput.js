import React, { useContext, useEffect } from 'react';
import { FileUploadButton, ImageDropzone } from 'react-file-utils';
import {
  ChannelContext,
  ChatAutoComplete,
  ChatContext,
  EmojiPicker,
  useMessageInput,
} from 'stream-chat-react';

import './AgentMessageInput.css';

import { UploadsPreview } from './UploadsPreview';

import { FileIcon, SmileyFace } from '../../assets';

const automatedResponses = [
  'Great! We have many resources on our website detailing various pricing plans, including which features are available. And, if you’re interested, follow the links at the bottom of each section to speak with our sales team: https://getstream.io/pricing/chat/',
  'Got it. Our Enterprise program is one of the most popular among customers. You can find everything you need by following this link to our website: https://getstream.io/enterprise/',
  'Good choice. We are always looking to add talented people to our team. You can find all of our current job listings on our website: https://getstream.io/enterprise/',
  "Great. Can you describe what you're looking for?",
];

export const AgentMessageInput = (props) => {
  const messageInput = useMessageInput(props);

  const { acceptedFiles, maxNumberOfFiles, multipleUploads } = useContext(ChannelContext);
  const { client } = useContext(ChatContext);

  useEffect(() => {
    const handleEvent = async (event) => {
      const { index } = event.message;

      if (typeof index === 'number') {
        try {
          const [channel] = await client.queryChannels({ cid: event.cid });

          setTimeout(
            () =>
              channel.sendMessage({
                text: automatedResponses[index],
                automated: true,
              }),
            1000,
          );
        } catch (e) {
          console.log('Auto response error:', e);
        }
      }
    };

    client.on('message.new', handleEvent);
    return () => client.off('message.new', handleEvent);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='agent-message-input__wrapper'>
      <ImageDropzone
        accept={acceptedFiles}
        handleFiles={messageInput.uploadNewFiles}
        multiple={multipleUploads}
        disabled={
          maxNumberOfFiles !== undefined && messageInput.numberOfUploads >= maxNumberOfFiles
        }
      >
        <div className='agent-message-input__input'>
          <UploadsPreview {...messageInput} />
          <div className='agent-message-input__input-wrapper'>
            <ChatAutoComplete
              commands={messageInput.getCommands()}
              innerRef={messageInput.textareaRef}
              handleSubmit={messageInput.handleSubmit}
              onSelectItem={messageInput.onSelectItem}
              onChange={messageInput.handleChange}
              value={messageInput.text}
              rows={1}
              maxRows={props.maxRows}
              placeholder='Send a message'
              onPaste={messageInput.onPaste}
              triggers={props.autocompleteTriggers}
              grow={props.grow}
              disabled={props.disabled}
              additionalTextareaProps={{
                ...props.additionalTextareaProps,
              }}
            />
            <SmileyFace openEmojiPicker={messageInput.openEmojiPicker} />
            <FileUploadButton handleFiles={messageInput.uploadNewFiles}>
              <FileIcon />
            </FileUploadButton>
          </div>
        </div>
      </ImageDropzone>
      <EmojiPicker {...messageInput} />
    </div>
  );
};
