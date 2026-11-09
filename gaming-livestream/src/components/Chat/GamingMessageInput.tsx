import React from 'react';
import type { ChannelStateData } from 'stream-chat';
import {
  TextareaComposer,
  useChannel,
  useMessageComposerHasSendableData,
  useMessageComposerSubmitFn,
  useStateStore,
  useThreadContext,
} from 'stream-chat-react';
import {EmojiPicker} from 'stream-chat-react/emojis';

import SendIcon from '../../assets/icons/SendIcon';
import StarIcon from '../../assets/icons/StarIcon';
import EmojiIcon from '../../assets/icons/EmojiIcon';

import {useLayoutController} from '../../context/LayoutController';

const TypingIndicator = () => (
  <div className='typing-indicator'>
    <div className='dots'>
      <div className='dot'></div>
      <div className='dot'></div>
      <div className='dot'></div>
    </div>
    <p>a member is typing</p>
  </div>
);

const typingSelector = ({ typing }: ChannelStateData) => ({ typing });

const SendMessageButton = () => {
  const handleSubmit = useMessageComposerSubmitFn();
  const hasSendableData = useMessageComposerHasSendableData();
  return (
    <button
      className='send-message-button'
      disabled={!hasSendableData}
      onClick={handleSubmit}
    >
      <SendIcon/>
    </button>
  );
};

export const GamingMessageInput = React.memo(() => {
  const { showUpgradePanel } = useLayoutController();
  const thread = useThreadContext();
  const { typing } = useStateStore(useChannel().state, typingSelector);

  return (
    <div className='channel-footer'>
      <div className='channel-footer__top'>
        <TextareaComposer rows={1} placeholder='Say something' />
        {!thread && (
          <EmojiPicker
            placement='top-end'
            pickerProps={{ theme: 'auto', perLine: 7 }}
            ButtonIconComponent={EmojiIcon}
            buttonClassName='emoji-button'
          />
        )}
      </div>
      <div className='channel-footer__bottom'>
        <button onClick={showUpgradePanel} className='watcher-count-button'>
          <StarIcon />
          <p>68</p>
        </button>
        {typing && !!Object.keys(typing).length && <TypingIndicator />}
        <SendMessageButton/>
      </div>
    </div>
  );
});
