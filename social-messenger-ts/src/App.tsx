import React, { useState } from 'react';
import type { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';
import { Channel, Chat } from 'stream-chat-react';
import { EmojiPicker } from 'stream-chat-react/emojis';

import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';

import 'stream-chat-react/dist/css/v2/index.css';
import './styles/index.css';

import {
  ChannelInner,
  CreateChannel,
  MessagingSidebar,
  MessagingThreadHeader,
  SendButton,
} from './components';

import { GiphyContextProvider, useThemeContext } from './context';

import { useConnectUser, useChecklist, useMobileView, useUpdateAppHeightOnResize } from './hooks';

import type { StreamChatGenerics } from './types';

init({ data });

type AppProps = {
  apiKey: string;
  userToConnect: { id: string; name?: string; image?: string };
  userToken: string | undefined;
  targetOrigin: string;
  channelListOptions: {
    options: ChannelOptions;
    filters: ChannelFilters;
    sort: ChannelSort;
  };
};

const WrappedEmojiPicker = () => {
  const { theme } = useThemeContext();

  return <EmojiPicker pickerProps={{ theme }} />;
};

const App = (props: AppProps) => {
  const { apiKey, userToConnect, userToken, targetOrigin, channelListOptions } = props;
  const [isCreating, setIsCreating] = useState(false);

  const chatClient = useConnectUser<StreamChatGenerics>(apiKey, userToConnect, userToken);
  const toggleMobile = useMobileView();
  const { themeClassName } = useThemeContext();

  useChecklist(chatClient, targetOrigin);
  useUpdateAppHeightOnResize();

  if (!chatClient) {
    return null; // render nothing until connection to the backend is established
  }

  return (
    <Chat client={chatClient} theme={`messaging ${themeClassName}`}>
      <MessagingSidebar
        channelListOptions={channelListOptions}
        onClick={toggleMobile}
        onCreateChannel={() => setIsCreating(!isCreating)}
        onPreviewSelect={() => setIsCreating(false)}
      />
      <Channel
        maxNumberOfFiles={10}
        multipleUploads={true}
        SendButton={SendButton}
        ThreadHeader={MessagingThreadHeader}
        TypingIndicator={() => null}
        EmojiPicker={WrappedEmojiPicker}
        emojiSearchIndex={SearchIndex}
      >
        {isCreating && (
          <CreateChannel toggleMobile={toggleMobile} onClose={() => setIsCreating(false)} />
        )}
        <GiphyContextProvider>
          <ChannelInner theme={themeClassName} toggleMobile={toggleMobile} />
        </GiphyContextProvider>
      </Channel>
    </Chat>
  );
};

export default App;
