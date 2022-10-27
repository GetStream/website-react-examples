import { useCallback, useMemo, useState } from 'react';
import {
  AttachmentPreviewList,
  ChatAutoComplete,
  EmojiPicker,
  MessageInputProps,
  SendButton,
  useChannelStateContext,
  useChatContext,
  useMessageInputContext,
} from 'stream-chat-react';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';

import { GiphyIcon } from './GiphyIcon';

import { TeamTypingIndicator } from '../TeamTypingIndicator/TeamTypingIndicator';

import { BoldIcon, CodeSnippet, ItalicsIcon, SmileyFace, StrikeThroughIcon } from '../../assets';
import type { StreamChatType } from '../../types';
import { useGiphyInMessageContext } from '../../context/GiphyInMessageFlagContext';

export type ThreadMessageInputProps = MessageInputProps & {
  pinsOpen?: boolean;
};

export const TeamMessageInput = (props: ThreadMessageInputProps) => {
  const { pinsOpen } = props;

  const { isComposingGiphyMessage, clearGiphyFlagMainInput, setComposeGiphyMessageFlag } = useGiphyInMessageContext();

  const {
    acceptedFiles = [],
    channel,
    multipleUploads,
    thread,
  } = useChannelStateContext<StreamChatType>();

  const { client } = useChatContext<StreamChatType>();

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

  const messageInput = useMessageInputContext<StreamChatType>();
  const { numberOfUploads, text, uploadNewFiles, maxFilesLeft, isUploadEnabled } = messageInput;

  const accept = useMemo(
    () =>
      acceptedFiles.reduce<Record<string, Array<string>>>((mediaTypeMap, mediaType) => {
        mediaTypeMap[mediaType] ??= [];
        return mediaTypeMap;
      }, {}),
    [acceptedFiles],
  );

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const { value } = event.target;

      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === 'deleteContentBackward';

      if (messageInput.text.length === 1 && deletePressed) {
        clearGiphyFlagMainInput();
      }

      if (!isComposingGiphyMessage() && messageInput.text.startsWith('/giphy') && !messageInput.numberOfUploads) {
        event.target.value = value.replace('/giphy', '');
        setComposeGiphyMessageFlag();
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
      italicState,
      messageInput,
      strikeThroughState,
      clearGiphyFlagMainInput,
      isComposingGiphyMessage,
      setComposeGiphyMessageFlag,
    ],
  );

  const { getRootProps, isDragActive, isDragReject } = useDropzone({
    accept,
    disabled: !isUploadEnabled || maxFilesLeft === 0,
    multiple: multipleUploads,
    noClick: true,
    onDrop: uploadNewFiles,
  });


  return (
    <div {...getRootProps({ className: clsx(`team-message-input__wrapper`, { 'thread-open': !!thread || pinsOpen }) })}>
      {isDragActive && (
        <div
          className={clsx('str-chat__dropzone-container', {
            'str-chat__dropzone-container--not-accepted': isDragReject,
          })}
        >
          {!isDragReject && <p>Drag your files here</p>}
          {isDragReject && <p>Some of the files will not be accepted</p>}
        </div>
      )}
      <div className='team-message-input__input'>
        <div className='team-message-input__top'>
          {!!numberOfUploads && <AttachmentPreviewList />}
          <div className='team-message-input__form'>
            {isComposingGiphyMessage() && !numberOfUploads && <GiphyIcon />}
            <ChatAutoComplete onChange={onChange} placeholder={`Message ${getPlaceholder()}`} />

            <SendButton
              disabled={!numberOfUploads && !text.length}
              sendMessage={messageInput.handleSubmit}
            />
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
      <TeamTypingIndicator type='input' />
      <EmojiPicker />
    </div>
  );
};
