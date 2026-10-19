import React from 'react';
import { MessageComposer, MessageList } from 'stream-chat-react';
import { encodeToMp3 } from 'stream-chat-react/mp3-encoder';

import { MessagingChannelHeader } from '../../components';

export type ChannelInnerProps = {
  toggleMobile: () => void;
  theme: string;
};

const ChannelInner = (props: ChannelInnerProps) => {
  const { theme, toggleMobile } = props;

  return (
    <>
      <MessagingChannelHeader theme={theme} toggleMobile={toggleMobile} />
      <MessageList />
      <MessageComposer
        focus
        audioRecordingConfig={{ transcoderConfig: { encoder: encodeToMp3 } }}
        audioRecordingEnabled
        asyncMessagesMultiSendEnabled
      />
    </>
  );
};

export default ChannelInner;
