import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, Window, Thread, Streami18n, enTranslations } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

import './App.css';

import { useChecklist } from './ChecklistTasks';
import { LiveEventChannelSwitch } from './components/LiveEventChannelSwitch/LiveEventChannelSwitch';
import { LiveEventMessage } from './components/LiveEventMessage/LiveEventMessage';
import { LiveEventMessageInput } from './components/LiveEventChannelFooter/LiveEventMessageInput';
import { LiveEventPanelists } from './components/LiveEventPanelists/LiveEventPanelists';

import { LiveVideoIcon } from './assets/LiveVideoIcon';
import { getRandomImage } from './assets/getRandomImage';

const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('apikey') || process.env.REACT_APP_STREAM_KEY;
const channelName = urlParams.get('channel') || 'demo';
const userId = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    ...enTranslations,
    Mute: 'Pin Message',
    Unmute: 'Unpin Message',
  },
});

const chatClient = StreamChat.getInstance(apiKey, { enableInsights: true, enableWSFallback: true });
chatClient.connectUser({ id: userId, image: getRandomImage() }, userToken);

const App = () => {
  const [channel, setChannel] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    if (!channel) {
      const getChannel = async () => {
        const newChannel = await chatClient.channel('livestream', channelName, {
          name: 'Virtual Event Demo',
        });

        if (!newChannel.state.members[userId]) {
          await newChannel.addMembers([userId]);
        }

        await newChannel.watch();
        setChannel(newChannel);
      };

      getChannel();
    }

    return () => {
      setChannel(null);
      chatClient.disconnectUser();
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    const handleThemeChange = (data) => {
      if (data === 'light' || data === 'dark') {
        setCurrentTheme(data);
      }
    };

    window.addEventListener('message', ({ data }) => handleThemeChange(data));
    return () => window.removeEventListener('message', ({ data }) => handleThemeChange(data));
  }, []);

  useChecklist(chatClient, targetOrigin);

  return (
    <>
      <div className='main-container'>
        <Chat client={chatClient} i18nInstance={i18nInstance} theme={`livestream ${currentTheme}`}>
          <div className='main-container-inner'>
            <div
              className='main-container-inner__left'
              style={
                currentTheme === 'light' ? { background: '#FFFFFF' } : { background: '#000000' }
              }
            >
              <div style={{ height: '100%', width: '100%', position: 'relative', flex: '0 0 55%' }}>
                <div className='live-video-icon'>
                  <LiveVideoIcon />
                </div>
                <iframe
                  title='science'
                  width='100%'
                  height='100%'
                  src='https://www.youtube.com/embed/_J4QPz52Sfo?autoplay=1&mute=1&modestbranding=1'
                  frameBorder='0px'
                  allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              </div>
              <div style={{ flex: '0 0 45%' }}>
                <LiveEventPanelists />
              </div>
            </div>
            <div className='main-container-inner__right'>
              {channel && (
                <Channel channel={channel}>
                  <Window hideOnThread>
                    <LiveEventChannelSwitch />
                  </Window>
                  <Thread
                    additionalMessageListProps={{ TypingIndicator: () => null }}
                    additionalMessageInputProps={{ grow: true }}
                    Message={LiveEventMessage}
                    Input={LiveEventMessageInput}
                  />
                </Channel>
              )}
            </div>
          </div>
        </Chat>
      </div>
    </>
  );
};

export default App;
