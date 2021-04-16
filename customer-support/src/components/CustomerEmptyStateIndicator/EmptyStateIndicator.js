import React from 'react';

import './EmptyStateIndicator.css';

const openingPrompts = [
  'I have a pricing question',
  'I have a question about Enterprise',
  'I would like to learn more about the company',
  'Other',
];

export const EmptyStateIndicator = ({ channel }) => {
  const sendInitialMessage = (prompt, index) => {
    channel.sendMessage({ text: prompt, index });
  };

  return (
    <div className='empty-state__container'>
      <p className='empty-state__heading'>How may we assist you?</p>
      <div className='empty-state__responses'>
        {openingPrompts.map((prompt, i) => {
          return (
            <div
              className='empty-state__response__wrapper'
              key={i}
              onClick={() => sendInitialMessage(prompt, i)}
            >
              <p className='empty-state__response__text'>{prompt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
