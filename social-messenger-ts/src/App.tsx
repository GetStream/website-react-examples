import React, {useEffect, useMemo, useState} from 'react';
import { ChannelPaginator, type TextComposerMiddleware } from 'stream-chat';
import {
  Chat,
  ChannelPlaceholder,
  Streami18n,
  Thread,
  ThreadList,
  useCreateChatClient,
  WithComponents,
} from 'stream-chat-react';
import {
  ChannelSlot,
  ChatView,
  type ChatViewSlotRenderers,
  Slot,
  ThreadSlot,
} from 'stream-chat-react/slot-layout';
import clsx from 'clsx';
import { createTextComposerEmojiMiddleware, EmojiPicker } from 'stream-chat-react/emojis';

import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';

import 'stream-chat-react/dist/css/index.css';
import 'stream-chat-react/dist/css/emoji-picker.css';
import './styles/index.css';

import {
  ChannelInner,
  CreateChannel,
  MessagingSidebar,
  SendButton,
  ThreadInner,
} from './components';

import { getChannelListOptions } from './channelListOptions';
import { useThemeContext } from './context';

import { useChecklist, useMobileView, useUpdateAppHeightOnResize } from './hooks';


init({ data });

type AppProps = {
  apiKey: string;
  userToConnect: { id: string; name?: string; image?: string };
  userToken: string | undefined;
  targetOrigin: string;
  channelListOptions: ReturnType<typeof getChannelListOptions>;
};

const noop = () => null;

// stream-chat-react 14 shows message times as HH:mm; keep the v13 calendar format ("Today at 9:44 PM")
const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    'timestamp.MessageTimestamp': '{{ timestamp | timestampFormatter(calendar: true) }}',
  },
});

// Module scope: ChatView requires referentially stable layouts and renderers
const layouts = [
  { id: 'channels' as const, slots: ['channel', 'channel-thread'] },
  { id: 'threads' as const, slots: ['thread'] },
];

// Used by <Slot> elements without children (the thread opened beside a channel)
const slotRenderers: ChatViewSlotRenderers = {
  thread: ({ source }) => (
    <Thread thread={source}>
      <ThreadInner />
    </Thread>
  ),
};

const EmojiPickerWithTheme = () => {
  const { theme } = useThemeContext();

  return <EmojiPicker pickerProps={{ theme }} />;
};

const App = (props: AppProps) => {
  const { apiKey, userToConnect, userToken, targetOrigin, channelListOptions } = props;
  const [isCreating, setIsCreating] = useState(false);

  const chatClient = useCreateChatClient({
    apiKey,
    userData: userToConnect,
    tokenOrProvider: userToken,
  });
  const toggleMobile = useMobileView();
  const { themeClassName } = useThemeContext();

  useChecklist(chatClient, targetOrigin);
  useUpdateAppHeightOnResize();

  // Created above ChatView: views unmount when switching, and the list should not re-query each time
  const channelPaginator = useMemo(
    () =>
      chatClient &&
      new ChannelPaginator({
        client: chatClient,
        filters: channelListOptions.filters,
        id: 'social-messenger:channels',
        paginatorOptions: { pageSize: channelListOptions.pageSize },
        requestOptions: channelListOptions.requestOptions,
        sort: channelListOptions.sort,
      }),
    [chatClient, channelListOptions],
  );

  useEffect(() => {
    if (!chatClient || !channelPaginator) return;
    // registered so the list receives WebSocket updates
    chatClient.channelManager.insertPaginator({ paginator: channelPaginator });
    return () => {
      chatClient.channelManager.removePaginator(channelPaginator);
    };
  }, [chatClient, channelPaginator]);

  useEffect(() => {
    if (!chatClient) return;

    chatClient.config.setSetupFunction('messageComposer', ({ composer }) => {
      composer.textComposer.middlewareExecutor.insert({
        middleware: [
          createTextComposerEmojiMiddleware(SearchIndex) as TextComposerMiddleware,
        ],
        position: { before: 'stream-io/text-composer/mentions-middleware' },
        unique: true,
      });
      composer.updateConfig({
        linkPreviews: {enabled: true},
      });
    });
  }, [chatClient]);

  if (!chatClient || !channelPaginator) {
    return null; // render nothing until connection to the backend is established
  }

  return (
    <Chat client={chatClient} i18nInstance={i18nInstance} theme={clsx('messaging', themeClassName)}>
      <WithComponents
        overrides={{
          SendButton,
          TypingIndicator: noop,
          EmojiPicker: EmojiPickerWithTheme,
          emojiSearchIndex: SearchIndex,
        }}
      >
        <ChatView
          layouts={layouts}
          slotRenderers={slotRenderers}
          views={{
            channels: (
              <>
                <MessagingSidebar
                  paginator={channelPaginator}
                  onClick={toggleMobile}
                  onCreateChannel={() => setIsCreating(!isCreating)}
                  onPreviewSelect={() => setIsCreating(false)}
                />
                <Slot slot='channel'>
                  {isCreating && (
                    <CreateChannel toggleMobile={toggleMobile} onClose={() => setIsCreating(false)} />
                  )}
                  <ChannelSlot fallback={<ChannelPlaceholder />} slot='channel'>
                    <ChannelInner theme={themeClassName} toggleMobile={toggleMobile} />
                  </ChannelSlot>
                </Slot>
                <Slot slot='channel-thread' />
              </>
            ),
            threads: (
              <>
                <ThreadList />
                <Slot slot='thread'>
                  <ThreadSlot slot='thread'>
                    <ThreadInner />
                  </ThreadSlot>
                </Slot>
              </>
            ),
          }}
        >
          <ChatView.Selector iconOnly={false} />
        </ChatView>
      </WithComponents>
    </Chat>
  );
};

export default App;
