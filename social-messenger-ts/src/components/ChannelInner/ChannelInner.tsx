import React from 'react';
import { MessageInput, MessageList, Thread, Window } from 'stream-chat-react';
import { encodeToMp3 } from 'stream-chat-react/mp3-encoder';

import { MessagingChannelHeader} from '../../components';

export type ChannelInnerProps = {
  toggleMobile: () => void;
  theme: string;
};

const ChannelInner = (props: ChannelInnerProps) => {
  const { theme, toggleMobile } = props;

  const actions = ['delete', 'edit', 'flag', 'markUnread', 'mute', 'react', 'reply'];

  return (
    <>
      <Window>
        <MessagingChannelHeader theme={theme} toggleMobile={toggleMobile} />
        <MessageList messageActions={actions} />
        <MessageInput
          focus
          audioRecordingConfig={{ transcoderConfig: { encoder: encodeToMp3 } }}
          audioRecordingEnabled
          asyncMessagesMultiSendEnabled
        />
      </Window>
      <Thread />
    </>
  );
};

export default ChannelInner;
