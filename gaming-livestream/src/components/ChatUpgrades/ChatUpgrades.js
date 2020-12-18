import React from 'react';

import './ChatUpgrades.scss';

import { getImage, upgrades } from '../../assets/data';

export const ChatUpgrades = ({ setShowUpgrade }) => {
  return (
    <div className='upgrade-container'>
      <div className='upgrade-header'>
        <button onClick={() => setShowUpgrade(false)}></button>
        <p>Upgrade</p>
        <div></div>
      </div>
      <ul>
        {upgrades.map((option, i) => (
          <li key={i}>
            {getImage(option.img)}
            <div className='description-container'>
              <p>{option.name}</p>
              <p>{option.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => setShowUpgrade(false)}>Next</button>
    </div>
  );
};
