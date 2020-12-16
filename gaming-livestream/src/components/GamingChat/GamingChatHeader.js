import React, { useState } from 'react';

export const GamingChatHeader = (props) => {
  const { isFullScreen, setIsFullScreen, setShowMembers, setShowUpgrade, showMembers } = props;

  const [optionsSelected, setOptionsSelected] = useState(false);

  return (
    <div className='channel-header'>
      <button
        className='hide-btn'
        onClick={() => {
          if (showMembers) {
            setShowMembers(false);
          }
          setIsFullScreen(!isFullScreen);
        }}
      ></button>
      <p>Live Chat</p>
      <button className='options-btn' onClick={() => setOptionsSelected(!optionsSelected)}></button>
      {optionsSelected && (
        <ul className='options-container'>
          <li
            onClick={() => {
              setShowMembers(true);
              setOptionsSelected(false);
            }}
          >
            Show Participants
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
