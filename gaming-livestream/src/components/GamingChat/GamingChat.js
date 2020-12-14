import React, { useState } from 'react';
import './GamingChat.scss';
import { Chat, Channel, Thread, Window } from 'stream-chat-react';
import { MessageList } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';

import UserIcon from '../../assets/icons/UserIcon';

import 'stream-chat-react/dist/css/index.css';
import { GamingMessageInput } from '../GamingMessageInput/GamingMessageInput';
import { GamingParticipants } from '../GamingParticipants/GamingParticipants';

const chatClient = new StreamChat('gx5a64bj4ptz');
const userToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoicmVzdGxlc3MtY2hlcnJ5LTUifQ.E6gVPqi-lhm-sUkpSyqf0VVtK1M6BsF3s8IAp2diS-g';
const userID = 'restless-cherry-5';

chatClient.setUser(
  {
    id: userID,
    name: 'Restless cherry',
    image: 'https://getstream.io/random_png/?id=restless-cherry-5&name=Restless+cherry',
  },
  userToken,
);

const channel = chatClient.channel('messaging', 'godevs', {
  // add as many custom fields as you'd like
  image: 'https://cdn.chrisshort.net/testing-certificate-chains-in-go/GOPHER_MIC_DROP.png',
  name: 'Talk about Go',
});

const colors = ['#5096ff', '#e60053', '#00ddb5', '#dde100', '#8458ff', '#ffa800'];

const getColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export const GamingChat = (props) => {
  channel.watch();

  const [participants, setParticipants] = useState({
    Streamers: [{ name: 'PolarBear', color: '#5096ff', type: 'streamer' }],
    Moderators: [
      { name: 'Nava99', color: '#e60053', type: 'moderator' },
      { name: 'rawr2994', color: '#00ddb5', type: 'moderator' },
      { name: 'FrogPlanetB', color: '#dde100', type: 'moderator' },
      { name: 'Space_Cadet82', color: '#8458ff', type: 'moderator' },
    ],
    VIPs: [
      { name: 'craw85', color: '#5096ff', type: 'VIP' },
      { name: 'kiddwim', color: '#ffa800', type: 'VIP' },
      { name: 'idoltoren', color: '#8458ff', type: 'VIP' },
      { name: 'LLookket1', color: '#e60053', type: 'VIP' },
    ],
    Users: [
      { name: 'funkytallguy', color: '#e60053', type: 'user' },
      { name: 'HalfEntity', color: '#8458ff', type: 'user' },
      { name: 'homelessmango33', color: '#00ddb5', type: 'user' },
      { name: 'JijE34', color: '#ffa800', type: 'user' },
      { name: 'KingAhhRock', color: '#00ddb5', type: 'user' },
      { name: 'KSK999', color: '#dde100', type: 'user' },
      { name: 'Ladyprime91', color: '#ffa800', type: 'user' },
      { name: 'longshot123', color: '#8458ff', type: 'user' },
      { name: 'softpastel', color: '#00ddb5', type: 'user' },
      { name: 'NevRock', color: '#e60053', type: 'user' },
      { name: 'Sol_Invictus', color: '#5096ff', type: 'user' },
      { name: 'xzzeus', color: '#dde100', type: 'user' },
      { name: 'gotchasuckas', color: '#5096ff', type: 'user' },
      { name: 'FunRyder', color: '#00ddb5', type: 'user' },
    ],
  });

  const [isTyping, setIsTyping] = useState(false);

  channel.on('typing.start', (event) => {
    let isUser = event.user.id === userID;
    return !isUser ? setIsTyping(true) : null;
  });

  channel.on('typing.stop', (event) => {
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  });

  return (
    <section
      className={`chat-members-container ${props.showMembers ? 'show-members' : 'hide-members'} ${
        props.isFullScreen ? 'full-screen' : 'in-screen'
      }`}
    >
      {channel && (
        <div className='chat-container'>
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <Window>
                <div className='channel-header'>
                  <button
                    className='hide-btn'
                    onClick={() => {
                      if (props.showMembers) {
                        props.setShowMembers(false);
                        props.setIsFullScreen(true);
                      } else {
                        props.setIsFullScreen(true);
                      }
                    }}
                  ></button>
                  <p>Live Chat</p>
                  <button
                    className='options-btn'
                    onClick={() => {
                      props.setShowMembers(true);
                    }}
                  ></button>
                </div>
                <MessageList
                  Message={(props) => {
                    return (
                      <div className='custom-message'>
                        <UserIcon />
                        <p className='message-owner' style={{ color: getColor() }}>
                          {props.message.user.id}
                        </p>
                        <p className='message'>{props.message.text}</p>
                      </div>
                    );
                  }}
                />
                <GamingMessageInput focus isTyping={isTyping} />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      )}
      <GamingParticipants participants={participants} props setShowMembers={props.setShowMembers} />
    </section>
  );
};
