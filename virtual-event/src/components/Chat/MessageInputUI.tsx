import { useCallback, useEffect, useState } from 'react';
import {
  ChatAutoComplete,
  CooldownTimer,
  EmojiPicker,
  useMessageInputContext,
} from 'stream-chat-react';

import { CommandBolt, EmojiPickerIcon, GiphyIcon, GiphySearch, SendArrow } from '../../assets';
import { useEventContext } from '../../contexts/EventContext';
import { useGiphyContext } from '../../contexts/GiphyContext';


export const MessageInputUI = () => {

  const {
    closeCommandsList,
    cooldownInterval,
    cooldownRemaining,
    emojiPickerRef,
    handleChange,
    handleSubmit,
    numberOfUploads,
    openCommandsList,
    openEmojiPicker,
    setCooldownRemaining,
    text,
  } = useMessageInputContext();

  const { chatType } = useEventContext();
  const { giphyState, setGiphyState } = useGiphyContext();

  const [commandsOpen, setCommandsOpen] = useState(false);


  useEffect(() => {
    const handleClick = () => {
      closeCommandsList();
      setCommandsOpen(false);
    };

    if (commandsOpen) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [commandsOpen]); // eslint-disable-line

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const { value } = event.target;

      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === 'deleteContentBackward';

      if (text.length === 1 && deletePressed) {
        setGiphyState(false);
      }

      if (!giphyState && text.startsWith('/giphy') && !numberOfUploads) {
        event.target.value = value.replace('/giphy', '');
        setGiphyState(true);
      }

      handleChange(event);
    },
    [text, giphyState, numberOfUploads], // eslint-disable-line
  );

  const handleCommandsClick = () => {
    openCommandsList();
    setGiphyState(false);
    setCommandsOpen(true);
  };

  return (
    <div className='input-ui-container'>
      <EmojiPicker />
      <div className={`input-ui-input ${giphyState ? 'giphy' : ''}`}>
        {giphyState && !numberOfUploads && <GiphyIcon />}
        <ChatAutoComplete onChange={onChange} placeholder='Say something' />
        {chatType !== 'qa' && (
          <>
            <div
              className={`input-ui-input-commands-button ${cooldownRemaining ? 'cooldown' : ''}`}
              onClick={cooldownRemaining ? () => null : handleCommandsClick}
              role='button'
            >
              <CommandBolt />
            </div>
            {!giphyState && (
              <div
                className={`input-ui-input-emoji-picker-button ${
                  cooldownRemaining ? 'cooldown' : ''
                }`}
                ref={emojiPickerRef}
                onClick={cooldownRemaining ? () => null : openEmojiPicker}
              >
                <EmojiPickerIcon />
              </div>
            )}
          </>
        )}
      </div>
      <button
        className={`input-ui-send-button ${text ? 'text' : ''} ${
          cooldownRemaining ? 'cooldown' : ''
        }`}
        disabled={!text}
        onClick={handleSubmit}
      >
        {giphyState ? (
          <GiphySearch />
        ) : cooldownRemaining ? (
          <div className='input-ui-send-cooldown'>
            <CooldownTimer
              cooldownInterval={cooldownInterval}
              setCooldownRemaining={setCooldownRemaining}
            />
          </div>
        ) : (
          <>
            <SendArrow />
            <div>{269 - text.length}</div>
          </>
        )}
      </button>
    </div>
  );
};
