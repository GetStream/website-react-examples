import React, { useEffect } from 'react';
import { FileUploadButton, ImageDropzone } from 'react-file-utils';
import {
  ChatAutoComplete,
  EmojiPicker,
  UploadsPreview,
  useChannelStateContext,
  useChatContext,
  useMessageInputContext,
} from 'stream-chat-react';

import './AgentMessageInput.css';

import { FileIcon, SmileyFace } from '../../assets';

const automatedResponses = [
  'Great! We have many resources on our website detailing various pricing plans, including which features are available. And, if you’re interested, follow the links at the bottom of each section to speak with our sales team: https://getstream.io/pricing/chat/',
  'Got it. Our Enterprise program is one of the most popular among customers. You can find everything you need by following this link to our website: https://getstream.io/enterprise/',
  'Good choice. We are always looking to add talented people to our team. You can find all of our current job listings on our website: https://getstream.io/team/',
  "Great. Can you describe what you're looking for?",
];

export const AgentMessageInput = () => {
  const messageInput = useMessageInputContext();

  const { acceptedFiles, maxNumberOfFiles, multipleUploads } = useChannelStateContext();
  const { client } = useChatContext();

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
          <UploadsPreview />
          <div className='agent-message-input__input-wrapper'>
            <ChatAutoComplete rows={1} placeholder='Send a message' />
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
