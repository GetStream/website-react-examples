import React, { useState } from 'react';

import './ChatUpgrades.scss';

import { getImage, upgrades } from '../../assets/data';

export const ChatUpgrades = ({ setPopUpText, setShowUpgrade, setShowPopUp }) => {
  const [upgradeSelected, setUpgradeSelected] = useState([]);

  const upgradeSelector = (index) => {
    if (upgradeSelected.includes(index)) {
      setUpgradeSelected(upgradeSelected.filter((item) => item !== index));
    } else {
      setUpgradeSelected((oldArr) => [...oldArr, index]);
    }
  };

  return (
    <div className='upgrade-container'>
      <div className='upgrade-header'>
        <button onClick={() => setShowUpgrade(false)}></button>
        <p>Upgrade</p>
        <div></div>
      </div>
      <ul>
        {upgrades.map((option, i) => (
          <li
            className={upgradeSelected.includes(i) ? 'selected-button' : ''}
            onClick={() => upgradeSelector(i)}
            key={i}
          >
            {getImage(option.img)}
            <div className='description-container'>
              <p>{option.name}</p>
              <p>{option.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          if (upgradeSelected.length) {
            setPopUpText('Thanks for upgrading!');
            setShowPopUp(true);
          }
          setShowUpgrade(false);
        }}
      >
        Next
      </button>
    </div>
  );
};
