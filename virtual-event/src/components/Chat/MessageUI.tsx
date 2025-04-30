import React, { BaseSyntheticEvent, useCallback, useEffect, useState } from 'react';
import {
  Attachment,
  Avatar,
  isDate,
  MessageRepliesCountButton,
  MessageUIComponentProps,
  SimpleReactionsList,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
  useMessageContext,
} from 'stream-chat-react';

import { UserActionsDropdown } from './UserActionsDropdown';
import { customReactions, getFormattedTime } from './utils';

import { MessageActionsEllipse, ReactionSmiley, UpvoteThumb } from '../../assets';
import { useEventContext } from '../../contexts/EventContext';

import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useBoolState } from '../../hooks/useBoolState';
import {formatMessage, LocalMessage} from "stream-chat";



type OptionsProps = {
  dropdownOpen: boolean;
  isRecentMessage: boolean;
  isTopMessage: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageActionUser?: React.Dispatch<React.SetStateAction<string | undefined>>;
  setShowReactionSelector: React.Dispatch<React.SetStateAction<boolean>>;
  showReactionSelector: boolean;
};

const MessageOptions: React.FC<OptionsProps> = (props) => {
  const {
    dropdownOpen,
    isRecentMessage,
    isTopMessage,
    setDropdownOpen,
    setMessageActionUser,
    setShowReactionSelector,
    showReactionSelector,
  } = props;

  const { thread } = useChannelStateContext();
  const { handleOpenThread, isMyMessage, message } = useMessageContext();

  const hideActions = (thread && isMyMessage()) || (!thread && message.show_in_channel);

  const { toggle: toggleOpenDropdown, off: closeDropdown } = useBoolState({
    setState: setDropdownOpen,
  });
  const { toggle: toggleOpenReactionSelector, off: closeReactionSelector } = useBoolState({
    setState: setShowReactionSelector,
  });

  const [selectorRoot, setSelectorRoot] = useState<HTMLDivElement | null>(null);
  const [reactButton, setReactButton] = useState<HTMLSpanElement | null>(null);
  useOnClickOutside({
    targets: [selectorRoot, reactButton],
    onClickOutside: closeReactionSelector,
  });

  return (
    <div className='message-ui-options'>
      <span onClick={toggleOpenReactionSelector} ref={setReactButton}>
        <ReactionSmiley />
      </span>
      {!hideActions && (
        <span onClick={toggleOpenDropdown}>
          <MessageActionsEllipse />
        </span>
      )}
      {showReactionSelector && (
        <ReactionSelector
          isTopMessage={isTopMessage}
          closeReactionSelector={closeReactionSelector}
          ref={setSelectorRoot}
        />
      )}
      {dropdownOpen && (
        <div
          className={`message-ui-options-dropdown ${isRecentMessage ? 'recent' : ''} ${
            isMyMessage() ? 'mine' : ''
          }`}
        >
          <UserActionsDropdown
            dropdownOpen={dropdownOpen}
            openThread={handleOpenThread}
            closeDropdown={closeDropdown}
            setMessageActionUser={setMessageActionUser}
            thread={!thread}
            user={message.user}
          />
        </div>
      )}
    </div>
  );
};

type ReactionSelectorProps = {
  isTopMessage: boolean;
  closeReactionSelector: () => void;
};

const ReactionSelector = React.forwardRef<HTMLDivElement, ReactionSelectorProps>(
  ({ isTopMessage }, ref) => {
    const { handleReaction } = useMessageContext();

    return (
      <div className={`message-ui-reaction-selector ${isTopMessage ? 'top' : ''}`} ref={ref}>
        {customReactions.map(({ Component, type }) => (
          <div key={type} onClick={(event) => handleReaction(type, event)}>
            <Component />
          </div>
        ))}
      </div>
    );
  },
);

const UpvoteButton = () => {
  const { client } = useChatContext();
  const { message } = useMessageContext();

  const userUpVoted = client.userID && message.up_votes?.includes(client.userID);

  const handleClick = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();

      if (!message.up_votes && client.userID) {
        return await client.updateMessage({
          ...message,
          up_votes: [client.userID],
        });
      }

      const updatedMessage = {
        ...message,
        up_votes: (client.userID && message.up_votes.includes(client.userID)
          ? message.up_votes.filter((userID: string) => userID !== client.userID)
          :  [...message.up_votes, client.userID]) as string[],
      };

      return await client.updateMessage(updatedMessage);
    },
    [client, message],
  );

  return (
    <div
      className={`message-ui-upvote-button ${userUpVoted ? 'up-voted' : ''}`}
      onClick={handleClick}
    >
      <UpvoteThumb />
      <div className='message-ui-upvote-button-text'>{message.up_votes?.length || 0}</div>
    </div>
  );
};

