import React, { useState } from 'react';
import './GamingChat.scss';
import { Chat, Channel, Thread, Window } from 'stream-chat-react';
import { MessageList, MessageInput } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';

import StreamerIcon from '../../assets/icons/StreamerIcon';
import ModeratorIcon from '../../assets/icons/ModeratorIcon';
import VIPIcon from '../../assets/icons/VIPIcon';
import UserIcon from '../../assets/icons/UserIcon';
import StarIcon from '../../assets/icons/StarIcon';
import SendIcon from '../../assets/icons/SendIcon';

import 'stream-chat-react/dist/css/index.css';

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

const getIcon = (type) => {
  switch (type) {
    case 'streamer':
      return <StreamerIcon />;
    case 'moderator':
      return <ModeratorIcon />;
    case 'VIP':
      return <VIPIcon />;
    case 'user':
      return <UserIcon />;
    default:
      break;
  }
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

  const [searchInput, setSearchInput] = useState('');
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

  const onChangeHandler = (e) => {
    setSearchInput(e.target.value);
  };

  const participantFilter = { ...participants };

  Object.keys(participants).forEach((category) => {
    participantFilter[category] = participantFilter[category].filter((part) => {
      let lowerCaseName = part.name.toLowerCase();
      if (lowerCaseName.includes(searchInput.toLowerCase())) {
        return part;
      } else {
        return null;
      }
    });
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
                <div className='channel-footer'>
                  <MessageInput />
                  <div className='channel-footer-separator'>
                    <div className='watcher-count'>
                      <StarIcon />
                      <p>68</p>
                    </div>
                    {isTyping && (
                      <div className='typing-indicators'>
                        <div className='indicators'>
                          {[1, 2, 3].map((item, i) => (
                            <div className='dot' style={{ animationDelay: i * 0.2 + 's' }}></div>
                          ))}
                        </div>
                        <p>a member is typing</p>
                      </div>
                    )}
                    <button>
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      )}
      <div className={`members-container ${props.showMembers ? 'show' : 'hide'}`}>
        <div className='members-header'>
          <button
            className='close-participants-btn'
            onClick={() => {
              props.setShowMembers(false);
            }}
          ></button>
          <p>Participants (458K)</p>
          <div></div>
        </div>
        <div className='list-container'>
          <input placeholder='Search' value={searchInput} type='text' onChange={(e) => onChangeHandler(e)} />
          {Object.keys(participantFilter).map((category) => {
            return (
              <div className='list-separator'>
                <div className='list-header'>
                  <p>{category}</p>
                </div>
                <ul>
                  {participantFilter[category].map((participant) => {
                    return (
                      <li>
                        {getIcon(participant.type)}
                        <p style={{ color: participant.color }}>{participant.name}</p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
