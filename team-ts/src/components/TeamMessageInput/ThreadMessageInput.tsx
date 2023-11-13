import { useCallback } from 'react';
import { ChatAutoComplete, useMessageInputContext } from 'stream-chat-react';

import { GiphyBadge } from './GiphyBadge';
import { SendButtonIcon } from './SendButtonIcon';
import { EmojiPicker } from './EmojiPicker';

import { useGiphyInMessageContext } from '../../context/GiphyInMessageFlagContext';

import type { StreamChatType } from '../../types';

export const ThreadMessageInput = () => {
  const { isComposingGiphyReply, clearGiphyFlagThread, setComposeGiphyReplyFlag } =
    useGiphyInMessageContext();

  const messageInput = useMessageInputContext<StreamChatType>();

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === 'deleteContentBackward';

      if (messageInput.text.length === 1 && deletePressed) {
        clearGiphyFlagThread();
      }

      if (messageInput.text.startsWith('/giphy') && !isComposingGiphyReply()) {
        console.log('replacing');
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
        {isComposingGiphyReply() && <GiphyBadge />}
        <ChatAutoComplete onChange={onChange} placeholder='Reply' />
        <EmojiPicker />

        <button
          className='thread-message-input__send-button'
          disabled={!messageInput.numberOfUploads && !messageInput.text.length}
          onClick={messageInput.handleSubmit}
        >
          <SendButtonIcon />
        </button>
      </div>
    </div>
  );
};
