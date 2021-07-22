import React, { useEffect, useState } from 'react';
import { ChannelSort, LiteralStringForUnion, StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelList } from 'stream-chat-react';
import { useChecklist } from './ChecklistTasks';

import 'stream-chat-react/dist/css/index.css';
import './App.css';

import {
  CreateChannel,
  CustomMessage,
  MessagingChannelList,
  MessagingChannelPreview,
  MessagingInput,
  MessagingThreadHeader,
} from './components';

import { getRandomImage } from './assets';
import { ChannelInner } from './components/ChannelInner/ChannelInner';

const urlParams = new URLSearchParams(window.location.search);

const apiKey = process.env.REACT_APP_STREAM_KEY;
const user = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const noChannelNameFilter = urlParams.get('no_channel_name_filter') || false;
const skipNameImageSet = urlParams.get('skip_name_image_set') || false;

const filters = noChannelNameFilter
  ? { type: 'messaging', members: { $in: [user!] } }
  : { type: 'messaging', name: 'Social Demo', demo: 'social' };

const options = { state: true, watch: true, presence: true, limit: 8 };

const sort: ChannelSort = {
  last_message_at: -1,
  updated_at: -1,
  cid: 1,
};

const userToConnect: { id: string; name?: string; image?: string } = {
  id: user!,
  name: user!,
  image: getRandomImage(),
};

if (skipNameImageSet) {
  delete userToConnect.name;
  delete userToConnect.image;
}

export type AttachmentType = {};
export type ChannelType = { demo?: string };
export type CommandType = LiteralStringForUnion;
export type EventType = {};
export type MessageType = {};
export type ReactionType = {};
export type UserType = { image?: string };

export const GiphyContext = React.createContext(
  {} as { giphyState: boolean; setGiphyState: React.Dispatch<React.SetStateAction<boolean>> },
);

const App = () => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [giphyState, setGiphyState] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isMobileNavVisible, setMobileNav] = useState(false);
  const [theme, setTheme] = useState('dark');

  useChecklist(chatClient, targetOrigin!);

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance<
        AttachmentType,
        ChannelType,
        CommandType,
        EventType,
        MessageType,
        ReactionType,
        UserType
      >(apiKey!);
      await client.connectUser(userToConnect, userToken);
      setChatClient(client);
    };

    initChat();

    return () => {
      chatClient?.disconnectUser();
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    const handleThemeChange = ({ data, origin }: { data: string; origin: string }) => {
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
    if (isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.add('show');
      document.body.style.overflow = 'hidden';
    } else if (!isMobileNavVisible && mobileChannelList) {
      mobileChannelList.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
  }, [isMobileNavVisible]);

  useEffect(() => {
    /*
     * Get the actual rendered window height to set the container size properly.
     * In some browsers (like Safari) the nav bar can override the app.
     */
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    setAppHeight();

    window.addEventListener('resize', setAppHeight);
    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  const toggleMobile = () => setMobileNav(!isMobileNavVisible);

  const giphyContextValue = { giphyState, setGiphyState };

  if (!chatClient) return null;

  return (
    <Chat client={chatClient} theme={`messaging ${theme}`}>
      <div id='mobile-channel-list' onClick={toggleMobile}>
        <ChannelList
          filters={filters}
          sort={sort}
          options={options}
          List={(props) => (
            <MessagingChannelList {...props} onCreateChannel={() => setIsCreating(!isCreating)} />
          )}
          Preview={(props) => <MessagingChannelPreview {...props} {...{ setIsCreating }} />}
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
          <GiphyContext.Provider value={giphyContextValue}>
            <ChannelInner theme={theme} toggleMobile={toggleMobile} />
          </GiphyContext.Provider>
        </Channel>
      </div>
    </Chat>
  );
};

export default App;
