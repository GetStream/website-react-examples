import React, { useEffect, useState } from 'react';
import type { TextComposerMiddleware } from 'stream-chat';
import {
  ChannelPlaceholder,
  Chat,
  MessageComposer,
  MessageList,
  Streami18n,
  ThreadHeader,
  ThreadList,
  useCreateChatClient,
  VirtualizedMessageList,
  WithComponents,
} from 'stream-chat-react';
import {
  ChannelSlot,
  ChatView,
  type LayoutDescriptor,
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

import type { ChannelListOptions } from './channelListOptions';
import {
  ChannelInner,
  CreateChannel,
  MessagingSidebar,
  MessagingThreadHeader,
  SendButton,
} from './components';

import { useThemeContext } from './context';

import { useChecklist, useMobileView, useUpdateAppHeightOnResize } from './hooks';


init({ data });

type AppProps = {
  apiKey: string;
  userToConnect: { id: string; name?: string; image?: string };
  userToken: string | undefined;
  targetOrigin: string;
  channelListOptions: ChannelListOptions;
};

const noop = () => null;

// stream-chat-react 14 shows message times as HH:mm; keep the v13 calendar format ("Today at 9:44 PM")
const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    'timestamp.MessageTimestamp': '{{ timestamp | timestampFormatter(calendar: true) }}',
  },
});

// Both views keep their own slot state; a channel opens in "channel", a thread in "thread".
// Module scope: ChatView needs a referentially stable layout list.
const layouts: LayoutDescriptor[] = [
  { id: 'channels', slots: ['channel', 'thread'] },
  { id: 'threads', slots: ['thread'] },
];

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

  useEffect(() => {
    if (!chatClient) return;

    chatClient.setMessageComposerSetupFunction(({ composer }) => {
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

  if (!chatClient) {
    return null; // render nothing until connection to the backend is established
  }

  const createChannel = isCreating && (
    <CreateChannel toggleMobile={toggleMobile} onClose={() => setIsCreating(false)} />
  );

  const channelsView = (
    <WithComponents
      overrides={{
        SendButton,
        TypingIndicator: noop,
        EmojiPicker: EmojiPickerWithTheme,
        emojiSearchIndex: SearchIndex,
      }}
    >
      <MessagingSidebar
        channelListOptions={channelListOptions}
        onClick={toggleMobile}
        onCreateChannel={() => setIsCreating(!isCreating)}
        onPreviewSelect={() => setIsCreating(false)}
      />
      <Slot slot='channel'>
        <ChannelSlot
          slot='channel'
          fallback={<ChannelPlaceholder>{createChannel}</ChannelPlaceholder>}
        >
          {createChannel}
          <ChannelInner theme={themeClassName} toggleMobile={toggleMobile} />
        </ChannelSlot>
      </Slot>
      <Slot slot='thread'>
        <ThreadSlot slot='thread'>
          <MessagingThreadHeader />
          <MessageList withDateSeparator={false} />
          <MessageComposer focus />
        </ThreadSlot>
      </Slot>
    </WithComponents>
  );

  const threadsView = (
    <>
      <ThreadList />
      <Slot slot='thread'>
        <ThreadSlot slot='thread'>
          <ThreadHeader />
          <VirtualizedMessageList />
          <MessageComposer focus />
        </ThreadSlot>
      </Slot>
    </>
  );

  return (
    <Chat client={chatClient} i18nInstance={i18nInstance} theme={clsx('messaging', themeClassName)}>
      <ChatView layouts={layouts} views={{ channels: channelsView, threads: threadsView }}>
        <ChatView.Selector iconOnly={false} />
      </ChatView>
    </Chat>
  );
};

export default App;
