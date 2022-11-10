import React, { useEffect, useState } from 'react';
import { Channel, Chat } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

import { GamingChatInner } from './GamingChatInner';
import { GamingParticipants } from './GamingParticipants';
import { GamingThreadHeader } from './GamingThreadHeader';

import { getColor, getRandomUserRole, participants } from '../../assets/data';

import { useChecklist } from '../../hooks/useChecklistTasks';
import { useConnectUser } from '../../hooks/useConnectUser';
import { useLayoutController } from '../../context/LayoutController';

import type { Channel as ChannelT } from 'stream-chat';
import type { StreamChatType } from '../../types';

const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('apikey') || process.env.REACT_APP_STREAM_KEY;
const userId = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;
const targetOrigin = urlParams.get('target_origin') || process.env.REACT_APP_TARGET_ORIGIN;

const userToConnect = {
  id: userId!,
  color: getColor(),
  userRole: getRandomUserRole(),
};

export const GamingChat = () => {
  const [channel, setChannel] = useState<ChannelT<StreamChatType> | null>(null);
  const {memberListVisible, showUpgrade, isFullScreen} = useLayoutController();
  const chatClient = useConnectUser<StreamChatType>(apiKey!, userToConnect, userToken);
  useChecklist({chatClient, targetOrigin});

  useEffect(() => {
    if (!chatClient) return;

    const loadChat = async () => {
      const channel = chatClient.channel('gaming', 'gaming-demo', { name: 'Gaming Demo' });
      await channel.watch();
      setChannel(channel);
    };

    loadChat();
  }, [chatClient]);


  if (!chatClient) return null;

  return (
    <section
      className={`chat-members-container ${memberListVisible ? 'show-members' : 'hide-members'} ${
        isFullScreen ? 'full-screen' : 'in-screen'
      } ${showUpgrade ? 'show-upgrade' : ''}`}
    >
      {channel && (
        <div className='chat-container'>
          <Chat client={chatClient}>
            <Channel channel={channel} ThreadHeader={GamingThreadHeader}>
              <GamingChatInner />
            </Channel>
          </Chat>
        </div>
      )}
      <GamingParticipants participants={participants} />
    </section>
  );
};
