import clsx from 'clsx';
import React, {ElementRef, useMemo, useRef} from 'react';
import type {TranslationLanguages} from 'stream-chat';
import {
  Attachment,
  Avatar,
  EditMessageForm,
  isOnlyEmojis,
  MESSAGE_ACTIONS,
  MessageActions,
  MessageDeleted,
  MessageInput,
  MessageRepliesCountButton,
  MessageStatus,
  MessageTimestamp,
  ReactionIcon,
  ReactionsList,
  ReactionSelector,
  renderText as defaultRenderText,
  showMessageActionsBox,
  ThreadIcon,
  useComponentContext,
  useMessageContext,
  useTranslationContext, DialogAnchor, useDialog, useDialogIsOpen,
} from 'stream-chat-react';

import {PinIndicator} from './PinIndicator';

import {useWorkspaceController} from '../../context/WorkspaceController';

import {ErrorIcon} from "./icons";

export const TeamMessage = () => {
  const {
    clearEditingState,
    editing,
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
  const showActionsBox = showMessageActionsBox(messageActions);

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
  const messageActionsDialogIsOpen = useDialogIsOpen(`message-actions--${message.id}`);

  if (message.deleted_at) {
    return <MessageDeleted message={message} />;
  }

  if (editing) {
    return (
      <div
        className={`str-chat__message-team str-chat__message-team--${firstGroupStyle} str-chat__message-team--editing`}
        data-testid='message-team-edit'
      >
        {(firstGroupStyle === 'top' || firstGroupStyle === 'single') && (
          <div className='str-chat__message-team-meta'>
            <Avatar
              image={message.user?.image}
              name={message.user?.name || message.user?.id}
              onClick={onUserClick}
              onMouseOver={onUserHover}
            />
          </div>
        )}
        <MessageInput
          clearEditingState={clearEditingState}
          Input={EditMessageForm}
        />
      </div>
    );
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
              image={message.user?.image}
              name={message.user?.name || message.user?.id}
              onClick={onUserClick}
              onMouseOver={onUserHover}
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
                        <ReactionSelector />
                      </DialogAnchor>
                      <button
                        aria-expanded={reactionSelectorDialogIsOpen}
                        aria-label={t('aria/Open Reaction Selector')}
                        className='str-chat__message-reactions-button'
                        data-testid='message-reaction-action'
                        onClick={() => reactionSelectorDialog?.toggle()}
                        ref={buttonRef}
                      >
                        <ReactionIcon className='str-chat__message-action-icon' />
                      </button>
                    </>
                    )}
                  {shouldShowReplies && (
                    <span
                      data-testid='message-team-thread-icon'
                      onClick={handleOpenThread}
                      title='Start a thread'
                    >
                      <ThreadIcon/>
                    </span>
                  )}
                  {showActionsBox && (
                    <MessageActions inline/>
                  )}
                </div>
              )}
            {message.text && (<div
                className={clsx('str-chat__message-team-text', {'str-chat__message-team-text--is-emoji': isOnlyEmojis(message.text)})}
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
              <ReactionsList/>
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
            canReact && <ReactionsList/>}
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
