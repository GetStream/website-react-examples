import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';

import { useLayoutController } from '../../context/LayoutController';

type GamingChatHeaderProps = {
  toggleTimestamp: MouseEventHandler<HTMLElement>;
  timestampEnabled: boolean;
}

export const GamingChatHeader = ({ toggleTimestamp, timestampEnabled }: GamingChatHeaderProps) => {
  const {hideChat, showUpgradePanel, showMemberList} = useLayoutController();
  const [showOptions, setShowOptions] = useState(false);
  const [optionsContainer, setOptionsContainerRef] = useState<HTMLUListElement | null>(null);

  const toggleShowOptions: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.stopPropagation();
    setShowOptions((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!(optionsContainer)) return;
    const handleClick = () => {
      setShowOptions(false);
    }
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    }
  }, [showOptions, optionsContainer]);

  return (
    <div className='channel-header'>
      <button className='hide-btn' onClick={hideChat}/>
      <h2>Live Chat</h2>
      <button className='options-btn' onClick={toggleShowOptions}></button>
      {showOptions && (
        <ul className='options-container' ref={setOptionsContainerRef}>
          <li onClick={toggleTimestamp}>{timestampEnabled ? 'Disable timestamp' : 'Enable timestamp'}</li>
          <li onClick={showMemberList}>Participants</li>
          <li onClick={showUpgradePanel}>Upgrade</li>
        </ul>
      )}
    </div>
  );
};
