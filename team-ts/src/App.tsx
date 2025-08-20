import {useEffect} from 'react';
import {StreamChat, TextComposerMiddleware} from 'stream-chat';
import {Chat} from 'stream-chat-react';

import {getRandomImage} from './assets';
import {useChecklist} from './ChecklistTasks';
import {ChannelContainer} from './components/ChannelContainer/ChannelContainer';
import {Sidebar} from './components/Sidebar/Sidebar';

import {WorkspaceController} from './context/WorkspaceController';

import {
  createDraftGiphyCommandInjectionMiddleware,
  createGiphyCommandInjectionMiddleware
} from "./middleware/composition/giphyCommandInjectionMiddleware";
import {createGiphyCommandControlMiddleware} from "./middleware/textComposition/giphyCommandControl";

const urlParams = new URLSearchParams(window.location.search);

const apiKey = urlParams.get('apikey') || process.env.REACT_APP_STREAM_KEY;
const user = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const theme = urlParams.get('theme') || 'light';
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const client = StreamChat.getInstance(apiKey!, { enableInsights: true, enableWSFallback: true });
client.connectUser({ id: user!, name: user, image: getRandomImage() }, userToken);

const App = () => {
  useChecklist({ chatClient: client, targetOrigin: targetOrigin! });

  useEffect(() => {
    if (!client) return;

    client.setMessageComposerSetupFunction(({ composer }) => {
      composer.compositionMiddlewareExecutor.insert({
        middleware: [
          createGiphyCommandInjectionMiddleware(composer)
        ],
        position: {after: 'stream-io/message-composer-middleware/attachments'}
      });
      composer.draftCompositionMiddlewareExecutor.insert({
        middleware: [
          createDraftGiphyCommandInjectionMiddleware(composer)
        ],
        position: {after: 'stream-io/message-composer-middleware/draft-attachments'}
      });
      composer.textComposer.middlewareExecutor.insert({
        middleware: [
          createGiphyCommandControlMiddleware(composer) as TextComposerMiddleware,
        ],
        position: {before: 'stream-io/text-composer/pre-validation-middleware'}
      })
    });
  }, []);

  useEffect(() => {
    const handleColorChange = (color: string) => {
      const root = document.documentElement;
      if (color.length && color.length === 7) {
        root.style.setProperty('--primary-color', `${color}E6`);
        root.style.setProperty('--primary-color-alpha', `${color}1A`);
      }
    };

    window.addEventListener('message', (event) => handleColorChange(event.data));
    return () => {
      client.disconnectUser();
      window.removeEventListener('message', (event) => handleColorChange(event.data));
    };
  }, []);

  return (
    <>
      <div className='app__wrapper str-chat'>
        <Chat client={client } theme={`team ${theme}`}>
          <WorkspaceController>
            <Sidebar />
            <ChannelContainer />
          </WorkspaceController>
        </Chat>
      </div>
    </>
  );
};

export default App;
