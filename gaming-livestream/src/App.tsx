import React from 'react';

import { ChatUpgrades } from './components/ChatUpgrades';
import { GamingChat } from './components/Chat';
import { VideoStream } from './components/VideoStream';

import { LayoutControlProvider } from './context/LayoutController';

const App = () => (
  <main>
    <div className='live-stream'>
      <LayoutControlProvider>
        <VideoStream />
        <GamingChat />
        <ChatUpgrades />
      </LayoutControlProvider>
    </div>
  </main>
);

export default App;
