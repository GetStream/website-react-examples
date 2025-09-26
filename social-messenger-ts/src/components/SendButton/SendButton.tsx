import { SendIcon } from '../../assets';
import React from 'react';
import {SendButtonProps, useMessageComposerHasSendableData} from 'stream-chat-react';

const SendButton = ({sendMessage, ...rest}: SendButtonProps) => {
  const hasSendableData = useMessageComposerHasSendableData();
  return (
    <button
      className='str-chat__send-button'
      disabled={!hasSendableData}
      onClick={sendMessage}
      type='button'
      {...rest}
    >
      <SendIcon/>
    </button>
  );
};

export default SendButton;