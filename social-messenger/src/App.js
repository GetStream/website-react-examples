import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelList, MessageList, MessageInput, Window } from 'stream-chat-react';
import { useChecklist } from './ChecklistTasks';

import 'stream-chat-react/dist/css/index.css';
import './App.css';

import {
  CreateChannel,
  CustomMessage,
  MessagingChannelHeader,
  MessagingChannelList,
  MessagingChannelPreview,
  MessagingInput,
  MessagingThread,
} from './components';

import { getRandomImage } from './assets';

const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('apikey') || process.env.REACT_APP_STREAM_KEY;
const user = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const filters =
  user === 'summer-brook-2' ? { type: 'messaging', members: { $in: ['summer-brook-2'] } } : { type: 'messaging', name: 'Social Demo' };
const options = { state: true, watch: true, presence: true, limit: 8 };
const sort = {
  last_message_at: -1,
  updated_at: -1,
  cid: 1,
};

const chatClient = StreamChat.getInstance(apiKey);
chatClient.connectUser({ id: user, name: user, image: getRandomImage() }, userToken);

const App = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isMobileNavVisible, setMobileNav] = useState(false);
  const [theme, setTheme] = useState('dark');

  useChecklist(chatClient, targetOrigin);

  useEffect(() => {
    const handleThemeChange = ({ data, origin }) => {
      // handle events only from trusted origin
      if (origin === targetOrigin) {
        if (data === 'light' || data === 'dark') {
          setTheme(data);
        }
      }
    };

    window.addEventListener('message', handleThemeChange);
    return () => window.removeEventListener('message', handleThemeChange);
  }, []);

  useEffect(() => {
    const mobileChannelList = document.querySelector('#mobile-channel-list');
    if (isMobileNavVisible) {
      mobileChannelList.classList.add('show');
      document.body.style.overflow = 'hidden';
    } else {
      mobileChannelList.classList.remove('show');
      document.body.style.overflow = 'auto';
    }

  }, [isMobileNavVisible]);

  const toggleMobile = () => {
    const isVisible = isMobileNavVisible;
    setMobileNav(!isVisible);
  }

  return (
    <Chat client={chatClient} theme={`messaging ${theme}`}>
      <div id="mobile-channel-list" onClick={() => toggleMobile()}>
        <ChannelList
          filters={filters}
          sort={sort}
          options={options}
          List={(props) => <MessagingChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />}
          Preview={(props) => <MessagingChannelPreview {...props} {...{ setIsCreating }} />}
        />
      </div>
      <div>
        <Channel maxNumberOfFiles={10} multipleUploads={true}>
          {isCreating && <CreateChannel onClose={() => setIsCreating(false)} />}
          <Window>
            <MessagingChannelHeader toggled={toggleMobile} />
            <MessageList Message={CustomMessage} TypingIndicator={() => null} />
            <MessageInput focus Input={MessagingInput} />
          </Window>
          <MessagingThread />
        </Channel>
      </div>
    </Chat>
  );
};

export default App;