const OpenInThreadButton = (props: React.ComponentProps<'button'>) => (
  <div className='str-chat__message-replies-count-button-wrapper'>
    <button
      className='str-chat__message-replies-count-button'
      data-testid='replies-count-button'
      {...props}
    >
      Show in thread
    </button>
  </div>
);

const searchRequestLock = Promise.resolve();

const OpenThreadButton = () => {
  const { openThread } = useChannelActionContext();
  const { channel, thread } = useChannelStateContext();
  const { handleOpenThread, message } = useMessageContext();
  const [threadParent, setThreadParent] = useState<LocalMessage>();

  const customOpenThread = useCallback(
    (event: BaseSyntheticEvent) => {
      return threadParent ? openThread(threadParent, event) : handleOpenThread(event);
    },
    [threadParent, openThread, handleOpenThread],
  );

  useEffect(() => {
    const getMessage = async () => {
      if (threadParent || (thread && message.type === 'reply')) return;

      try {
        const { results } = await channel.search({ id: { $eq: message.parent_id || '' } });
        const foundMessage = results[0]?.message;

        if (foundMessage) {
          setThreadParent(formatMessage(foundMessage));
        }
      } catch (err) {
        console.log(err);
      }
    };
    let execute = true;
    if (message.show_in_channel) {
      searchRequestLock.then(() => {
        if (execute) getMessage();
      });
    }

    return () => {
      execute = false;
    };
  }, []); // eslint-disable-line

  if (!(message.reply_count || message.show_in_channel)) return null;

  return message.show_in_channel ? (
    <OpenInThreadButton onClick={customOpenThread} />
  ) : (
    <MessageRepliesCountButton onClick={customOpenThread} reply_count={message.reply_count} />
  );
};

export const MessageUI: React.FC<
  MessageUIComponentProps & {
    setMessageActionUser?: React.Dispatch<React.SetStateAction<string | undefined>>;
  }
> = (props) => {
  const { setMessageActionUser } = props;

  const { messages } = useChannelStateContext();
  const { chatType, themeModalOpen } = useEventContext();
  const { message } = useMessageContext();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showReactionSelector, setShowReactionSelector] = useState(false);

  const clearModals = useCallback(() => {
    setDropdownOpen(false);
    setShowOptions(false);
    setShowReactionSelector(false);
  }, []);

  const getTimeSinceMessage = useCallback(() => {
    if (!message.created_at) return null;

    const secondsSinceLastMessage = isDate(message.created_at)
      ? (Date.now() - message.created_at.getTime()) / 1000
      : 0;

    return getFormattedTime(secondsSinceLastMessage);
  }, [message]);

  const isRecentMessage =
    messages?.[messages.length - 1].id === message.id ||
    messages?.[messages.length - 2]?.id === message.id;

  const isTopMessage = messages?.[0].id === message.id;

  const showTitle = message.user?.title === 'Admin' || message.user?.title === 'Moderator';

  const isQA = chatType === 'qa';

  if (!message.user) return null;

  return (
    <div
      className={`message-ui ${themeModalOpen ? 'theme-open' : ''}`}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={clearModals}
    >
      {showOptions && !isQA && (
        <MessageOptions
          dropdownOpen={dropdownOpen}
          isRecentMessage={isRecentMessage}
          setDropdownOpen={setDropdownOpen}
          isTopMessage={isTopMessage}
          setMessageActionUser={setMessageActionUser}
          setShowReactionSelector={setShowReactionSelector}
          showReactionSelector={showReactionSelector}
        />
      )}
      <Avatar
        image={message.user.image}
        name={message.user.name || message.user.id}
      />
      <div className='message-ui-content'>
        <div className='message-ui-content-top'>
          <div className='message-ui-content-top-name'>{message.user.name || message.user.id}</div>
          {showTitle && <div className='message-ui-content-top-title'>{message.user.title}</div>}
          <div className='message-ui-content-top-time'>{getTimeSinceMessage()}</div>
        </div>
        <div className='message-ui-content-bottom'>{message.text}</div>
        {!!message.attachments?.length && (
          <Attachment attachments={message.attachments} />
        )}
        <OpenThreadButton />
        <SimpleReactionsList reactionOptions={customReactions} />
      </div>
      {isQA && <UpvoteButton />}
    </div>
  );
};
