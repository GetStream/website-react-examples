import React, { useState } from 'react';
import ModeratorIcon from '../../assets/icons/ModeratorIcon';
import StreamerIcon from '../../assets/icons/StreamerIcon';
import UserIcon from '../../assets/icons/UserIcon';
import VIPIcon from '../../assets/icons/VIPIcon';

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

export const GamingParticipants = (props) => {
  const { participants } = props;
  const [searchInput, setSearchInput] = useState('');

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
        {Object.keys(participantFilter).map((category, i) => {
          return (
            <div key={i} className='list-separator'>
              <div className='list-header'>
                <p>{category}</p>
              </div>
              <ul>
                {participantFilter[category].map((participant) => {
                  return (
                    <li key={participant.name}>
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
  );
};
