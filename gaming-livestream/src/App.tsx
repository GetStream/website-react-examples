import React from 'react';
import { GamingChat } from './components/Chat';
import { VideoStream } from './components/VideoStream';

import { LayoutControlProvider } from './context/LayoutController';

const App = () => (
  <main>
    <LayoutControlProvider>
        <VideoStream />
        <GamingChat />
    </LayoutControlProvider>
  </main>
);

export default App;
