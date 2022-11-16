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
  const {hideUpgradePanel, publishAppNotification} = useLayoutController();

  const upgradeSelector = (index: number) => {
    if (upgradeSelected.includes(index)) {
      setUpgradeSelected(upgradeSelected.filter((item) => item !== index));
    } else {
      setUpgradeSelected((oldArr) => [...oldArr, index]);
    }
  };

  const handleClose = useCallback(() => {
    hideUpgradePanel();
    setUpgradeSelected([]);
  }, [hideUpgradePanel, setUpgradeSelected])

  const handleSubmit = useCallback(() => {
    if (upgradeSelected.length) {
      publishAppNotification('Thanks for upgrading!');
    }
    handleClose();
  }, [upgradeSelected, handleClose, publishAppNotification]);

  return (
    <div className='upgrade-container'>
      <div className='upgrade-header'>
        <button className='close-drawer-btn' onClick={handleClose}></button>
        <h2>Upgrade</h2>
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
