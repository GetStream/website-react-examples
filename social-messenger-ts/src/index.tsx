import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import { getImage } from './assets';
import { getChannelListOptions } from './channelListOptions';

const apiKey = process.env.REACT_APP_STREAM_KEY;
const urlParams = new URLSearchParams(window.location.search);
const user = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const noChannelNameFilter = urlParams.get('no_channel_name_filter') || false;
const skipNameImageSet = urlParams.get('skip_name_image_set') || false;

const channelListOptions = getChannelListOptions(!!noChannelNameFilter, user);
const userToConnect: { id: string; name?: string; image?: string } = {
  id: user!,
  name: skipNameImageSet ? undefined : user!,
  image: skipNameImageSet ? undefined : getImage(user!),
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);
root.render(
  <React.StrictMode>
    <App
      apiKey={apiKey!}
      userToConnect={userToConnect}
      userToken={userToken}
      targetOrigin={targetOrigin!}
      channelListOptions={channelListOptions}
    />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
