import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelList, MessageList, MessageInput, MessageSimple, Window, Thread } from 'stream-chat-react';

import 'stream-chat-react/dist/css/index.css';
import './App.css';

import {
  CreateChannel,
  MessagingChannelHeader,
  MessagingChannelList,
  MessagingChannelPreview,
  MessagingInput,
  WindowControls,
} from './components';

const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('apikey') || process.env.REACT_APP_STREAM_KEY;
const user = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;

const filters = { type: 'messaging', members: { $in: [user] } };
const options = { state: true, watch: true, presence: true, limit: 10 };
const sort = {
  last_message_at: -1,
  updated_at: -1,
  cid: 1,
};

const chatClient = new StreamChat(apiKey);
chatClient.setUser({ id: user }, userToken);

const App = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [theme, setTheme] = useState('dark');

  return (
    <div>
      <WindowControls {...{ theme, setTheme }} />
      <Chat client={chatClient} theme={`messaging ${theme}`}>
        <ChannelList
          filters={filters}
          sort={sort}
          options={options}
          List={(props) => <MessagingChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />}
          Preview={(props) => <MessagingChannelPreview {...props} {...{ setIsCreating }} />}
        />
        <Channel maxNumberOfFiles={10} multipleUploads={true}>
          <CreateChannel onClose={() => setIsCreating(false)} visible={isCreating} />
          <Window>
            <MessagingChannelHeader />
            <MessageList TypingIndicator={() => null} />
            <MessageInput focus Input={MessagingInput} />
          </Window>
          <Thread
            Message={MessageSimple}
            additionalMessageInputProps={{
              Input: MessagingInput,
            }}
          />
        </Channel>
      </Chat>
    </div>
  );
};

export default App;
