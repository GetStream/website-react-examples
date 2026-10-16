import clsx from 'clsx';
import React, {ElementRef, useMemo, useRef} from 'react';
import type {TranslationLanguages} from 'stream-chat';
import {
  Attachment,
  Avatar,
  defaultMessageActionSet,
  DialogAnchor,
  IconEmoji,
  IconThread,
  MESSAGE_ACTIONS,
  MessageActions,
  MessageDeletedBubble,
  MessageReactions,
  MessageRepliesCountButton,
  MessageStatus,
  MessageTimestamp,
  messageTextHasEmojisOnly,
  ReactionSelector,
  renderText as defaultRenderText,
  useDialog,
  useDialogIsOpen,
  useMessageContext,
  useTranslationContext,
} from 'stream-chat-react';

import {PinIndicator} from './PinIndicator';

import {useWorkspaceController} from '../../context/WorkspaceController';

import {ErrorIcon} from "./icons";

// TeamMessage renders its own reaction and thread buttons, so MessageActions only adds the dropdown menu
const dropdownMessageActionSet = defaultMessageActionSet.filter(
  (action) =>
    action.placement === 'quick-dropdown-toggle' ||
    (action.placement === 'dropdown' && action.type !== 'react' && action.type !== 'reply'),
);

export const TeamMessage = () => {
  const {
    getMessageActions,
    groupStyles,
    handleAction,
    handleOpenThread: handleOpenThreadContext,
    handleRetry,
    initialMessage,
    message,
    onMentionsClickMessage,
    onMentionsHoverMessage,
    onUserClick,
    onUserHover,
    renderText = defaultRenderText,
    threadList,
  } = useMessageContext('MessageTeam');
  const { t, userLanguage } = useTranslationContext('MessageTeam');

  const messageActions = getMessageActions();

  const shouldShowReplies = messageActions.indexOf(MESSAGE_ACTIONS.reply) > -1 && !threadList;
  const canReact =  messageActions.indexOf(MESSAGE_ACTIONS.react) > -1;

  const messageTextToRender =
    message.i18n?.[`${userLanguage}_text` as `${TranslationLanguages}_text`] || message.text;

  const messageMentionedUsersItem = message.mentioned_users;

  const messageText = useMemo(() => renderText(messageTextToRender, messageMentionedUsersItem), [
    messageMentionedUsersItem,
    messageTextToRender,
    renderText,
  ]);

  const { closePinnedMessageListOpen } = useWorkspaceController();
  const handleOpenThread = (event: React.BaseSyntheticEvent) => {
    closePinnedMessageListOpen();
    handleOpenThreadContext(event);
  };

  const firstGroupStyle = groupStyles ? groupStyles[0] : 'single';

  const buttonRef = useRef<ElementRef<'button'>>(null);
  const reactionSelectorDialogId = `reaction-selector--${message.id}`;
  const reactionSelectorDialog = useDialog({ id: reactionSelectorDialogId });
  const reactionSelectorDialogIsOpen = useDialogIsOpen(reactionSelectorDialogId);
  const messageActionsDialogIsOpen = useDialogIsOpen(MessageActions.getDialogId({ messageId: message.id }));

  if (message.deleted_at) {
    return <MessageDeletedBubble />;
  }

  const rootClass = clsx(
    'str-chat__message',
    'str-chat__message-team',
    `str-chat__message-team--${firstGroupStyle}`,
    {
      'pinned-message': message.pinned,
      [`str-chat__message-team--${message.status}`]: message.status,
      [`str-chat__message-team--${message.type}`]: message.type,
      'str-chat__message--has-attachment': !!message.attachments?.length,
      'threadList': threadList,
    },
  );

  return (
    <div className={message.pinned ? 'pinned-message' : 'unpinned-message'}>
      {message.pinned && <PinIndicator message={message}/>}
      <div
        className={rootClass}
        data-testid='message-team'
      >
        <div className='avatar-host'>
          {firstGroupStyle === 'top' || firstGroupStyle === 'single' || initialMessage ? (
            <Avatar
              imageUrl={message.user?.image}
              onClick={onUserClick}
              onMouseOver={onUserHover}
              size='md'
              userName={message.user?.name || message.user?.id}
            />
          ) : (
            <div data-testid='team-meta-spacer' style={{marginRight: 0, width: 34}}/>
          )}
        </div>
        <div className='str-chat__message-team-group'>
          {(firstGroupStyle === 'top' || firstGroupStyle === 'single' || initialMessage) && (
            <div className='str-chat__message-team-meta'>
              <div
                className='str-chat__message-team-author'
                data-testid='message-team-author'
                onClick={onUserClick}
              >
                <strong>{message.user?.name || message.user?.id}</strong>
                {message.type === 'error' && (
                  <div className='str-chat__message-team-error-header'>
                    {t('Only visible to you')}
                  </div>
                )}
              </div>
              <MessageTimestamp />
            </div>
          )}
          <div
            className={`str-chat__message-team-content str-chat__message-team-content--${firstGroupStyle} str-chat__message-team-content--${
              message.text === '' ? 'image' : 'text'
            }`}
            data-testid='message-team-content'
          >
            {/*{message.quoted_message && <QuotedMessage />}*/}
            {!initialMessage &&
              message.status !== 'sending' &&
              message.status !== 'failed' &&
              message.type !== 'system' &&
              message.type !== 'ephemeral' &&
              message.type !== 'error' && (
                <div
                  className={clsx(`str-chat__message-team-actions`, {'str-chat__message-team-actions--active': reactionSelectorDialogIsOpen || messageActionsDialogIsOpen})}
                  data-testid='message-team-actions'
                >
                  {canReact && (
                    <>
                      <DialogAnchor
                        id={reactionSelectorDialogId}
                        placement='top-end'
                        referenceElement={buttonRef.current}
                        trapFocus
                      >
                        <ReactionSelector dialogId={reactionSelectorDialogId} />
                      </DialogAnchor>
                      <button
                        aria-expanded={reactionSelectorDialogIsOpen}
                        aria-label={t('aria/Open Reaction Selector')}
                        className='str-chat__message-reactions-button'
                        data-testid='message-reaction-action'
                        onClick={() => reactionSelectorDialog?.toggle()}
                        ref={buttonRef}
                      >
                        <IconEmoji className='str-chat__message-action-icon' />
                      </button>
                    </>
                    )}
                  {shouldShowReplies && (
                    <span
                      data-testid='message-team-thread-icon'
                      onClick={handleOpenThread}
                      title='Start a thread'
                    >
                      <IconThread/>
                    </span>
                  )}
                  <MessageActions messageActionSet={dropdownMessageActionSet}/>
                </div>
              )}
            {message.text && (<div
                className={clsx('str-chat__message-team-text', {'str-chat__message-team-text--is-emoji': messageTextHasEmojisOnly(message)})}
                data-testid='message-team-message'
                onClick={onMentionsClickMessage}
                onMouseOver={onMentionsHoverMessage}
              >
                {messageText}
              </div>
            )}
            {!message.text && message.attachments?.length && Attachment ? (
              <Attachment actionHandler={handleAction} attachments={message.attachments}/>
            ) : null}
            {message.latest_reactions?.length !== 0 && message.text !== '' && canReact && (
              <MessageReactions/>
            )}
            {message.status === 'failed' && (
              <button
                className='str-chat__message-team-failed'
                data-testid='message-team-failed'
                onClick={message.error?.status !== 403 ? () => handleRetry(message) : undefined}
              >
                <ErrorIcon/>
                {message.error?.status !== 403
                  ? t('Message Failed · Click to try again')
                  : t('Message Failed · Unauthorized')}
              </button>
            )}
          </div>
          <MessageStatus messageType='team'/>
          {message.text && message.attachments?.length && Attachment ? (
            <Attachment actionHandler={handleAction} attachments={message.attachments}/>
          ) : null}
          {message.latest_reactions &&
            message.latest_reactions.length !== 0 &&
            message.text === '' &&
            canReact && <MessageReactions/>}
          {!threadList && (
            <MessageRepliesCountButton
              onClick={handleOpenThread}
              reply_count={message.reply_count}
            />
          )}
        </div>
      </div>
    </div>
  );
};
