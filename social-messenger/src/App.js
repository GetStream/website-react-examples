import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Avatar, Chat, Channel, ChannelList, MessageList, MessageInput, Window } from 'stream-chat-react';
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

const image = require('./assets/stream.png');
const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('apikey') || process.env.REACT_APP_STREAM_KEY;
const user = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const filters = { type: 'messaging', name: 'Social Demo' };
const options = { state: true, watch: true, presence: true, limit: 8 };
const sort = {
  last_message_at: -1,
  updated_at: -1,
  cid: 1,
};

const chatClient = StreamChat.getInstance(apiKey);
chatClient.connectUser({ id: user, name: user, image: getRandomImage() }, userToken);

function getWindowWidth() {
  const { innerWidth: width } = window;
  return width;
}

const App = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());
  const [showMessages, setShowMessages] = useState(false);

  useChecklist(chatClient, targetOrigin);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth());
    }
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth]);

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

  const getMobileView = () => {
    if (isCreating) {
      return (
        <div>
          <div id="content-mobile" onClick={() => {
            setIsCreating(false);
            setShowMessages(false);
          }}>
            <Avatar className='mobile-header-image' image={image} size={40} />
          </div>
          <Channel maxNumberOfFiles={10} multipleUploads={true}>
            <CreateChannel onClose={() => setIsCreating(false)} />
          </Channel>
        </div>
      )
    }

    if (showMessages) {
      return (
        <div>
          <div id="content-mobile" onClick={() => {
            setShowMessages(false);
            setIsCreating(false);
          }}>
            <Avatar className='mobile-header-image' image={image} size={40} />
          </div>
          <Channel className='mobile' maxNumberOfFiles={10} multipleUploads={true}>
            <Window>
              <MessagingChannelHeader />
              <MessageList Message={CustomMessage} TypingIndicator={() => null} />
              <MessageInput focus Input={MessagingInput} />
            </Window>
            <MessagingThread />
          </Channel>
        </div>
      )
    }

    return (
      <div onClick={() => setShowMessages(true)}>
      <ChannelList
        filters={filters}
        sort={sort}
        options={options}
        List={(props) => <MessagingChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />}
        Preview={(props) => <MessagingChannelPreview {...props} {...{ setIsCreating }} />}
        />
      </div>

    )
  }

  return (
      <Chat client={chatClient} theme={`messaging ${theme}`}>
        {windowWidth > 640 ?
        <div>
          <ChannelList
            filters={filters}
            sort={sort}
            options={options}
            List={(props) => <MessagingChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />}
            Preview={(props) => <MessagingChannelPreview {...props} {...{ setIsCreating }} />}
          />
          <Channel maxNumberOfFiles={10} multipleUploads={true}>
            {isCreating && <CreateChannel onClose={() => setIsCreating(false)} />}
            <Window>
              <MessagingChannelHeader />
              <MessageList Message={CustomMessage} TypingIndicator={() => null} />
              <MessageInput focus Input={MessagingInput} />
            </Window>
            <MessagingThread />
          </Channel>
        </div> : 
        getMobileView()
        }
      </Chat>
  );
};

export default App;
