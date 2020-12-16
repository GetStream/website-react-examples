import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, MessageList, Thread, Window } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

import './GamingChat.scss';

import { GamingMessageInput } from '../GamingMessageInput/GamingMessageInput';
import { GamingParticipants } from '../GamingParticipants/GamingParticipants';

import UserIcon from '../../assets/icons/UserIcon';
import { getColor, participants } from '../../assets/data';

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

const channel = chatClient.channel('gaming', 'godevs', {
  image: 'https://cdn.chrisshort.net/testing-certificate-chains-in-go/GOPHER_MIC_DROP.png',
  name: 'Talk about Go',
});

export const GamingChat = (props) => {
  channel.watch();

  const [isTyping, setIsTyping] = useState(false);
  const [optionsSelected, setOptionsSelected] = useState(false);

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
      } ${props.showUpgrade ? 'show-upgrade' : ''}`}
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
                      }
                      props.setIsFullScreen((prevState) => !prevState);
                    }}
                  ></button>
                  <p>Live Chat</p>
                  <button
                    className='options-btn'
                    onClick={() => {
                      setOptionsSelected(!optionsSelected);
                    }}
                  ></button>
                  {optionsSelected && (
                    <ul className='options-container'>
                      <li
                        onClick={() => {
                          props.setShowMembers(true);
                          setOptionsSelected(false);
                        }}
                      >
                        Show Participants
                      </li>
                      <li
                        onClick={() => {
                          props.setShowMembers(false);
                          props.setShowUpgrade(true);
                          setOptionsSelected(false);
                        }}
                      >
                        Upgrade
                      </li>
                    </ul>
                  )}
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
