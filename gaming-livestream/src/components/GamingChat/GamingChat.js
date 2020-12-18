import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, MessageList, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

import './GamingChat.scss';

import { GamingChatHeader } from './GamingChatHeader';
import { GamingMessage } from '../GamingMessage/GamingMessage';
import { GamingMessageInput } from '../GamingMessageInput/GamingMessageInput';
import { GamingParticipants } from '../GamingParticipants/GamingParticipants';
import { GamingThread } from '../GamingThread/GamingThread';

import { participants } from '../../assets/data';

const chatClient = new StreamChat('gx5a64bj4ptz');
const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoicmVzdGxlc3MtY2hlcnJ5LTUifQ.E6gVPqi-lhm-sUkpSyqf0VVtK1M6BsF3s8IAp2diS-g';
const userID = 'restless-cherry-5';

export const GamingChat = (props) => {
  const { isFullScreen, setShowMembers, showMembers, showUpgrade } = props;

  const [channel, setChannel] = useState(null);
  const [timestamp, setTimestamp] = useState(false);

  useEffect(() => {
    const loadChat = async () => {
      await chatClient.setUser(
        {
          id: userID,
          name: 'Restless cherry',
          image: 'https://getstream.io/random_png/?id=restless-cherry-5&name=Restless+cherry',
        },
        userToken,
      );

      const channel = await chatClient.channel('gaming', 'godevs', {
        image: 'https://cdn.chrisshort.net/testing-certificate-chains-in-go/GOPHER_MIC_DROP.png',
        name: 'Talk about Go',
      });

      await channel.watch();
      setChannel(channel);
    };

    loadChat();
  }, []);

  return (
    <section
      className={`chat-members-container ${showMembers ? 'show-members' : 'hide-members'} ${isFullScreen ? 'full-screen' : 'in-screen'} ${
        showUpgrade ? 'show-upgrade' : ''
      }`}
    >
      {channel && (
        <div className='chat-container'>
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <Window>
                <GamingChatHeader {...props} {...{ timestamp, setTimestamp }} />
                <MessageList Message={GamingMessage} />
                <GamingMessageInput focus />
              </Window>
              <GamingThread />
            </Channel>
          </Chat>
        </div>
      )}
      <GamingParticipants {...{ participants, showMembers, setShowMembers }} />
    </section>
  );
};
