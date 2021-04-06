import { useCallback, useState } from 'react';
import { logChatPromiseExecution } from 'stream-chat';
import {
  useChannelContext,
  ChatAutoComplete,
  EmojiPicker,
  useMessageInput,
  MessageInputProps,
} from 'stream-chat-react';

import type { TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType } from '../../App';

import type { MessageToOverride } from './TeamMessageInput';

import './ThreadMessageInput.css';

import {
  LightningBoltSmall,
  SendButton,
  SmileyFace,
} from '../../assets';

export const ThreadMessageInput = (props: MessageInputProps) => {
  const { additionalTextareaProps, autocompleteTriggers, disabled, grow, maxRows } = props;

  const { sendMessage } = useChannelContext<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>();
  const [giphyState, setGiphyState] = useState(false);

  const overrideSubmitHandler = (message: MessageToOverride) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      text: message.text
    };

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...updatedMessage, text: updatedText };
    }

    if (sendMessage) {
      const sendMessagePromise = sendMessage(updatedMessage);
      logChatPromiseExecution(sendMessagePromise, 'send message');
      setGiphyState(false);
    }
  };

  const messageInput = useMessageInput({ ...props, overrideSubmitHandler });

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined = useCallback(
    (e) => {
      if (
        messageInput.text.length === 1 &&
        e.nativeEvent.inputType === 'deleteContentBackward'
      ) {
        setGiphyState(false);
      }

      if (messageInput.text.startsWith('/giphy') && !giphyState) {
        e.target.value = e.target.value.replace('/giphy', '');
        setGiphyState(true);
      }

      messageInput.handleChange(e);
    },
    [giphyState, messageInput],
  );

  const GiphyIcon = () => (
    <div className="giphy-icon__wrapper">
      <LightningBoltSmall />
      <p className="giphy-icon__text">GIPHY</p>
    </div>
  );

  return (
    <div className="thread-message-input__wrapper">
      <div className="thread-message-input__input">
        {giphyState && <GiphyIcon />}
        <ChatAutoComplete
          innerRef={messageInput.textareaRef}
          handleSubmit={messageInput.handleSubmit}
          onSelectItem={messageInput.onSelectItem}
          onChange={onChange}
          value={messageInput.text}
          rows={1}
          maxRows={maxRows}
          placeholder="Reply"
          onPaste={messageInput.onPaste}
          triggers={autocompleteTriggers}
          grow={grow}
          disabled={disabled}
          additionalTextareaProps={{
            ...additionalTextareaProps,
          }}
        />
        <div className="thread-message-input__icons">
          <SmileyFace openEmojiPicker={messageInput.openEmojiPicker} />
        </div>
        <div
          className="thread-message-input__button"
          role="button"
          aria-roledescription="button"
          // @ts-expect-error - TODO: type of the onClick needs to be updated in stream-chat-react
          onClick={messageInput.handleSubmit}
        >
          <SendButton />
        </div>
      </div>
      <EmojiPicker {...messageInput} />
    </div>
  );
};