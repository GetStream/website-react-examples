import clsx from 'clsx';
import {useMemo} from 'react';
import {
  AttachmentPreviewList,
  SendButton,
  TextareaComposer,
  useAttachmentManagerState,
  useComponentContext,
  useMessageComposer,
  useMessageComposerHasSendableData,
  useMessageInputContext,
  useStateStore,
} from 'stream-chat-react';
import {useDropzone} from 'react-dropzone';

import {GiphyBadge} from './GiphyBadge';
import {MessageInputControlButton} from './MessageInputControls';
import {EmojiPicker} from './EmojiPicker';
import {useMessageInputCompositionControls} from './hooks/useMessageInputCompositionControls';
import type {CustomDataManagerState, MessageComposerConfig} from "stream-chat";
import {SendButtonIcon} from "./SendButtonIcon";

const attachmentManagerConfigStateSelector = (state: MessageComposerConfig) => ({
  acceptedFiles: state.attachments.acceptedFiles,
  multipleUploads: state.attachments.maxNumberOfFilesPerMessage > 1,
});

const customComposerDataSelector = (state: CustomDataManagerState) => ({
  activeFormatting: state.custom.activeFormatting,
  isComposingGiphyText: state.custom.command === 'giphy',
});

export const TeamMessageInput = () => {
  const { TypingIndicator } = useComponentContext();

  const { handleSubmit } = useMessageInputContext();
  const {
    formatter,
    placeholder,
  } = useMessageInputCompositionControls();
  const messageComposer = useMessageComposer();
  const { acceptedFiles, multipleUploads } = useStateStore(
    messageComposer.configState,
    attachmentManagerConfigStateSelector,
  );
  const { activeFormatting, isComposingGiphyText } = useStateStore(messageComposer.customDataManager.state, customComposerDataSelector)
  const {isUploadEnabled } =  useAttachmentManagerState();
  const hasSendableData = useMessageComposerHasSendableData();


  const accept = useMemo(
    () =>
      acceptedFiles.reduce<Record<string, Array<string>>>((mediaTypeMap, mediaType) => {
        mediaTypeMap[mediaType] ??= [];
        return mediaTypeMap;
      }, {}),
    [acceptedFiles],
  );

  const { getRootProps, isDragActive, isDragReject } = useDropzone({
    accept,
    disabled: !isUploadEnabled,
    multiple: multipleUploads,
    noClick: true,
    onDrop: messageComposer.attachmentManager.uploadFiles,
  });
  return (
    <div {...getRootProps({ className: clsx(`team-message-input__wrapper`) })}>
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
          <AttachmentPreviewList />
          <div className='team-message-input__form'>
            {isComposingGiphyText && <GiphyBadge />}
            <TextareaComposer placeholder={placeholder} />

            <SendButton disabled={!hasSendableData} sendMessage={handleSubmit} />
          </div>
        </div>
        <div className='team-message-input__bottom'>
          <EmojiPicker />
          <MessageInputControlButton
            type='bold'
            active={activeFormatting === 'bold'}
            onClick={formatter.bold}
          />
          <MessageInputControlButton
            type='italics'
            active={activeFormatting === 'italics'}
            onClick={formatter.italics}
          />
          <MessageInputControlButton
            type='strikethrough'
            active={activeFormatting === 'strikethrough'}
            onClick={formatter['strikethrough']}
          />
          <MessageInputControlButton
            type='code'
            active={activeFormatting === 'code'}
            onClick={formatter.code}
          />
        </div>
      </div>
      {TypingIndicator && <TypingIndicator />}
    </div>
  );
};

export const ThreadMessageInput = () => {
  const { handleSubmit } = useMessageInputContext();
  const messageComposer = useMessageComposer();
  const hasSendableData = useMessageComposerHasSendableData();
  const { isComposingGiphyText } = useStateStore(messageComposer.customDataManager.state, customComposerDataSelector)
  return (
    <div className='thread-message-input__wrapper'>
      <div className='thread-message-input__input'>
        {isComposingGiphyText && <GiphyBadge/>}
        <TextareaComposer placeholder='Reply'/>
        <EmojiPicker/>

        <button
          className='thread-message-input__send-button'
          disabled={!hasSendableData}
          onClick={handleSubmit}
        >
          <SendButtonIcon/>
        </button>
      </div>
    </div>
  );
};