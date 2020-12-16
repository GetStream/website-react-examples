/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, Window, Thread, Streami18n, enTranslations } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';
import './App.css';
// import { LiveVideoIcon } from './assets/LiveVideoIcon';
import { LiveEventChannelFooter } from './components/LiveEventChannelFooter/LiveEventChannelFooter';
import { LiveEventChannelSwitch } from './components/LiveEventChannelSwitch/LiveEventChannelSwitch';
import { LiveEventMessage } from './components/LiveEventMessage/LiveEventMessage';
import { LiveEventWindowControls } from './components/LiveEventWindowControls/LiveEventWindowControls';

const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('apikey') || process.env.REACT_APP_STREAM_KEY;
const channelName = urlParams.get('channel') || 'demo';
const user = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;

const i18nInstance = new Streami18n({
  language: 'en',
  translationsForLanguage: {
    ...enTranslations,
    Mute: 'Pin Message',
    Unmute: 'Unpin Message',
  },
});
const chatClient = new StreamChat(apiKey);

const App = () => {
  const [channel, setChannel] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    const getChannel = async () => {
      await chatClient.setUser({ id: user }, userToken);
      const channelCreator = await chatClient.channel('livestream', channelName, {
        image:
          'https://images.unsplash.com/photo-1512138664757-360e0aad5132?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2851&q=80',
        name: 'Example User',
        example: 1,
      });
      await channelCreator.watch();
      setChannel(channelCreator);
    };
    if (chatClient) {
      getChannel();
    }
  }, []);

  return (
    <div>
      <LiveEventWindowControls currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} />
      <div className='main-container'>
        <Chat client={chatClient} i18nInstance={i18nInstance} theme={`livestream ${currentTheme}`}>
          <div className='main-container-inner'>
            <div
              className='main-container-inner__left'
              style={currentTheme === 'light' ? { background: '#FFFFFF' } : { background: '#000000' }}
            >
              <div style={{ height: '100%', width: '100%' }}>
                {/* <div className="live-video-icon">
                  <LiveVideoIcon />
                </div> */}
                <iframe
                  title='science'
                  width='100%'
                  height='100%'
                  src='https://www.youtube.com/embed/_J4QPz52Sfo?autoplay=1&mute=1'
                  frameBorder='0px'
                  allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                ></iframe>
              </div>
              <div>
                <img
                  alt=''
                  style={{ maxHeight: '100%', maxWidth: '100%' }}
                  src={currentTheme === 'light' ? require('./assets/VideoFooter.png') : require('./assets/VideoFooterDark.png')}
                ></img>
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
                    Message={LiveEventMessage}
                    MessageInput={LiveEventChannelFooter}
                  />
                </Channel>
              )}
            </div>
          </div>
        </Chat>
      </div>
    </div>
  );
};

export default App;
