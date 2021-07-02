import { useCallback, useContext, useState } from 'react';
import { ImageDropzone } from 'react-file-utils';
import {
  ChatAutoComplete,
  EmojiPicker,
  MessageInputProps,
  UploadsPreview,
  useChannelStateContext,
  useChatContext,
  useMessageInputContext,
} from 'stream-chat-react';

import './TeamMessageInput.css';

import { TeamTypingIndicator } from '../TeamTypingIndicator/TeamTypingIndicator';

import { GiphyContext } from '../ChannelContainer/ChannelInner';

import {
  BoldIcon,
  CodeSnippet,
  ItalicsIcon,
  LightningBoltSmall,
  SendButton,
  SmileyFace,
  StrikeThroughIcon,
} from '../../assets';

import type {
  TeamAttachmentType,
  TeamChannelType,
  TeamCommandType,
  TeamEventType,
  TeamMessageType,
  TeamReactionType,
  TeamUserType,
} from '../../App';

export type Props = MessageInputProps & {
  pinsOpen?: boolean;
};

export const TeamMessageInput: React.FC<Props> = (props) => {
  const { pinsOpen } = props;

  const { giphyState, setGiphyState } = useContext(GiphyContext);

  const {
    acceptedFiles,
    channel,
    maxNumberOfFiles,
    multipleUploads,
    thread,
  } = useChannelStateContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const { client } = useChatContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const [boldState, setBoldState] = useState(false);
  const [codeState, setCodeState] = useState(false);
  const [italicState, setItalicState] = useState(false);
  const [strikeThroughState, setStrikeThroughState] = useState(false);

  const resetIconState = () => {
    setBoldState(false);
    setCodeState(false);
    setItalicState(false);
    setStrikeThroughState(false);
  };

  const getPlaceholder = () => {
    if (channel.type === 'team') {
      return `#${channel?.data?.name || channel?.data?.id || 'random'}`;
    }

    const members = Object.values(channel.state.members).filter(
      ({ user }) => user?.id !== client.userID,
    );

    if (!members.length || members.length === 1) {
      return members[0]?.user?.name || members[0]?.user?.id || 'Johnny Blaze';
    }

    return 'the group';
  };

  const messageInput = useMessageInputContext<
    TeamAttachmentType,
    TeamChannelType,
    TeamCommandType,
    TeamEventType,
    TeamMessageType,
    TeamReactionType,
    TeamUserType
  >();

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const { value } = event.target;

      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === 'deleteContentBackward'
          ? true
          : false;

      if (messageInput.text.length === 1 && deletePressed) {
        setGiphyState(false);
      }

      if (!giphyState && messageInput.text.startsWith('/giphy') && !messageInput.numberOfUploads) {
        event.target.value = value.replace('/giphy', '');
        setGiphyState(true);
      }

      if (boldState) {
        if (deletePressed) {
          event.target.value = `${value.slice(0, value.length - 2)}**`;
        } else {
          event.target.value = `**${value.replace(/\**/g, '')}**`;
        }
      } else if (codeState) {
        if (deletePressed) {
          event.target.value = `${value.slice(0, value.length - 1)}\``;
        } else {
          event.target.value = `\`${value.replace(/`/g, '')}\``;
        }
      } else if (italicState) {
        if (deletePressed) {
          event.target.value = `${value.slice(0, value.length - 1)}*`;
        } else {
          event.target.value = `*${value.replace(/\*/g, '')}*`;
        }
      } else if (strikeThroughState) {
        if (deletePressed) {
          event.target.value = `${value.slice(0, value.length - 2)}~~`;
        } else {
          event.target.value = `~~${value.replace(/~~/g, '')}~~`;
        }
      }

      messageInput.handleChange(event);
    },
    [
      boldState,
      codeState,
      giphyState,
      italicState,
      messageInput,
      setGiphyState,
      strikeThroughState,
    ],
  );

  const GiphyIcon = () => (
    <div className='giphy-icon__wrapper'>
      <LightningBoltSmall />
      <p className='giphy-icon__text'>GIPHY</p>
    </div>
  );

  return (
    <div className={`team-message-input__wrapper ${(!!thread || pinsOpen) && 'thread-open'}`}>
      <ImageDropzone
        accept={acceptedFiles}
        handleFiles={messageInput.uploadNewFiles}
        multiple={multipleUploads}
        disabled={
          (maxNumberOfFiles !== undefined && messageInput.numberOfUploads >= maxNumberOfFiles) ||
          giphyState
        }
      >
        <div className='team-message-input__input'>
          <div className='team-message-input__top'>
            {giphyState && !messageInput.numberOfUploads && <GiphyIcon />}
            <UploadsPreview />
            <ChatAutoComplete onChange={onChange} placeholder={`Message ${getPlaceholder()}`} />
            <div
              className='team-message-input__button'
              role='button'
              aria-roledescription='button'
              onClick={messageInput.handleSubmit}
            >
              <SendButton />
            </div>
          </div>
          <div className='team-message-input__bottom'>
            <div className='team-message-input__icons'>
              <SmileyFace openEmojiPicker={messageInput.openEmojiPicker} />
              <div className='icon-divider'></div>
              <BoldIcon {...{ boldState, resetIconState, setBoldState }} />
              <ItalicsIcon {...{ italicState, resetIconState, setItalicState }} />
              <StrikeThroughIcon
                {...{
                  resetIconState,
                  strikeThroughState,
                  setStrikeThroughState,
                }}
              />
              <CodeSnippet {...{ codeState, resetIconState, setCodeState }} />
            </div>
          </div>
        </div>
      </ImageDropzone>
      <TeamTypingIndicator type='input' />
      <EmojiPicker />
    </div>
  );
};
