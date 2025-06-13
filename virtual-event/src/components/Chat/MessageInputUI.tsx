import {useMemo} from 'react';
import {
  CooldownTimer,
  TextareaComposer,
  useMessageComposer, useMessageComposerHasSendableData,
  useMessageInputContext,
  useStateStore
} from 'stream-chat-react';

import {CommandBolt, GiphyIcon, GiphySearch, SendArrow} from '../../assets';
import {useEventContext} from '../../contexts/EventContext';
import {EmojiPicker} from './EmojiPicker';
import {CommandSearchSource, type CustomDataManagerState, SearchSource, TextComposerState} from "stream-chat";

const textComposerStateSelector = (state: TextComposerState) => ({
  text: state.text,
});

const customComposerDataSelector = (state: CustomDataManagerState) => ({
  isComposingGiphyText: state.custom.command === 'giphy',
});

const CharacterCounter = () => {
  const {textComposer} = useMessageComposer();
  const {text} = useStateStore(textComposer.state, textComposerStateSelector);
  return <div>{269 - text.length}</div>;
}

const SendButton = () => {
  const {
    cooldownInterval,
    cooldownRemaining,
    handleSubmit,
    setCooldownRemaining,
  } = useMessageInputContext();
  const {customDataManager, textComposer} = useMessageComposer();
  const hasSendableData = useMessageComposerHasSendableData();
  const {text} = useStateStore(textComposer.state, textComposerStateSelector);
  const {isComposingGiphyText} = useStateStore(customDataManager.state, customComposerDataSelector);
  return (
    <button
      className={`input-ui-send-button ${text ? 'text' : ''} ${
        cooldownRemaining ? 'cooldown' : ''
      }`}
      disabled={!hasSendableData}
      onClick={handleSubmit}
    >
      {isComposingGiphyText ? (
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
          <CharacterCounter/>
        </>
      )}
    </button>
  );
}

export const MessageInputUI = () => {
  const {
    cooldownRemaining,
  } = useMessageInputContext();
  const { chatType } = useEventContext();
  const {customDataManager, textComposer} = useMessageComposer();

  const {isComposingGiphyText} = useStateStore(customDataManager.state, customComposerDataSelector);
  const commandSearchSource = useMemo(() => new CommandSearchSource(textComposer.channel),
    [textComposer]
  );

  return (
    <div className='input-ui-container'>
      <div className={`input-ui-input ${isComposingGiphyText ? 'giphy' : ''}`}>
        {isComposingGiphyText && <GiphyIcon />}
        <TextareaComposer placeholder='Say something' />
        {chatType !== 'qa' && (
          <>
            <button
              className={`input-ui-input-commands-button ${cooldownRemaining ? 'cooldown' : ''}`}
              disabled={!!cooldownRemaining}
              onClick={() => {
                commandSearchSource.resetStateAndActivate();
                commandSearchSource.search();
                textComposer.setSuggestions({query: '', searchSource: commandSearchSource as SearchSource, trigger: '/'})
              }}
            >
              <CommandBolt />
            </button>
            {!isComposingGiphyText && <EmojiPicker />}
          </>
        )}
      </div>
      <SendButton />
    </div>
  );
};
