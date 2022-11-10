import React, { ComponentType, useCallback, useState } from 'react';

import { upgrades } from '../../assets/data';
import { useLayoutController } from '../../context/LayoutController';
import InfiniteIcon from '../../assets/icons/InfiniteIcon';
import BellIcon from '../../assets/icons/BellIcon';
import HandIcon from '../../assets/icons/HandIcon';
import MemberIcon from '../../assets/icons/MemberIcon';

type UpgradeImageType = 'infinite' | 'bell' | 'hand' | 'member' | string;

type UpgradeIconProps = {
  type: UpgradeImageType
}
const UpgradeIcon = ({type}: UpgradeIconProps) => {
  const icons: Record<UpgradeImageType, ComponentType> = {
    'infinite': InfiniteIcon,
    'bell': BellIcon,
    'hand': HandIcon,
    'member': MemberIcon,
  };
  const Icon = icons[type];

  return Icon ? <Icon/> : null;
};

export const ChatUpgrades = () => {
  const [upgradeSelected, setUpgradeSelected] = useState<number[]>([]);
  const {showUpgrade, hideUpgradePopup, publishAppNotification} = useLayoutController();

  const upgradeSelector = (index: number) => {
    if (upgradeSelected.includes(index)) {
      setUpgradeSelected(upgradeSelected.filter((item) => item !== index));
    } else {
      setUpgradeSelected((oldArr) => [...oldArr, index]);
    }
  };

  const handleSubmit = useCallback(() => {
    if (upgradeSelected.length) {
      publishAppNotification('Thanks for upgrading!');
    }
    hideUpgradePopup();
  }, [upgradeSelected, hideUpgradePopup, publishAppNotification])

  if (!showUpgrade) return null;

  return (
    <div className='upgrade-container'>
      <div className='upgrade-header'>
        <button onClick={hideUpgradePopup}></button>
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
            <UpgradeIcon type={option.img}/>
            <div className='description-container'>
              <p>{option.name}</p>
              <p>{option.description}</p>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};
