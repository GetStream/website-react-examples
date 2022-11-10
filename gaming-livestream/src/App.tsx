import React from 'react';

import './App.scss';

import { ChatUpgrades } from './components/ChatUpgrades/ChatUpgrades';
import { GamingChat } from './components/GamingChat/GamingChat';
import { LayoutControlProvider } from './context/LayoutController';
import { VideoStream } from './components/VideoStream';

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
