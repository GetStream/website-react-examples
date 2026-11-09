import React, { useCallback, useEffect, useState } from 'react';
import {
  Attachment,
  Avatar,
  MessageReactions,
  MessageRepliesCountButton,
  useChannel,
  useChatContext,
  useMessageContext,
  useMessagePaginator,
  useStateStore,
  useThreadContext,
  useWorkspaceNavigation,
  WithComponents,
} from 'stream-chat-react';

import { UserActionsDropdown } from './UserActionsDropdown';
import { customReactions, getFormattedTime } from './utils';

import { MessageActionsEllipse, ReactionSmiley, UpvoteThumb } from '../../assets';
import { useEventContext } from '../../contexts/EventContext';

import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useBoolState } from '../../hooks/useBoolState';
import {convertTimestampToDate, formatMessage, type LocalMessage, type MessagePaginatorState} from "stream-chat";

const reactionOverrides = { reactionOptions: customReactions };

// ids only, so a message re-renders when the list's ends change, not on every list update
const listEndsSelector = ({ items }: MessagePaginatorState) => ({
  firstId: items?.[0]?.id,
  lastId: items?.[items.length - 1]?.id,
  secondLastId: items?.[items.length - 2]?.id,
});



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

  const thread = useThreadContext();
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

  const upVotes = message.custom?.up_votes;
  const userUpVoted = client.userID && upVotes?.includes(client.userID);

  const handleClick = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!client.userID) return;

      const up_votes = upVotes?.includes(client.userID)
        ? upVotes.filter((userID) => userID !== client.userID)
        : [...(upVotes ?? []), client.userID];

      // reads come from message.custom in stream-chat v10, but a partial update sets custom fields
      // as top-level keys: the server rejects `set: { custom }` ("field `custom` is reserved")
      return await client.updateMessagePartial({ id: message.id }, { set: { up_votes } });
    },
    [client, message, upVotes],
  );

  return (
    <div
      className={`message-ui-upvote-button ${userUpVoted ? 'up-voted' : ''}`}
      onClick={handleClick}
    >
      <UpvoteThumb />
      <div className='message-ui-upvote-button-text'>{upVotes?.length || 0}</div>
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
  const { client } = useChatContext();
  const { openThread } = useWorkspaceNavigation();
  const channel = useChannel();
  const thread = useThreadContext();
  const { handleOpenThread, message } = useMessageContext();
  const [threadParent, setThreadParent] = useState<LocalMessage>();

  const customOpenThread = useCallback(
    (event: React.MouseEvent) => {
      return threadParent
        ? openThread({ channel, message: threadParent }, { event })
        : handleOpenThread(event);
    },
    [channel, threadParent, openThread, handleOpenThread],
  );

  useEffect(() => {
    const getMessage = async () => {
      if (threadParent || (thread && message.type === 'reply') || !message.parent_id) return;

      try {
        // channel.search() is removed in stream-chat v10; fetch the parent by id
        const { message: foundMessage } = await client.getMessage({ id: message.parent_id });

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

export const MessageUI: React.FC<{
  setMessageActionUser?: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = (props) => {
  const { setMessageActionUser } = props;

  // the thread's paginator inside a thread, the channel's otherwise
  const { firstId, lastId, secondLastId } = useStateStore(useMessagePaginator().state, listEndsSelector);
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
    // unix nanoseconds in stream-chat v10; v14's isDate() check would now always be false
    const createdAt = convertTimestampToDate(message.created_at);
    if (!createdAt) return null;

    const secondsSinceLastMessage = (Date.now() - createdAt.getTime()) / 1000;

    return getFormattedTime(secondsSinceLastMessage);
  }, [message]);

  const isRecentMessage = lastId === message.id || secondLastId === message.id;

  const isTopMessage = firstId === message.id;

  const userTitle = message.user?.custom?.title;
  const showTitle = userTitle === 'Admin' || userTitle === 'Moderator';

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
        imageUrl={message.user.image}
        size='md'
        userName={message.user.name || message.user.id}
      />
      <div className='message-ui-content'>
        <div className='message-ui-content-top'>
          <div className='message-ui-content-top-name'>{message.user.name || message.user.id}</div>
          {showTitle && <div className='message-ui-content-top-title'>{userTitle}</div>}
          <div className='message-ui-content-top-time'>{getTimeSinceMessage()}</div>
        </div>
        <div className='message-ui-content-bottom'>{message.text}</div>
        {!!message.attachments?.length && (
          <Attachment attachments={message.attachments} />
        )}
        <OpenThreadButton />
        <WithComponents overrides={reactionOverrides}>
          <MessageReactions />
        </WithComponents>
      </div>
      {isQA && <UpvoteButton />}
    </div>
  );
};
