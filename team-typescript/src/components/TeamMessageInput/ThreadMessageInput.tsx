import { useCallback, useState } from 'react';
import { logChatPromiseExecution, MessageResponse } from 'stream-chat';
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
      parent: message.parent as MessageResponse,
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

  const messageInput = useMessageInput<TeamAttachmentType, TeamChannelType, TeamCommandType, TeamEventType, TeamMessageType, TeamReactionType, TeamUserType>({ ...props, overrideSubmitHandler });

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === 'deleteContentBackward'
          ? true
          : false;

      if (
        messageInput.text.length === 1 &&
        deletePressed
      ) {
        setGiphyState(false);
      }

      if (messageInput.text.startsWith('/giphy') && !giphyState) {
        event.target.value = event.target.value.replace('/giphy', '');
        setGiphyState(true);
      }

      messageInput.handleChange(event);
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
          onClick={messageInput.handleSubmit}
        >
          <SendButton />
        </div>
      </div>
      <EmojiPicker {...messageInput} />
    </div>
  );
};