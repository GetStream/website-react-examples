import React, { useState } from 'react';

export const GamingChatHeader = (props) => {
  const {
    isFullScreen,
    setIsFullScreen,
    setShowMembers,
    setShowUpgrade,
    setTimestamp,
    showMembers,
    timestamp,
  } = props;

  const [optionsSelected, setOptionsSelected] = useState(false);

  const toggleTimestamp = () => {
    const elements = document.querySelectorAll('.timestamp');
    elements.forEach((element) => {
      if (timestamp) {
        element.style.display = 'none';
      } else {
        element.style.display = 'inline';
      }
    });
    setTimestamp(!timestamp);
    setOptionsSelected(false);
  };

  return (
    <div className='channel-header'>
      <button
        className='hide-btn'
        onClick={() => {
          if (showMembers) setShowMembers(false);
          setIsFullScreen(!isFullScreen);
        }}
      ></button>
      <p>Live Chat</p>
      <button className='options-btn' onClick={() => setOptionsSelected(!optionsSelected)}></button>
      {optionsSelected && (
        <ul className='options-container'>
          <li onClick={toggleTimestamp}>{timestamp ? 'Disable timestamp' : 'Enable timestamp'}</li>
          <li
            onClick={() => {
              setShowMembers(true);
              setOptionsSelected(false);
            }}
          >
            Participants
          </li>
          <li
            onClick={() => {
              setShowMembers(false);
              setShowUpgrade(true);
              setOptionsSelected(false);
            }}
          >
            Upgrade
          </li>
        </ul>
      )}
    </div>
  );
};
