import React, { useState } from 'react';
import type { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';
import { Channel, Chat } from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';
import './styles/index.css';

import {
  ChannelInner,
  CreateChannel,
  MessagingSidebar,
  MessagingThreadHeader,
  SendButton
} from './components';

import { GiphyContextProvider } from './context';

import {
  useConnectUser,
  useChecklist,
  useMobileView,
  useTheme,
  useUpdateAppHeightOnResize
} from './hooks';

import type { StreamChatGenerics } from './types';

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

const App = (props: AppProps) => {
  const { apiKey, userToConnect, userToken, targetOrigin, channelListOptions } = props;
  const [isCreating, setIsCreating] = useState(false);

  const chatClient = useConnectUser<StreamChatGenerics>(apiKey, userToConnect, userToken);
  const toggleMobile = useMobileView();
  const theme = useTheme(targetOrigin);

  useChecklist(chatClient, targetOrigin);
  useUpdateAppHeightOnResize();

  if (!chatClient) {
    return null; // render nothing until connection to the backend is established
  }

  return (
    <Chat client={chatClient} theme={`messaging ${theme}`}>
        <MessagingSidebar
          channelListOptions={channelListOptions}
          onClick={toggleMobile}
          onCreateChannel={() => setIsCreating(!isCreating)}
          onPreviewSelect={() => setIsCreating(false)}
          theme={theme}
        />
        <Channel
          maxNumberOfFiles={10}
          multipleUploads={true}
          SendButton={SendButton}
          ThreadHeader={MessagingThreadHeader}
          TypingIndicator={() => null}
        >
          {isCreating && (
            <CreateChannel toggleMobile={toggleMobile} onClose={() => setIsCreating(false)} />
          )}
          <GiphyContextProvider>
            <ChannelInner theme={theme} toggleMobile={toggleMobile} />
          </GiphyContextProvider>
        </Channel>
    </Chat>
  );
};

export default App;
