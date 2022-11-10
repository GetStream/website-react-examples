import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { useLayoutController } from '../../context/LayoutController';

type GamingChatHeaderProps = {
  toggleTimestamp: MouseEventHandler<HTMLElement>;
  timestampEnabled: boolean;
}

export const GamingChatHeader = ({ toggleTimestamp, timestampEnabled }: GamingChatHeaderProps) => {
  const {hideChat, showUpgradePopup, showMemberList} = useLayoutController();
  const [showOptions, setShowOptions] = useState(false);
  const [optionsContainer, setOptionsContainerRef] = useState<HTMLUListElement | null>(null);

  const toggleShowOptions = useCallback(() => {
    setShowOptions((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!optionsContainer) return;
    const handleClick = () => {
        setShowOptions(false);
    }
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [optionsContainer]);

  return (
    <div className='channel-header'>
      <button
        className='hide-btn'
        onClick={hideChat}
      ></button>
      <p>Live Chat</p>
      <button className='options-btn' onClick={toggleShowOptions}></button>
      {showOptions && (
        <ul className='options-container' ref={setOptionsContainerRef}>
          <li onClick={toggleTimestamp}>{timestampEnabled ? 'Disable timestamp' : 'Enable timestamp'}</li>
          <li onClick={showMemberList}>Participants</li>
          <li onClick={showUpgradePopup}>Upgrade</li>
        </ul>
      )}
    </div>
  );
};
