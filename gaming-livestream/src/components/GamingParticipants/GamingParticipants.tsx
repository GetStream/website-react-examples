import React, { ChangeEventHandler, useState } from 'react';

import { useLayoutController } from '../../context/LayoutController';
import { UserIcon } from '../Chat/UserIcon';
import type { ParticipantGroup, ParticipantsDataSet } from '../../assets/data';

type GamingParticipantsProps = {
  participants: ParticipantsDataSet
}

export const GamingParticipants = ({ participants }: GamingParticipantsProps) => {
  const {memberListVisible, hideMemberList } = useLayoutController();
  const [searchInput, setSearchInput] = useState('');

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchInput(e.target.value);
  };

  const participantFilter: ParticipantsDataSet = { ...participants };

  Object.keys(participants).forEach((category: ParticipantGroup) => {
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
    <div className={`members-container ${memberListVisible ? 'show' : 'hide'}`}>
      <div className='members-header'>
        <button className='close-participants-btn' onClick={hideMemberList}></button>
        <p>Participants (458K)</p>
        <div></div>
      </div>
      <div className='list-container'>
        <input
          className='members-container-input'
          placeholder='Search'
          value={searchInput}
          type='text'
          onChange={(e) => onChangeHandler(e)}
        />
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
                      <UserIcon type={participant.type}/>
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
