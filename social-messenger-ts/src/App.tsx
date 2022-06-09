import React, { useState } from 'react';
import type { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';
import { Chat, Channel, ChannelList } from 'stream-chat-react';

import '@stream-io/stream-chat-css/dist/css/index.css';
import './App.css';

import {
  CreateChannel,
  CustomMessage,
  MessagingChannelList,
  MessagingChannelListHeader,
  MessagingChannelPreview,
  MessagingInput,
  MessagingThreadHeader,
} from './components';

import { ChannelInner } from './components/ChannelInner/ChannelInner';
import { useConnectUser } from './hooks/useConnectUser';
import { useTheme } from './hooks/useTheme';
import { useChecklist } from './hooks/useChecklist';
import { useUpdateAppHeightOnResize } from './hooks/useUpdateAppHeightOnResize';
import { useMobileView } from './hooks/useMobileView';
import { GiphyContextProvider } from './Giphy';
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
      <div className='messaging__sidebar' id='mobile-channel-list' onClick={toggleMobile}>
        <MessagingChannelListHeader
          onCreateChannel={() => setIsCreating(!isCreating)}
          theme={theme}
        />
        <ChannelList
          filters={channelListOptions.filters}
          sort={channelListOptions.sort}
          options={channelListOptions.options}
          List={MessagingChannelList}
          Preview={(props) => <MessagingChannelPreview {...props} setIsCreating={setIsCreating} />}
        />
      </div>
      <div>
        <Channel
          Input={MessagingInput}
          maxNumberOfFiles={10}
          Message={CustomMessage}
          multipleUploads={true}
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
      </div>
    </Chat>
  );
};

export default App;
