import React, { useState } from 'react';
import type { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';
import { Chat, Channel } from 'stream-chat-react';

import 'stream-chat-react/dist/css/v2/index.css';
import './styles/index.css';

import {
  CreateChannel,
  MessagingThreadHeader,
  SendButton,
} from './components';

import { ChannelInner } from './components/ChannelInner/ChannelInner';
import { useConnectUser } from './hooks/useConnectUser';
import { useTheme } from './hooks/useTheme';
import { useChecklist } from './hooks/useChecklist';
import { useUpdateAppHeightOnResize } from './hooks/useUpdateAppHeightOnResize';
import { useMobileView } from './hooks/useMobileView';
import { GiphyContextProvider } from './Giphy';
import type { StreamChatGenerics } from './types';
import { MessagingSidebar } from './components/Sidebar/MessagingSidebar';

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
