import React, {ChangeEventHandler, useCallback, useState} from 'react';

import { UserIcon } from './UserIcon';
import { useLayoutController } from '../../context/LayoutController';

import type { ParticipantGroup, ParticipantsDataSet } from '../../assets/data';

type GamingParticipantsProps = {
  participants: ParticipantsDataSet
}

export const GamingParticipants = ({ participants }: GamingParticipantsProps) => {
  const {hideMemberList } = useLayoutController();
  const [searchInput, setSearchInput] = useState('');

  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);

  const handleClose = useCallback(() => {
    setSearchInput('');
    hideMemberList();
  }, [hideMemberList]);


  const participantFilter = {...participants};
  Object.keys(participants).forEach((category: ParticipantGroup) => {
    participantFilter[category] = participantFilter[category].filter((part) => {
      return part.name.match(new RegExp(searchInput, 'i')) ? part : null
    });
  });

  return (
    <div className={`members-container`}>
      <div className='members-header'>
        <button className='close-drawer-btn' onClick={handleClose}></button>
        <h2>Participants (458K)</h2>
      </div>
      <div className='participant-list__container'>
        <input
          className='members-container-input'
          placeholder='Search'
          value={searchInput}
          type='text'
          onChange={(e) => onChangeHandler(e)}
        />
        {Object.keys(participantFilter).map((category, i) => {
          return (
            <div key={i} className='participant-group'>
              <div className='participant-group__header'>
                {category}
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
