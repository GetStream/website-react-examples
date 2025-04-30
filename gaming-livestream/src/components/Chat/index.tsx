import React from 'react';
import {Chat} from 'stream-chat-react';

import {init} from 'emoji-mart';
import data from '@emoji-mart/data';

import {ChatUpgrades} from './ChatUpgrades';
import {GamingChatNotification} from './GamingChatNotification';
import {GamingParticipants} from './GamingParticipants';

import {getColor, getRandomUserRole, participants} from '../../assets/data';
import {useChecklist} from '../../hooks/useChecklistTasks';

import {useConnectUser} from '../../hooks/useConnectUser';
import {useLayoutController} from '../../context/LayoutController';
import {ChannelContainer} from "./ChannelContainer";

init({ data });

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
  const { memberListVisible, popUpText, upgradePanelVisible, chatVisible } = useLayoutController();
  const chatClient = useConnectUser(apiKey!, userToConnect, userToken);
  useChecklist({ chatClient, targetOrigin });

  if (!chatClient) return null;

  return (
    <section
      className={`sidebar ${memberListVisible} ${chatVisible} ${
        upgradePanelVisible ? 'show-upgrade' : ''
      }`}
    >
      <div className='chat-container'>
        <Chat client={chatClient}>
          <ChannelContainer/>
        </Chat>
        {popUpText && <GamingChatNotification text={popUpText} />}
      </div>
      <GamingParticipants participants={participants} />
      <ChatUpgrades />
    </section>
  );
};
