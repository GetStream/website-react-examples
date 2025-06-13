import React, {useEffect, useState} from 'react';
import {Channel as StreamChannel, TextComposerMiddleware, UserResponse} from 'stream-chat';
import {Channel, Chat} from 'stream-chat-react';

import {init, SearchIndex} from 'emoji-mart';
import data from '@emoji-mart/data';

import {ChannelInner} from './ChannelInner';
import {ChatHeader} from './ChatHeader';
import {ChatSidebar} from './ChatSidebar';
import {DMChannelList} from './DMChannelList';
import {EmptyStateIndicatorChannel} from './EmptyStateIndicators';
import {GiphyPreview} from './GiphyPreview';
import {MessageUI} from './MessageUI';
import {MessageInputUI} from './MessageInputUI';
import {ParticipantProfile} from './ParticipantProfile';
import {ParticipantSearch} from './ParticipantSearch';
import {Snackbar} from './Snackbar';
import {ThreadHeader} from './ThreadHeader';
import {UserActionsModal} from './UserActionsModal';

import {useEventContext} from '../../contexts/EventContext';

import {useInitChat} from '../../hooks/useInitChat';
import {
  createDraftGiphyCommandInjectionMiddleware,
  createGiphyCommandInjectionMiddleware
} from "../../middleware/composition/giphyCommandInjectionMiddleware";
import {createGiphyCommandControlMiddleware} from "../../middleware/textComposition/giphyCommandControl";
import {CustomSuggestionList} from "./SuggestionList";


init({ data });

// todo: remove AutocompleteSuggestionHeader prop
export const ChatContainer = () => {
  const {
    actionsModalOpen,
    isFullScreen,
    searching,
    setSearching,
    showChannelList,
    userActionType,
  } = useEventContext();

  const [dmChannel, setDmChannel] = useState<StreamChannel>();
  const [messageActionUser, setMessageActionUser] = useState<string>();
  const [participantProfile, setParticipantProfile] = useState<UserResponse>();
  const [snackbar, setSnackbar] = useState(false);

  const { chatClient, currentChannel, dmUnread, eventUnread, globalUnread, qaUnread } =
    useInitChat();

  useEffect(() => {
    if (!chatClient) return;

    chatClient.setMessageComposerSetupFunction(({ composer }) => {
      composer.compositionMiddlewareExecutor.insert({
        middleware: [
          createGiphyCommandInjectionMiddleware(composer)
        ],
        position: {after: 'stream-io/message-composer-middleware/attachments'}
      });
      composer.draftCompositionMiddlewareExecutor.insert({
        middleware: [
          createDraftGiphyCommandInjectionMiddleware(composer)
        ],
        position: {after: 'stream-io/message-composer-middleware/draft-attachments'}
      });
      composer.textComposer.middlewareExecutor.insert({
        middleware: [
          createGiphyCommandControlMiddleware(composer) as TextComposerMiddleware,
        ],
        position: {before: 'stream-io/text-composer/pre-validation-middleware'}
      })
    });
  }, [chatClient]);

  if (!chatClient) return null;

  return (
    <div
      className={`chat str-chat ${isFullScreen ? 'full-screen' : ''} ${
        actionsModalOpen ? 'actions-modal' : ''
      }`}
    >
      {isFullScreen && (
        <ChatSidebar
          dmUnread={dmUnread}
          eventUnread={eventUnread}
          globalUnread={globalUnread}
          qaUnread={qaUnread}
        />
      )}
      <div className={`chat-components ${isFullScreen ? 'full-screen' : ''}`}>
        <Chat client={chatClient}>
            {searching && (
              <ParticipantSearch
                setDmChannel={setDmChannel}
                setParticipantProfile={setParticipantProfile}
                setSearching={setSearching}
              />
            )}
            {participantProfile && (
              <ParticipantProfile
                participantProfile={participantProfile}
                setDmChannel={setDmChannel}
                setParticipantProfile={setParticipantProfile}
              />
            )}
            {actionsModalOpen && userActionType && (
              <UserActionsModal
                dmChannel={dmChannel}
                messageActionUser={messageActionUser}
                participantProfile={participantProfile}
                setSnackbar={setSnackbar}
                userActionType={userActionType}
              />
            )}
            {snackbar && userActionType && (
              <Snackbar setSnackbar={setSnackbar} userActionType={userActionType} />
            )}
            <ChatHeader
              dmUnread={dmUnread}
              eventUnread={eventUnread}
              globalUnread={globalUnread}
              qaUnread={qaUnread}
            />
            {showChannelList ? (
              <DMChannelList
                dmChannel={dmChannel}
                setDmChannel={setDmChannel}
                setParticipantProfile={setParticipantProfile}
              />
            ) : (
              currentChannel && (
                <Channel
                  AutocompleteSuggestionList={CustomSuggestionList}
                  channel={currentChannel}
                  EmptyStateIndicator={EmptyStateIndicatorChannel}
                  GiphyPreviewMessage={GiphyPreview}
                  Input={MessageInputUI}
                  ThreadHeader={ThreadHeader}
                  VirtualMessage={(props) => (
                    <MessageUI {...props} setMessageActionUser={setMessageActionUser} />
                  )}
                  emojiSearchIndex={SearchIndex}
                >
                  <ChannelInner />
                </Channel>
              )
            )}
        </Chat>
      </div>
    </div>
  );
};
