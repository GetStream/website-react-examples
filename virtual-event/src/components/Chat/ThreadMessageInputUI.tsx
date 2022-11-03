import React from 'react';
import { MessageInputUI } from './MessageInputUI';
import { useThreadInputContext } from '../../contexts/ThreadInputContext';

export const ThreadMessageInputUI = () => {
  const { footerChecked, toggleCheckedFooter } = useThreadInputContext();

  return (
    <>
      <MessageInputUI />
      <div className='thread-footer'>
        <input
          checked={footerChecked}
          className='thread-footer-checkbox'
          onChange={toggleCheckedFooter}
          type='checkbox'
        />
        <div className='thread-footer-text'>Send also as direct message</div>
      </div>
    </>
  );
};